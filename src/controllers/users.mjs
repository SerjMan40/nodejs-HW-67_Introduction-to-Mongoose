import bcrypt from 'bcrypt'
import {
  addUserToDB,
  findUserByName,
  findUserByEmail,
  readUsersFromDB,
  findUserById,
  updateUserInDB,
  deleteUserFromDB
} from '../data/usersData.mjs'

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
    const newUser = { userId, userName, userEmail, password: hashedPassword }
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

export const getUsersHandler = async (req, res) => {
  try {
    const users = await readUsersFromDB()
    res.render('users/users.pug', { users })
  } catch (err) {
    console.error('Error fetching users:', err.message)
    res.status(500).send('Server Error')
  }
}

export const getUserOnIdHandler = async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await findUserById(userId)
    if (user) {
      res.render('users/userDetail.pug', { user })
    } else {
      res.status(404).send(`User with ID ${userId} not found`)
    }
  } catch (err) {
    console.error('Error fetching user:', err.message)
    res.status(500).send('Server Error')
  }
}

export const putUserOnIdHandler = async (req, res) => {
  const userId = req.params.userId
  const { userName, userEmail, password } = req.body
  const updatedUser = { userName, userEmail, password }

  try {
    const isUpdated = await updateUserInDB(userId, updatedUser)
    if (isUpdated) {
      res.send(`User with ID: ${userId} was updated successfully!`)
    } else {
      res.status(404).send(`User with ID ${userId} not found`)
    }
  } catch (err) {
    console.error('Error updating user:', err.message)
    res.status(500).send('Server Error')
  }
}

export const deleteUserOnIdHandler = async (req, res) => {
  const userId = req.params.userId

  try {
    const deletedUser = await deleteUserFromDB(userId)
    if (deletedUser) {
      res.send(`User with ID: ${userId} was deleted!`)
    } else {
      res.status(404).send(`User with ID ${userId} not found`)
    }
  } catch (err) {
    console.error('Error deleting user:', err.message)
    res.status(500).send('Server Error')
  }
}
