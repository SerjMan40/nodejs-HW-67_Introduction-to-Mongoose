import bcrypt from 'bcrypt'
import { readUsersFromDB } from '../data/usersData.mjs'

export const getLoginHendler = (req, res) => {
  res.render('login.ejs')
}

export const postLoginHandler = async (req, res, next) => {
  const { userEmail, password } = req.body

  try {
    const users = await readUsersFromDB()
    const user = users.find((u) => u.userEmail === userEmail)

    if (user && (await bcrypt.compare(password, user.password))) {
      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err)
          return res.status(500).send('Server Error')
        }
        console.log(`User logged in successfully: ${req.user}`)
        res.render('isLogin.ejs', { login: true })
      })
    } else {
      res.status(401).render('isLogin.ejs', { login: false })
    }
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).send('Server Error')
  }
}
