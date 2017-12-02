import AWS from 'aws-sdk'
import { v4 } from 'uuid'

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const tableParams = {
    TableName: process.env.DYNAMODB_TABLE,
}

export const getUsers = () => dynamoDb.scan(tableParams).promise().then(res => res.Items)

export const getUserSummaries = async () => {
    const users = await getUsers()

    return users.map(getUserWithoutData)
}

export const getUser = userId => dynamoDb.get({
    ...tableParams,
    Key: {
        id: userId,
    },
}).promise()

export const setUser = record => dynamoDb.put({ ...tableParams, Item: record }).promise()

export const newUser = () => {
    const id = v4()
    return {
        id,
        name: id,
        data: [],
    }
}

export const addEntryToUser = (user, data) => {
    const { weight } = data
    return {
        ...user,
        weightedAverage: weight,
        weightedSd: 0.01,
        data: [
            ...user.data,
            data,
        ],
    }
}

export const getUserWithoutData = user => {
    const { id, name, weightedAverage, weightedSd } = user
    return {
        id,
        name,
        weightedAverage,
        weightedSd,
    }
}
