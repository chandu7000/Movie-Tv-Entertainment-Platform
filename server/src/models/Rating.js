const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  value: { type: Number, required: true, min: 1, max: 10 },
  title: { type: String, required: true, trim: true, maxlength: 240 },
  posterPath: { type: String, default: '' },
  genreIds: [{ type: Number }],
}, { timestamps: true });
ratingSchema.index({ user: 1, mediaType: 1, tmdbId: 1 }, { unique: true });
ratingSchema.index({ user: 1, updatedAt: -1 });
module.exports = mongoose.model('Rating', ratingSchema);
