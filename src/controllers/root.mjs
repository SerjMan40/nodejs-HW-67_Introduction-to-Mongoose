const getRootHendler = (req, res) => {
  res.render('root.ejs', { user: req.user })
}

export default getRootHendler
