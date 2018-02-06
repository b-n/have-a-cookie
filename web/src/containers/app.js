import {Component} from 'preact'
import {utcParse} from 'd3-time-format'

import config from '../config'

import '../style'
import MediaCard from '../components/mediaCard'
import {Grid, Cell} from '../components/grid'

import Header from '../components/header'
import HistoryChart from '../components/historyChart'

export default class App extends Component {
    constructor() {
        super()
        this.setState({ users: [] })
    }

    componentDidMount() {
        const strictIsoParse = utcParse('%Y-%m-%dT%H:%M:%S.%LZ')

        fetch(config.server_url + '/users?includeHistory=true', { cors: true })
            .then(res => res.json())
            .then(res => {
                const userData = Object.values(res.payload).map(user => {
                    const { id, name, data } = user
                    const dataPoints = data.map(dp => {
                        const { weight, datetime, device } = dp
                        return {
                            id,
                            weight: parseFloat(weight),
                            datetime: strictIsoParse(datetime),
                            device,
                        }
                    })

                    dataPoints.sort((a, b) => a.datetime - b.datetime)
                    return {
                        id,
                        name,
                        data: dataPoints,
                    }
                })

                this.setState({ users: userData })
            })
    }

    render() {
        const { users } = this.state
        return (
            <div>
                <Header />
                <Grid>
                    <Cell cols="12">
                        <MediaCard title="Controls">
                            This is where the controls for the below cards will go
                        </MediaCard>
                    </Cell>
                    <Cell cols="12">
                        <MediaCard title="Everyone">
                            <HistoryChart data={users} />
                        </MediaCard>
                    </Cell>
                    {users.map(user => (
                        <Cell key={user.id} cols="4">
                            <MediaCard title={user.name}>
                                <HistoryChart data={[...user]} />
                            </MediaCard>
                        </Cell>
                    ))}
                </Grid>
            </div>
        )
    }
}
