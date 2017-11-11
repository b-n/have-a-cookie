class Executable {
    constructor() {
        this.handle = this.handle.bind(this)
    }

    handle() {
        return Promise.reject('No handler specified')
    }

    run({ event, context, callback }) {
        Promise.resolve(this.handle({ event, context }))
            .then(value => {
                if (value instanceof Response) {
                    callback(null, value.getResponse())
                    return
                }
                callback(null, new Response(value))
            })
            .catch(error => {
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
            body: this.value,
        }
    }
}

export {
    Executable,
    Response,
}
