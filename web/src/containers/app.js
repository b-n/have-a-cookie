import {Component} from 'preact'

import MediaCard from '../components/mediaCard'
import {Grid, Cell} from '../components/grid'

import '../style'

import Header from '../components/header'
import HistoryChart from '../components/historyChart'

export default class App extends Component {
    constructor() {
        super()
        this.setState({ users: [], windowSize: [0, 0] })
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }

    componentDidMount() {
        fetch('https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev/users?includeHistory=true', { cors: true })
        .then(res => res.json())
            .then(res => {
                const data = Object.values(res.payload)

                this.setState({ users: data })
            })
        window.addEventListener('resize', this.updateWindowDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions)
    }

    updateWindowDimensions() {
        const w = window
        const d = document
        const documentElement = d.documentElement
        const body = d.getElementsByTagName('body')[0]
        const width = w.innerWidth || documentElement.clientWidth || body.clientWidth
        const height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight
        this.setState({ windowSize: [width, height]})
    }

    render() {
        const { users, windowSize } = this.state
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
                            <HistoryChart data={users} windowSize={windowSize} />
                        </MediaCard>
                    </Cell>
                    {users.map(user => (
                        <Cell key={user.id} cols="6">
                            <MediaCard title={user.name}>
                                <HistoryChart data={[...user]} windowSize={windowSize} />
                            </MediaCard>
                        </Cell>
                    ))}
                </Grid>
            </div>
        )
    }
}
