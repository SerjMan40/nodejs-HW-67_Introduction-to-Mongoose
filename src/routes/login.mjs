import express from 'express'
import { getLoginHendler, postLoginHandler } from '../controllers/login.mjs'

const loginRouter = express.Router()

loginRouter.get('/', getLoginHendler)
loginRouter.post('/', postLoginHandler)

export default loginRouter
