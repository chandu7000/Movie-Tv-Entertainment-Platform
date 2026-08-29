const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  kind: { type: String, enum: ['watchlist', 'favorite'], required: true, index: true },
  tmdbId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String, required: true, trim: true, maxlength: 240 },
  posterPath: { type: String, default: '' },
  backdropPath: { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  genreIds: [{ type: Number }],
}, { timestamps: true });

libraryItemSchema.index({ user: 1, kind: 1, mediaType: 1, tmdbId: 1 }, { unique: true });
libraryItemSchema.index({ user: 1, kind: 1, createdAt: -1 });
module.exports = mongoose.model('LibraryItem', libraryItemSchema);
