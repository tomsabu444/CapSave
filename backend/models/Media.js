const mongoose = require('mongoose');
const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    albumId: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    mediaType: {
      type: String,
      enum: ['photo', 'video'],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,            // adds createdAt & updatedAt
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

mediaSchema.virtual('mediaId').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Media', mediaSchema);
