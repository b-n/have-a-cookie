import AWS from 'aws-sdk'
import { v4 } from 'uuid'

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const tableParams = {
    TableName: process.env.DYNAMODB_TABLE,
}

export const getAllUsers = () => dynamoDb.scan(tableParams).promise()

export const getNewUser = () => {
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

export const setUser = record => dynamoDb.put({ ...tableParams, Item: record }).promise()

export const getUserWithoutData = user => {
    const { id, name, weightedAverage, weightedSd } = user
    return {
        id,
        name,
        weightedAverage,
        weightedSd,
    }
}
