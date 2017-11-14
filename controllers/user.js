import { getUser, getUsersWithoutData } from '../models/user'

class User {
    constructor() { }

    async getUsers() {
        return getUsersWithoutData()
    }

    async getUser({ event }) {
        const { id } = event.pathParameters

        const user = await getUser(id)

        return user.Item
    }
}

export default User
