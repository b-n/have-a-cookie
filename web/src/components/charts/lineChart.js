import {Component} from 'preact'
import {withFauxDOM} from 'react-faux-dom'
import deepEqual from 'deep-equal'
import debounce from 'debounce'

import { select } from 'd3-selection'
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3-scale'
import { extent, min } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { line } from 'd3-shape'
import 'd3-transition'

import { flattenData, padArray } from '../../lib/array'
import { getChartSizesFromElem, setElemSize, drawChartArea, setClipPathSize, drawAxes, updateAxes } from './lib'

class LineChart extends Component {
    constructor() {
        super()
        this.setState({
            isRendering: true,
            container: {
                width: null,
                height: null,
            },
            chart: {
                width: null,
                height: null,
                margin: {
                    top: null,
                    right: null,
                    bottom: null,
                    left: null,
                },
            },
            scales: {
                x: null,
                y: null,
                group: null,
            },
            axes: {
                x: null,
                y: null,
            },
        })

        this.onTick = this.onTick.bind(this)
        this.onWindowResized = this.onWindowResized.bind(this)

        this.onWindowResize = debounce(this.onWindowResized, 300)
    }

    componentDidMount() {
        if (this.props.updateInterval) {
            this.interval = setInterval(this.onTick, this.props.updateInterval)
        }
        this.onInit()

        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }

    componentDidUpdate(prevProps, prevState) {
        if (!deepEqual(this.props.data, prevProps.data)) {
            this.onDataChanged()
        }
    }

    onInit() {
        this.setState(getChartSizesFromElem(this.chartDiv))
        this.setScales(this.props.data, this.state.chart)
        this.setAxes()

        const svg = this.getSvg()
        setElemSize(svg, this.state.container)

        const chartArea = drawChartArea(svg, this.state.chart.margin)
        setClipPathSize(chartArea, this.state.chart)
        drawAxes(chartArea, this.state.axes, this.state.chart.height)

        this.renderd3(chartArea)
        this.setState({ isRendering: false })
    }

    onWindowResized() {
        this.setState(getChartSizesFromElem(this.chartDiv))
        this.setScaleRange(this.state.chart)

        const svg = this.getSvg()
        setElemSize(svg, this.state.container)

        const chartArea = svg.select('g')
        setClipPathSize(chartArea, this.state.chart)
        this.renderd3(chartArea)
    }

    onDataChanged() {
        this.setScaleDomain(this.props.data)

        const svg = this.getSvg()
        this.renderd3(svg.select('g'))
    }

    onTick() {
        const svg = this.getSvg()
        this.renderd3(svg.select('g'))
    }


    getSvg() {
        const { isRendering } = this.state
        const faux = this.props.connectFauxDOM('div', 'chart')
        return isRendering
            ? select(faux).append('svg')
            : select(faux).select('svg')
    }

    setScales(data, { width, height }) {
        this.setState({
            scales: {
                x: scaleTime(),
                y: scaleLinear(),
                group: scaleOrdinal(schemeCategory10),
            },
        })
        this.setScaleDomain(data)
        this.setScaleRange({ width, height })
    }

    setScaleDomain(data) {
        const flatData = flattenData(data)
        const { x, y, group } = this.state.scales

        x.domain([min(flatData, d => d.datetime), new Date()])
        y.domain(padArray(extent(flatData, d => d.weight), 0.01))
        group.domain(data.map(d => d.id))

        this.setState({ scales: { x, y, group }})
    }

    setScaleRange({ width, height }) {
        const { x, y } = this.state.scales

        x.range([0, width])
        y.range([height, 0])

        this.setState({ scales: { ...this.state.scales, x, y }})
    }

    setAxes() {
        const { x, y } = this.state.scales
        this.setState({
            axes: {
                x: axisBottom().scale(x),
                y: axisLeft().scale(y),
            },
        })
    }

    render() {
        const { width, height } = this.props
        const style = `
            ${width != 'auto' ? 'width: ' + width + 'px;' : '' }
            height: ${height}px;
        `
        return (
            <div ref={div => {this.chartDiv = div}} style={style}>
                {this.props.chart}
            </div>
        )
    }

    renderd3(g) {
        const { data } = this.props
        const { x, y, group } = this.state.scales

        updateAxes(g, this.state.axes, this.state.isRendering)

        const lineZero = line()
            .x(d => x(d.datetime))
            .y(d => y(0))

        const lineWeight = line()
            .x(d => x(d.datetime))
            .y(d => y(d.weight))

        // grids
        const { width, height } = this.state.chart
        g.selectAll('.grid-y')
            .data(y.ticks())
            .enter()
              .append('line')
                .attr('class', 'grid grid-y')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', height)
                .attr('y2', height)
                .style('stroke-opacity', 0.0)

        g.selectAll('.grid-x')
            .data(x.ticks())
            .enter()
              .append('line')
                .attr('class', 'grid grid-x')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', height)
                .style('stroke-opacity', 0.0)

        g.selectAll('.grid-y')
            .transition()
            .duration(800)
                .attr('x2', width)
                .attr('y1', d => y(d))
                .attr('y2', d => y(d))
                .style('stroke-opacity', 1)

        g.selectAll('.grid-x')
            .transition()
            .duration(800)
                .attr('x1', d => x(d))
                .attr('x2', d => x(d))
                .attr('y2', height)
                .style('stroke-opacity', 1)

        // data!
        const users = g.selectAll('.person')
            .data(data, d => d.id)

        const newUserGroups = users.enter()
            .append('g')
                .attr('class', 'person')

        // set up line and markers
        newUserGroups
            .append('path')
              .attr('class', 'line')
              .attr('clip-path', 'url(#clip)')
              .attr('d', d => lineZero(d.data))
              .style('stroke', d => group(d.id))
              .style('fill', 'none')
              .style('stroke-width', '2px')

        newUserGroups
            .selectAll('circle')
            .data(d => d.data)
            .enter().append('circle')
                .attr('clip-path', 'url(#clip)')
                .attr('fill', d => group(d.id))
                .attr('r', 3)
                .attr('cx', d => x(d.datetime))
                .attr('cy', d => y(0))

        // animate transition(s)
        g.selectAll('.person')
            .selectAll('circle')
            .transition()
            .duration(800)
            .attr('cx', d => x(d.datetime))
            .attr('cy', d => y(d.weight))

        g.selectAll('.person')
            .select('path')
                .transition()
                .duration(800)
                .attr('d', d=> lineWeight(d.data))

        this.props.animateFauxDOM(1000)
    }
}

LineChart.defaultProps = {
    chart: 'loading',
    width: 'auto',
    height: 300,
    updateInterval: null,
}

export default withFauxDOM(LineChart)
