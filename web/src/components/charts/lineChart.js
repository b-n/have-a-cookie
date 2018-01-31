import {Component} from 'preact'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'
import deepEqual from 'deep-equal'

class LineChart extends Component {
    constructor() {
        super()
        this.setState({
            secondsElapsed: 0,
        })
        this.tick = this.tick.bind(this)
    }

    tick() {
        this.setState({ secondsElapsed: this.state.secondsElapsed + 1 })
    }

    componentDidMount() {
        if (this.props.updateInterval) {
            this.interval = setInterval(this.tick, 10000)
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

    renderd3(mode) {
        const faux = this.props.connectFauxDOM('div', 'chart')

        const container = {
            width: this.chartDiv.offsetWidth,
            height: this.chartDiv.offsetHeight,
        }
        const margin = { top: 20, right: 20, bottom: 30, left: 50 }
        const width = container.width - margin.left - margin.right
        const height = container.height - margin.top - margin.bottom

        const { data } = this.props

        const isRender = mode === 'render'

        const svg = isRender
            ? d3.select(faux).append('svg')
            : d3.select(faux).select('svg')

        svg.attr('width', container.width)
            .attr('height', container.height)

        const g = isRender
            ? svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
            : svg.select('g')

        const x = d3.scaleTime().range([0, width]).domain([d3.timeDay.offset(new Date(), -56), new Date()])
        const y = d3.scaleLinear().range([height, 0])
        const minMax = d3.extent(data.reduce((accumulator, currentValue) => {
            return accumulator.concat(d3.extent(currentValue.data, d => parseFloat(d.weight)))
        }, []))

        const adjustedMinMax = [minMax[0] * 0.99, minMax[1] * 1.01]
        y.domain(adjustedMinMax)

        const z = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(data.map(user => user.id))

        const xAxis = d3.axisBottom()
            .scale(x)

        const yAxis = d3.axisLeft()
            .scale(y)

        if (isRender) {
            g.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0, ' + height + ')')
                .call(xAxis)

            g.append('g')
                .attr('class', 'axis axis--y')
                .call(yAxis)

            g.append('clipPath')
                .attr('id', 'clip')
                .append('rect')
                    .attr('width', width)
                    .attr('height', height)
        } else {
            g.select('#clip').select('rect')
                .attr('width', width)
                .attr('height', height)

            g.select('g.axis--x').transition()
                .duration(800)
                .call(xAxis)

            g.select('g.axis--y').transition()
                .duration(800)
                .call(yAxis)
        }

        const line = d3.line()
            .x(d => x(d.datetime))
            .y(d => y(d.weight))


        const users = g.selectAll('.person')
            .data(data, d => d.id)
            .enter().append('g')
                .attr('class', 'person')

        users
            .append('path')
              .attr('class', 'line')
              .attr('clip-path', 'url(#clip)')
              .attr('d', d => line(d.data))
              .style('stroke', d => z(d.id))
              .style('fill', 'none')
              .style('stroke-width', '2px')

        users.selectAll('circle')
            .data(d => d.data)
            .enter().append('circle')
                .attr('clip-path', 'url(#clip)')
                .attr('fill', d => z(d.id))
                .attr('r', 0)
                .attr('cx', d => x(d.datetime))
                .attr('cy', d => y(d.weight))

        g.selectAll('.person')
            .selectAll('circle')
                .transition()
                .duration(800)
                .attr('r', 3)
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
