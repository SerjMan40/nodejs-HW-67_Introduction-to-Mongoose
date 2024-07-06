import express from 'express'

import { getRegisterHandler, postRegisterHandler } from '../controllers/register.mjs'

const registerRouter = express.Router()

registerRouter.get('/', getRegisterHandler)
registerRouter.post('/', postRegisterHandler)

export default registerRouter
