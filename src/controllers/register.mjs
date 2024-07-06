import bcrypt from 'bcrypt'
import { addUserToDB, findUserByName, findUserByEmail, readUsersFromDB } from '../data/usersData.mjs'

const users = await readUsersFromDB()

export const getRegisterHandler = (req, res) => {
  res.render('register.ejs')
}

export const postRegisterHandler = async (req, res) => {
  const { userName, userEmail, password } = req.body

  try {
    const existingUserByName = await findUserByName(userName)
    if (existingUserByName) {
      return res.status(400).render('isRegister.ejs', { message: 'Username already exists' })
    }

    const existingUserByEmail = await findUserByEmail(userEmail)
    if (existingUserByEmail) {
      return res.status(400).render('isRegister.ejs', { message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      userId: (users.length += 1),
      userName,
      userEmail,
      password: hashedPassword
    }

    const addedUser = await addUserToDB(newUser)

    if (!addedUser) {
      throw new Error('Failed to add user to the database.')
    }

    req.login(addedUser, (err) => {
      if (err) {
        console.error('Login error:', err)
        return res.status(500).send('Server Error')
      }
      console.log(`User registered and logged in successfully: ${req.user}`)
      res.status(201).render('isRegister.ejs', { message: 'User registered successfully' })
    })
  } catch (err) {
    console.error('Registration error:', err.message)
    res.status(500).send('Server Error')
  }
}
