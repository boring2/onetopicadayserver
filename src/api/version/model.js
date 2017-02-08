import mongoose, { Schema } from 'mongoose'

const versionSchema = new Schema({
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
  name: {
    type: String,
    required: true
  },
  contents: [{type: Schema.ObjectId, required: true, ref: 'Content'}]
}, {
  timestamps: true
})

versionSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      topic: this.topic.view(full),
      contents: this.contents.map((content)=>content.view(full)),
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

module.exports = mongoose.model('Version', versionSchema)
export default module.exports
