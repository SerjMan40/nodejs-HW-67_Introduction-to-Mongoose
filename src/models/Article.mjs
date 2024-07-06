import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    framework: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: 'articles' }
)

const Article = mongoose.model('Article', articleSchema)

export default Article
