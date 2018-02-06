import {Component} from 'preact'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'
import deepEqual from 'deep-equal'

class LineChart extends Component {
    constructor() {
        super()
        this.setState({
            secondsElapsed: 0,
            width: null,
            height: null,
            margin: {},
            scales: {},
        })
        this.tick = this.tick.bind(this)
        this.getBoundingBoxes = this.getBoundingBoxes.bind(this)
    }

    tick() {
        this.setState({ secondsElapsed: this.state.secondsElapsed + 1 })
    }

    componentDidMount() {
        if (this.props.updateInterval) {
            this.interval = setInterval(this.tick, this.props.updateInterval)
        }
        this.renderd3('render')
    }

    componentDidUpdate(prevProps, prevState) {
        if (!deepEqual(this.props.data, prevProps.data) ||
            !deepEqual(this.props.windowSize, prevProps.windowSize) ||
            this.state.secondsElapsed != prevState.secondsElapsed) {
            this.renderd3('update')
        }
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

    getSvg(faux, isRender) {
        const svg = isRender
            ? d3.select(faux).append('svg')
            : d3.select(faux).select('svg')

        svg.attr('width', this.chartDiv.offsetWidth)
            .attr('height', this.chartDiv.offsetHeight)

        return svg
    }

    getDrawArea(svg, isRender) {
        const { margin, width, height } = this.getBoundingBoxes()

        const g = isRender
            ? svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
            : svg.select('g')

        const clipPath = isRender
            ? g.append('clipPath').append('rect')
            : g.select('clipPath').select('rect')

        clipPath
            .attr('width', width)
            .attr('height', height)

        return g
    }

    getBoundingBoxes() {
        const container = {
            width: this.chartDiv.offsetWidth,
            height: this.chartDiv.offsetHeight,
        }
        const margin = { top: 20, right: 20, bottom: 30, left: 50 }
        const width = container.width - margin.left - margin.right
        const height = container.height - margin.top - margin.bottom

        return {
            width,
            height,
            margin,
        }
    }

    getScales(data) {
        const { width, height } = this.getBoundingBoxes()
        const x = d3.scaleTime()
            .range([0, width])
            .domain([d3.timeDay.offset(new Date(), -94), new Date()])
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain(d3.extent(
                data.reduce((a, c) => a.concat(c.data.map(d => d.weight)), [])
            ).map((d, i) => d * (1+(i*2-1)/100)))

        const z = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(user => user.id))

        return { x, y, z }
    }

    drawAxises(data, drawArea, { x, y }, isRender) {
        const { height } = this.getBoundingBoxes()
        const xAxis = d3.axisBottom()
            .scale(x)

        const yAxis = d3.axisLeft()
            .scale(y)

        if (isRender) {
            drawArea.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0, ' + height + ')')
                .call(xAxis)

            drawArea.append('g')
                .attr('class', 'axis axis--y')
                .call(yAxis)
        } else {
            drawArea.select('g.axis--x').transition()
                .duration(800)
                .call(xAxis)

            drawArea.select('g.axis--y').transition()
                .duration(800)
                .call(yAxis)
        }
    }

    renderd3(mode) {
        const faux = this.props.connectFauxDOM('div', 'chart')

        const { data } = this.props
        const { x, y, z } = this.getScales(data)

        const isRender = mode === 'render'

        const svg = this.getSvg(faux, isRender)
        const g = this.getDrawArea(svg, isRender)

        this.drawAxises(data, g, { x, y }, isRender)


        const lineZero = d3.line()
            .x(d => x(d.datetime))
            .y(d => y(0))

        const line = d3.line()
            .x(d => x(d.datetime))
            .y(d => y(d.weight))


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
              .style('stroke', d => z(d.id))
              .style('fill', 'none')
              .style('stroke-width', '2px')

        newUserGroups
            .selectAll('circle')
            .data(d => d.data)
            .enter().append('circle')
                .attr('clip-path', 'url(#clip)')
                .attr('fill', d => z(d.id))
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
                .attr('d', d=> line(d.data))

        this.props.animateFauxDOM(1000)
    }
}

LineChart.defaultProps = {
    chart: 'loading',
    width: 'auto',
    height: 300,
    updateInterval: null,
    windowSize: [0, 0],
}

export default withFauxDOM(LineChart)
