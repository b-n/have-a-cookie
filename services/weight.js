import LambdaRouter from 'serverless-lambda-router'
import Weight from '../controllers/weight'

const controller = new Weight()

const errorHandler = (response, err, event) => {
    console.error(err)
    return response
}

const router = new LambdaRouter({ onError: errorHandler })

router.post('/weights', controller.addWeight)

export const handle = router.handler()
