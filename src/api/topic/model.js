import mongoose, { Schema } from 'mongoose'

const topicSchema = new Schema({
  title: {
    type: String
  }
}, {
  timestamps: true
})

topicSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

module.exports = mongoose.model('Topic', topicSchema)
export default module.exports
