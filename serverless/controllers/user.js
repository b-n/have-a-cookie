import { getUser, getUsers, getUserSummaries } from '../models/user'

class User {
    constructor() { }

    async getUsers({ event }) {
        const includeHistory = event.queryStringParameters && event.queryStringParameters.includeHistory

        return includeHistory
            ? getUsers()
            : getUserSummaries()
    }

    async getUser({ event }) {
        const { id } = event.pathParameters

        const user = await getUser(id)

        return user.Item
    }
}

export default User
