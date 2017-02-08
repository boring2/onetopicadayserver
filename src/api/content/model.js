import mongoose, { Schema } from 'mongoose'

const contentSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: Schema.ObjectId,
    ref: 'Topic',
    required: true
  },
  text: {
    type: String
  }
}, {
  timestamps: true
})

contentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      topic: this.topic.view(full),
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

module.exports = mongoose.model('Content', contentSchema)
export default module.exports
