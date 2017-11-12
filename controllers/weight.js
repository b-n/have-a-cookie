import { getAllUsers, getNewUser, addEntryToUser, setUser, getUserWithoutData } from '../models/weight'

class Weight {
    constructor() { }

    async addWeight({ event, response }) {
        const body = JSON.parse(event.body)
        const { weight } = body

        const existingData = await getAllUsers()
        const closestUser = existingData.Count ? Weight.getUserClosestToWeight(existingData.Items, weight) : null

        const userToAddWeightTo = closestUser ? closestUser : getNewUser()
        const updatedRecord = addEntryToUser(userToAddWeightTo, body)

        await setUser(updatedRecord)

        return getUserWithoutData(updatedRecord)
    }

    static getUserClosestToWeight(users, weight) {
        const sortedUsersByRelevance = users.sort((a, b) => Weight.getRelevanceScore(a, weight) - Weight.getRelevanceScore(b, weight))

        const closestUser = sortedUsersByRelevance[0]
        return Math.abs(closestUser.weightedAverage - weight) < 5 ? closestUser : null
    }

    static getRelevanceScore(user, targetWeight) {
        const { weightedAverage, weightedSd } = user
        return Math.pow(Math.abs(weightedAverage - targetWeight), 2) / weightedSd
    }
}

export default Weight
