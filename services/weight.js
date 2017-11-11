import AWS from 'aws-sdk'
import { v4 } from 'uuid'
import { Executable } from '../lib/sls-sugar'

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const tableParams = {
    TableName: process.env.DYNAMODB_TABLE,
}

class Weight extends Executable {
    constructor() {
        super()
    }

    async httpPost(data) {
        const existingData = await this.getAllData()

        const weight = data.weight

        const closestRecord = existingData.Count
            ? existingData.Items.sort((a, b) => this.getRelevanceScore(a, weight) - this.getRelevanceScore(b, weight))[0]
            : null

        const isUpdate = closestRecord && Math.abs(closestRecord.weightedAverage - weight) < 5

        const newRecord = this.addWeight(isUpdate ? closestRecord : this.getNewUser(), weight)

        const result = await dynamoDb.put({ ...tableParams, Item: newRecord }).promise()

        return result
    }

    addWeight(data, weight) {
        return {
            ...data,
            weightedAverage: weight,
            weightedSd: 0.01,
            data: [
                ...data.data,
                {
                    datetime: new Date(),
                    weight,
                },
            ],
        }
    }

    getNewUser() {
        const id = v4()
        return {
            id,
            name: id,
            data: [],
        }
    }

    getRelevanceScore(user, targetWeight) {
        const { weightedAverage, weightedSd } = user
        return Math.pow(Math.abs(weightedAverage - targetWeight), 2) / weightedSd
    }

    getAllData() {
        return dynamoDb.scan(tableParams).promise()
    }

    handle(props) {
        const { method, body } = props.event

        switch (method) {
            case 'POST':
                return this.httpPost(body)
            default:
                throw new Error('Method ' + method + ' does not exist.')
        }
    }
}

export const handle = (event, context, callback) => new Weight().run({ event, context, callback })
