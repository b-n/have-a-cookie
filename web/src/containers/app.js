import {Component} from 'preact'
import debounce from 'debounce'

import MediaCard from '../components/mediaCard'
import {Grid, Cell} from '../components/grid'
import Api from '../services/api'
import Iot from '../services/iot'

import '../style'

import Header from '../components/header'
import HistoryChart from '../components/historyChart'

export default class App extends Component {
    constructor() {
        super()
        this.setState({ users: [], windowSize: [0, 0] })
        this.setWindowDimensions = this.setWindowDimensions.bind(this)
        this.checkWindowDimensions = debounce(this.setWindowDimensions, 300)
        this.api = new Api
        this.iot = new Iot
    }

    componentDidMount() {
        this.api.getUsers()
            .then(userData => this.setState({ users: userData }))
            .then(this.iot.connect)
            .catch(e => console.error(e))
        window.addEventListener('resize', this.checkWindowDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkWindowDimensions)
    }

    setWindowDimensions(dimensions) {
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
                        <Cell key={user.id} cols="4">
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
