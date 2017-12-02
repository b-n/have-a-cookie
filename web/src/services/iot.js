const awsIot = require('aws-iot-device-sdk')

export default class Iot {
    constructor() {}

    connect() {
        return fetch('https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev/iot-auth', {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(res => res.json())
            .then(({payload}) => {
                console.warn(`Endpoint: ${payload.iotEndpoint}, 
                Region: ${payload.region}, 
                AccessKey: ${payload.accessKey}, 
                SecretKey: ${payload.secretKey}, 
                SessionToken: ${payload.sessionToken}`)

                const topic = '/serverless/pubsub'

                Iot.connectToDevice(topic,
                    payload.iotEndpoint,
                    payload.region,
                    payload.accessKey,
                    payload.secretKey,
                    payload.sessionToken)
            })
    }

    static connectToDevice(topic, iotEndpoint, region, accessKey, secretKey, sessionToken) {
        const client = awsIot.device({
            region: region,
            protocol: 'wss',
            accessKeyId: accessKey,
            secretKey: secretKey,
            sessionToken: sessionToken,
            port: 443,
            host: iotEndpoint,
        })

        client.on('connect', () => Iot.onConnect(client, topic))
        client.on('message', Iot.onMessage)
        client.on('close', Iot.onClose)
    }

    static onConnect(client, topic) {
        client.subscribe(topic)
        console.warn('Connected')
    }

    static onMessage(topic, message) {
        console.warn('Message received:', message)
    }

    static onClose() {
        console.warn('Connection failed')
    }
}
