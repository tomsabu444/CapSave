const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    userId: {
      type: String,     // Firebase UID
      required: true,
      index: true,
    },
    albumName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // enable both createdAt and updatedAt
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// expose albumId as a virtual field mapped to _id
albumSchema.virtual('albumId').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Album', albumSchema);
