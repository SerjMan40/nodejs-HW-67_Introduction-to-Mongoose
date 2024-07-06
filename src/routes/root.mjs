import express from 'express'
import getRootHandler from '../controllers/root.mjs'

const rootRouter = express.Router()

rootRouter.get('/', getRootHandler)

export default rootRouter
