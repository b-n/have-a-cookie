import {Component} from 'preact'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'

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
        // this.interval = setInterval(this.tick, 10000)
        this.renderd3('render')
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data != prevProps.data) {
            this.renderd3('update')
        }
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

        const x = d3.scaleTime().range([0, width]).domain([d3.timeDay.offset(new Date(), -5), new Date()])
        const y = d3.scaleLinear().range([height, 0])
        const minMax = data[0] ? d3.extent(data[0].data, d => d.weight) : [0, 100]
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

        const strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ')

        const line = d3.line()
            .x(d => x(strictIsoParse(d.datetime)))
            .y(d => y(parseFloat(d.weight)))


        g.selectAll('.person')
            .data(data)
            .enter().append('g')
                .attr('class', 'person')
                .append('path')
                    .attr('class', 'line')
                    .attr('clip-path', 'url(#clip)')
                    .attr('d', d => line(d.data))
                    .style('stroke', d => z(d.id))
                    .style('fill', 'none')
                    .style('stroke-width', '2px')

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
}

export default withFauxDOM(LineChart)
