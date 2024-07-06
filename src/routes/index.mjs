import express from 'express'
import rootRouter from './root.mjs'
import usersRouter from './users.mjs'
import articlesRouter from './articles.mjs'

import errorHandler from '../middlewares/errorHandler.mjs'

import registerRouter from './register.mjs'
import loginRouter from './login.mjs'
import logoutRouter from './logout.mjs'

const router = express.Router()

router.use('/users', usersRouter)
router.use('/articles', articlesRouter)
router.use('/register', registerRouter)
router.use('/login', loginRouter)
router.use('/', rootRouter)

router.post('/set-theme', (req, res) => {
  const { theme } = req.body
  res.cookie('theme', theme, { maxAge: 900000, httpOnly: true })
  res.send({ message: 'Theme set successfully' })
})

router.use(errorHandler)
router.use('/logout', logoutRouter)

export default router
