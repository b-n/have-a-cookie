import { Component } from 'preact'
import LineChart from './charts/LineChart'

class HistoryChart extends Component {
    constructor() {
        super()
    }

    render() {
        const { data, windowSize } = this.props
        return (
            <div>
                <LineChart data={data} width="auto" height="300" windowSize={windowSize} />
            </div>
        )
    }
}

HistoryChart.defaultProps = {
    windowSize: [0, 0],
}

export default HistoryChart
