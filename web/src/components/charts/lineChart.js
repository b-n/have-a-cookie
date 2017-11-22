import {Component} from 'preact'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'

class LineChart extends Component {
    constructor() {
        super()
        this.setState({
            secondsElapsed: 0,
            data: [
                {
                    values: [
                        { datetime: d3.timeSecond.offset(new Date(), -30), weight: 100 },
                        { datetime: d3.timeSecond.offset(new Date(), -20), weight: 110 },
                    ],
                },
            ],
        })
        this.tick = this.tick.bind(this)
    }

    tick() {
        this.setState({ secondsElapsed: this.state.secondsElapsed + 1 })
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000)
        this.renderd3('render')
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.secondsElapsed != prevState.secondsElapsed) {
            this.renderd3('update')
        }
    }

    render() {
        return (
            <div ref={div => {this.chartDiv = div}} style="height: 400px;">
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

        const { data } = this.state

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

        const x = d3.scaleTime().range([0, width]).domain([d3.timeMinute.offset(new Date(), -1), new Date()])
        const y = d3.scaleLinear().range([height, 0]).domain([40, 130])
        // const z = d3.scaleOrdinal(d3.schemeCategory10)

        const xAxis = d3.axisBottom()
            .scale(x)

        if (isRender) {
            g.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0, ' + height + ')')
                .call(xAxis)

            g.append('g')
                .attr('class', 'axis axix--y')
                .call(d3.axisLeft(y))

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
        }

        const line = d3.line()
            .x(d => x(d.datetime))
            .y(d => y(d.weight))


        g.selectAll('.person')
            .data(data)
            .enter().append('g')
                .attr('class', 'person')
                .append('path')
                    .attr('class', 'line')
                    .attr('clip-path', 'url(#clip)')
                    .attr('d', d => line(d.values))
                    .style('stroke', 'black')

        g.selectAll('.person')
            .select('path')
                .transition()
                .duration(800)
                .attr('d', d=> line(d.values))

        this.props.animateFauxDOM(1000)
    }
}

LineChart.defaultProps = {
    chart: 'loading',
}

export default withFauxDOM(LineChart)
