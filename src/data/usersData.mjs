import User from '../models/User.mjs'

export const readUsersFromDB = async () => {
  try {
    const users = await User.find()
    return users
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}

export const addUserToDB = async (user) => {
  try {
    const newUser = new User(user)
    const result = await newUser.save()
    return result
  } catch (error) {
    console.error('Error adding user:', error)
    return null
  }
}

export const findUserById = async (id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch (error) {
    console.error('Error finding user by ID:', error)
    return null
  }
}

export const findUserByName = async (userName) => {
  try {
    const user = await User.findOne({ name: userName })
    return user
  } catch (error) {
    console.error('Error finding user by name:', error)
    return null
  }
}

export const findUserByEmail = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail })
    return user
  } catch (error) {
    console.error('Error finding user by email:', error)
    return null
  }
}

export const updateUserInDB = async (id, updatedUser) => {
  try {
    const result = await User.findByIdAndUpdate(id, updatedUser, { new: true })
    return result !== null
  } catch (error) {
    console.error('Error updating user:', error)
    return false
  }
}

export const deleteUserFromDB = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId)
    return result !== null
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}
