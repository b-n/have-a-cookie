import LambdaRouter from 'serverless-lambda-router'
import Weight from '../controllers/weight'

const controller = new Weight()

const router = new LambdaRouter()

router.get('/weights', controller.addWeight)

export const handler = router.handler()
