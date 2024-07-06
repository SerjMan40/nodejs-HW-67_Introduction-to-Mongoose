import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUserByEmail, findUserById } from '../data/usersData.mjs'
import bcrypt from 'bcrypt'

passport.use(
  new LocalStrategy({ usernameField: 'userEmail' }, async (userEmail, password, done) => {
    console.log('Local strategy called with email:', userEmail)
    try {
      const user = await findUserByEmail(userEmail)
      if (!user) {
        console.log('Authentication failed: Incorrect email')
        return done(null, false, { message: 'Incorrect email.' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        console.log('Authentication failed: Incorrect password')
        return done(null, false, { message: 'Incorrect password.' })
      }
      console.log('Local strategy authentication successful, user:', user)
      return done(null, user)
    } catch (err) {
      console.error('Error in local strategy:', err)
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user)
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  console.log('DeserializeUser called with id:', id)
  try {
    const user = await findUserById(id)
    console.log('Deserializing user:', user)
    done(null, user)
  } catch (err) {
    console.error('Error in deserializeUser:', err)
    done(err)
  }
})

export default passport
