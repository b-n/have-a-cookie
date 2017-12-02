import { getUser, getUsers, getUsersWithoutData } from '../models/user'

class User {
    constructor() { }

    async getUsers({ event }) {
        const includeHistory = event.queryStringParameters && event.queryStringParameters.includeHistory

        return includeHistory
            ? getUsers()
            : getUsersWithoutData()
    }

    async getUser({ event }) {
        const { id } = event.pathParameters

        const user = await getUser(id)

        return user.Item
    }
}

export default User
