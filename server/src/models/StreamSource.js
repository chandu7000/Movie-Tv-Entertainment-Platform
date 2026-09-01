const mongoose = require('mongoose');

const subtitleSchema = new mongoose.Schema({
  label: { type: String, trim: true, maxlength: 80 },
  language: { type: String, trim: true, maxlength: 16 },
  url: { type: String, trim: true, maxlength: 2048 },
  default: { type: Boolean, default: false },
}, { _id: false });

const streamSourceSchema = new mongoose.Schema({
  mediaType: { type: String, enum: ['movie', 'tv', 'demo'], required: true, index: true },
  tmdbId: { type: Number, min: 0, required: true, index: true },
  season: { type: Number, min: 0, default: 0 },
  episode: { type: Number, min: 0, default: 0 },
  title: { type: String, trim: true, maxlength: 200 },
  sourceType: { type: String, enum: ['mp4', 'hls'], required: true },
  url: { type: String, required: true, trim: true, maxlength: 2048 },
  quality: { type: String, trim: true, maxlength: 24, default: 'Auto' },
  language: { type: String, trim: true, maxlength: 24, default: 'original' },
  subtitles: { type: [subtitleSchema], default: [] },
  isActive: { type: Boolean, default: true, index: true },
  isDemo: { type: Boolean, default: false, index: true },
  licenseNote: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

streamSourceSchema.index({ mediaType: 1, tmdbId: 1, season: 1, episode: 1, quality: 1, language: 1 });

module.exports = mongoose.model('StreamSource', streamSourceSchema);
