import {utcParse} from 'd3-time-format'

export default class Api {
    constructor() {}

    getUsers() {
        const strictIsoParse = utcParse('%Y-%m-%dT%H:%M:%S.%LZ')
        return fetch('https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev/users?includeHistory=true', {
                cors: true
            })
            .then(res => res.json())
            .then(res => {
                return Object.values(res.payload).map(user => {
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
            })
    }

}