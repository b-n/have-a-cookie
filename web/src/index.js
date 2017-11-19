import {Component} from 'preact'
import App from './containers/app'
import 'preact-material-components/style.css'

class Index extends Component {
    render() {
        return (
            <div id="app">
                <App />
            </div>
        )
    }
}

export default Index
