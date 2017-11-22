import { Component } from 'preact'
import LineChart from './charts/LineChart'

class HistoryChart extends Component {
    constructor() {
        super()
        this.state = { chartText: 'Hello World' }
        this.changeText = this.changeText.bind(this)
    }

    changeText() {
        this.setState({ chartText: this.state.chartText == 'red' ? 'purple' : 'red' })
    }

    render() {
        const { chartText } = this.state
        return (
            <div>
                <button onClick={() => this.changeText()}>Toggle</button>
                <LineChart text={chartText} />
            </div>
        )
    }
}

export default HistoryChart
