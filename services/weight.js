import { Executable, Response } from '../lib/sls-sugar'

class Weight extends Executable {
    constructor() {
        super()
    }

    handle(props) {
        const { event } = props
        return new Response({ message: event.body })
    }
}

export const handle = (event, context, callback) => new Weight().run({ event, context, callback })
