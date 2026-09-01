require('dotenv').config();
const connectDatabase = require('../config/db');
const StreamSource = require('../models/StreamSource');
const { validateEnvironment } = require('../config/env');

const run = async () => {
  validateEnvironment();
  await connectDatabase();

  const clientOrigin = String(process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim();

  await StreamSource.deleteMany({ isDemo: true });
  await StreamSource.insertMany([
    {
      mediaType: 'demo',
      tmdbId: 0,
      season: 0,
      episode: 0,
      title: 'Big Buck Bunny — CineVerse Player Demo',
      sourceType: 'mp4',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      quality: '1080p',
      language: 'original',
      subtitles: [{
        label: 'English demo captions',
        language: 'en',
        url: `${clientOrigin}/demo-subtitles.vtt`,
        default: false,
      }],
      isActive: true,
      isDemo: true,
      licenseNote: 'Demo playback uses Big Buck Bunny, an openly licensed Blender Foundation film. Add only content you own or are authorized to distribute.',
    },
    {
      mediaType: 'demo',
      tmdbId: 0,
      season: 0,
      episode: 0,
      title: 'Big Buck Bunny — CineVerse Player Demo',
      sourceType: 'hls',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      quality: 'Auto HLS',
      language: 'original',
      subtitles: [{
        label: 'English demo captions',
        language: 'en',
        url: `${clientOrigin}/demo-subtitles.vtt`,
        default: false,
      }],
      isActive: true,
      isDemo: true,
      licenseNote: 'Demo playback uses a public HLS test stream. Add only content you own or are authorized to distribute.',
    },
  ]);

  console.log('CineVerse MP4 + HLS legal demo streams seeded.');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
