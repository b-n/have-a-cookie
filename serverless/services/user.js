import LambdaRouter from 'serverless-lambda-router'
import 'source-map-support/register'

import User from '../controllers/user'

const controller = new User()

const errorHandler = (response, err, event) => {
    console.error(err)
    return response
}

const invokeHandler = event => {
    console.warn(event)
}

const router = new LambdaRouter({ onError: errorHandler, onInvoke: invokeHandler, headers: { 'Access-Control-Allow-Origin': '*' } })

router.get('/users', controller.getUsers)
router.get('/users/{id}', controller.getUser)

export const handle = router.handler()
