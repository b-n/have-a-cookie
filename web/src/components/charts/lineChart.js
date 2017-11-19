import {Component} from 'preact'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'

class LineChart extends Component {
  componentDidMount() {
    const faux = this.props.connectFauxDOM('div', 'chart')

    d3.select(faux)
      .append('div')
      .style('background-color', 'purple')
      .html('Hello World!')
      .transition().duration(3000)
        .style('background-color', 'red')

    this.props.animateFauxDOM(3000)
  }

  render() {
    return (
      <div>
          {this.props.chart}
      </div>
    )
  }
}

LineChart.defaultProps = {
  chart: 'loading',
}

export default withFauxDOM(LineChart)
