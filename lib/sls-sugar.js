class Executable {
    constructor() {
        this.handle = this.handle.bind(this)
    }

    handle() {
        return Promise.reject('No handler specified')
    }

    run({ event, context, callback }) {
        event.body = JSON.parse(event.body)


        Promise.resolve(this.handle({ event, context }))
            .then(value => {
                const res = value instanceof Response ? value : new Response(value)

                callback(null, res.getResponse())
            })
            .catch(error => {
                console.error(error)
                callback(error)
            })
    }
}

class Response {
    constructor(returnVal, statusCode = 200) {
        this.value = returnVal
        this.statusCode = statusCode
    }

    getResponse() {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify(this.value),
        }
    }
}

export {
    Executable,
    Response,
}
