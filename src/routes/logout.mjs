import express from 'express'
import logoutHandler from '../controllers/logout.mjs'

const logoutRouter = express.Router()

logoutRouter.post('/', logoutHandler)

export default logoutRouter
