const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tmdbId: { type: Number, required: true, index: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 240 },
  content: { type: String, required: true, trim: true, minlength: 3, maxlength: 2000 },
}, { timestamps: true });
reviewSchema.index({ user: 1, mediaType: 1, tmdbId: 1 }, { unique: true });
reviewSchema.index({ mediaType: 1, tmdbId: 1, createdAt: -1 });
module.exports = mongoose.model('Review', reviewSchema);
