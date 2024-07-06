const logoutHandler = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).send('Server Error')
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err)
        return res.status(500).send('Server Error')
      }
      res.clearCookie('connect.sid')
      res.redirect('/')
    })
  })
}

export default logoutHandler
