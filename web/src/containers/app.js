import {Component} from 'preact'

import MediaCard from '../components/mediaCard'
import {Grid, Cell} from '../components/grid'

import '../style'

import Header from '../components/header'
import HistoryChart from '../components/historyChart'

export default class App extends Component {
    constructor() {
        super()
        this.setState({ data: [] })
    }

    componentDidMount() {
        fetch('https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev/users/cd9ac53f-ceab-47b5-ac0d-7fa39ebe71c5', {
            cors: true,
        })
            .then(res => res.json())
            .then(res => {
                const data = []
                data.push(res.payload)

                this.setState({ data })
            })
    }

    render() {
        const { data } = this.state
        return (
            <div>
                <Header />
                <Grid>
                    <Cell cols="12">
                        <MediaCard title="Controls">
                            This is where the controls for the below cards will go
                        </MediaCard>
                    </Cell>
                    <Cell cols="6">
                        <MediaCard title="testing">
                            <HistoryChart data={data} />
                        </MediaCard>
                    </Cell>
                </Grid>
            </div>
        )
    }
}
