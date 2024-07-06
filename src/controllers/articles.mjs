import {
  readArticlesFromDB,
  addArticleToDB,
  updateArticleInDB,
  deleteArticleFromDB,
  findArticleById,
  replaceArticleInDB,
  getArticleStatistics
} from '../data/articlesData.mjs'

export const getAllArticlesHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 0
    const articles = await readArticlesFromDB(page, pageSize)
    res.render('articles/articles.ejs', { articles })
  } catch (err) {
    console.error('Error fetching articles:', err.message)
    res.status(500).send('Server Error')
  }
}

export const getArticleDetailHandler = async (req, res) => {
  try {
    const articleId = req.params.articleId
    const article = await findArticleById(articleId)
    if (article) {
      res.render('articles/articleDetail.ejs', { article })
    } else {
      res.status(404).send('Article not found')
    }
  } catch (err) {
    console.error('Error fetching article:', err.message)
    res.status(500).send('Server Error')
  }
}

export const getArticleStatisticsHandler = async (req, res) => {
  try {
    const statistics = await getArticleStatistics()
    res.render('articles/statistics.ejs', { statistics })
  } catch (err) {
    console.error('Error fetching article statistics:', err.message)
    res.status(500).send('Server Error')
  }
}

export const postArticleHandler = async (req, res) => {
  const { title, framework, year } = req.body
  try {
    const newArticle = { title, framework, year }
    const addedArticle = await addArticleToDB(newArticle)
    if (!addedArticle) {
      throw new Error('Failed to add article to the database.')
    }
    res.status(201).send('Article created successfully')
  } catch (err) {
    console.error('Error creating article:', err.message)
    res.status(500).send('Server Error')
  }
}

export const putArticleHandler = async (req, res) => {
  let articles = req.body
  if (!Array.isArray(articles)) {
    articles = [{ articleId: req.params.articleId, ...req.body }]
  }
  try {
    const isUpdated = await updateArticleInDB(articles)
    if (isUpdated) {
      res.send('All articles were updated successfully!')
    } else {
      res.status(404).send('Some or all articles were not found')
    }
  } catch (err) {
    console.error('Error updating articles:', err.message)
    res.status(500).send('Server Error')
  }
}

export const replaceArticleHandler = async (req, res) => {
  const articleId = req.params.articleId
  const { title, framework, year } = req.body
  try {
    const newArticle = { title, framework, year }
    const isReplaced = await replaceArticleInDB(articleId, newArticle)
    if (isReplaced) {
      res.send(`Article with ID: ${articleId} is replaced!`)
    } else {
      res.status(404).send(`Article with ID ${articleId} not found`)
    }
  } catch (err) {
    console.error('Error replacing article:', err.message)
    res.status(500).send('Server Error')
  }
}

export const deleteArticleHandler = async (req, res) => {
  const articleIds = req.body.articleId
  if (!Array.isArray(articleIds) && typeof articleIds !== 'string') {
    return res.status(400).send('Invalid input: articleId should be a string or an array of strings')
  }
  try {
    const deletedArticle = await deleteArticleFromDB(articleIds)
    if (deletedArticle) {
      if (Array.isArray(articleIds)) {
        res.send(`Article(s) with ID(s): ${articleIds.join(', ')} was/were deleted!`)
      } else {
        res.send(`Article with ID: ${articleIds} was deleted!`)
      }
    } else {
      if (Array.isArray(articleIds)) {
        res.status(404).send(`Article(s) with ID(s) ${articleIds.join(', ')} not found`)
      } else {
        res.status(404).send(`Article with ID ${articleIds} not found`)
      }
    }
  } catch (err) {
    console.error('Error deleting article:', err.message)
    res.status(500).send('Server Error')
  }
}
