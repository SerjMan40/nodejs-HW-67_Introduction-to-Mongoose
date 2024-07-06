import Article from '../models/Article.mjs'

export const readArticlesFromDB = async (page = 1, pageSize = 10) => {
  try {
    const skip = (page - 1) * pageSize
    const articles = await Article.find().skip(skip).limit(pageSize)
    return articles
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}

export const addArticleToDB = async (article) => {
  try {
    if (Array.isArray(article)) {
      const result = await Article.insertMany(article)
      return result
    } else {
      const newArticle = new Article(article)
      const result = await newArticle.save()
      return result
    }
  } catch (error) {
    console.error('Error adding article:', error)
    return null
  }
}

export const updateArticleInDB = async (articles) => {
  try {
    if (Array.isArray(articles)) {
      const operations = articles.map((article) => ({
        updateOne: {
          filter: { _id: article.articleId },
          update: { title: article.title, framework: article.framework, year: article.year }
        }
      }))
      const result = await Article.bulkWrite(operations)
      return result.modifiedCount === articles.length
    } else {
      const { articleId, title, framework, year } = articles
      const result = await Article.updateOne({ _id: articleId }, { title, framework, year })
      return result.modifiedCount > 0
    }
  } catch (error) {
    console.error('Error updating articles:', error.message)
    return false
  }
}

export const replaceArticleInDB = async (articleId, newArticle) => {
  try {
    const result = await Article.replaceOne({ _id: articleId }, newArticle)
    return result.matchedCount > 0
  } catch (error) {
    console.error('Error replacing article:', error)
    return false
  }
}

export const findArticleById = async (id) => {
  try {
    const article = await Article.findById(id)
    return article
  } catch (error) {
    console.error('Error finding article by ID:', error)
    return null
  }
}

export const deleteArticleFromDB = async (articleIds) => {
  try {
    if (Array.isArray(articleIds)) {
      const result = await Article.deleteMany({ _id: { $in: articleIds } })
      return result.deletedCount > 0
    } else {
      const result = await Article.deleteOne({ _id: articleIds })
      return result.deletedCount > 0
    }
  } catch (error) {
    console.error('Error deleting article:', error)
    return false
  }
}

export const getArticleStatistics = async () => {
  try {
    const stats = await Article.aggregate([
      {
        $group: {
          _id: '$framework',
          totalArticles: { $sum: 1 },
          titlesWithYears: { $push: { title: '$title', year: '$year' } },
          minYear: { $min: '$year' },
          maxYear: { $max: '$year' }
        }
      }
    ])
    return stats
  } catch (error) {
    console.error('Error performing aggregation:', error)
    return []
  }
}
