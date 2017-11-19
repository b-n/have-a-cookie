import {Component} from 'preact'

import MediaCard from '../components/mediaCard'
import {Grid, Cell} from '../components/grid'

import '../style'

import Header from '../components/header'
import HistoryChart from '../components/historyChart'

export default class App extends Component {
    render() {
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
                            <HistoryChart />
                        </MediaCard>
                    </Cell>
                </Grid>
            </div>
        )
    }
}
