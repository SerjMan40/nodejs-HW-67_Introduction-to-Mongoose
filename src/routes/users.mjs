import express from 'express'
import {
  deleteUserOnIdHandler,
  getUserOnIdHandler,
  getUsersHandler,
  putUserOnIdHandler
} from '../controllers/users.mjs'
import authMiddleware from '../middlewares/authenticate.mjs'

const usersRouter = express.Router()

usersRouter.get('/', authMiddleware, getUsersHandler)

usersRouter.get('/:userId', authMiddleware, getUserOnIdHandler)
usersRouter.put('/:userId', authMiddleware, putUserOnIdHandler)
usersRouter.delete('/:userId', authMiddleware, deleteUserOnIdHandler)

export default usersRouter
