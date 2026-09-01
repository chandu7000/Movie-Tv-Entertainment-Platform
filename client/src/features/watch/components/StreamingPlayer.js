import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaCompress,
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeHigh,
  FaVolumeXmark,
} from 'react-icons/fa6';
import { savePlaybackProgress, getPlaybackProgress } from '../../history/playbackProgress';

const HLS_SCRIPT = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.10/dist/hls.min.js';
let hlsLoaderPromise;

const loadHlsLibrary = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('HLS is only available in the browser.'));
  if (window.Hls) return Promise.resolve(window.Hls);
  if (hlsLoaderPromise) return hlsLoaderPromise;

  hlsLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${HLS_SCRIPT}"]`);
    const finish = () => window.Hls ? resolve(window.Hls) : reject(new Error('HLS player failed to load.'));

    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener('error', () => reject(new Error('HLS player failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = HLS_SCRIPT;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = finish;
    script.onerror = () => reject(new Error('HLS player failed to load.'));
    document.head.appendChild(script);
  });

  return hlsLoaderPromise;
};

const formatTime = (value) => {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const StreamingPlayer = ({ sources = [], identity, metadata = {}, subtitles = [], onEnded }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const resumeTimeRef = useRef(null);
  const resumePlayingRef = useRef(false);
  const playbackRateRef = useRef(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notice, setNotice] = useState('');
  const [playerState, setPlayerState] = useState('Ready');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [subtitleIndex, setSubtitleIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const source = sources[selectedIndex] || sources[0];
  const progress = useMemo(() => getPlaybackProgress(identity), [identity]);

  useEffect(() => {
    if (selectedIndex >= sources.length) setSelectedIndex(0);
  }, [selectedIndex, sources.length]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return undefined;

    let cancelled = false;
    setNotice('');
    setPlayerState('Loading');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.removeAttribute('src');
    video.load();

    const restoreProgress = () => {
      const savedTime = Number(resumeTimeRef.current ?? progress?.currentTime ?? 0);
      resumeTimeRef.current = null;
      if (savedTime > 0 && Number.isFinite(video.duration) && savedTime < video.duration - 2) {
        video.currentTime = savedTime;
      }
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      setCurrentTime(video.currentTime || 0);
      video.playbackRate = playbackRateRef.current;
      setPlayerState('Ready');
      if (resumePlayingRef.current) {
        resumePlayingRef.current = false;
        video.play().catch(() => {});
      }
    };

    const attachDirectSource = () => {
      video.src = source.url;
      video.load();
      video.addEventListener('loadedmetadata', restoreProgress, { once: true });
    };

    if (source.sourceType !== 'hls') {
      attachDirectSource();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      attachDirectSource();
    } else {
      loadHlsLibrary()
        .then((Hls) => {
          if (cancelled) return;
          if (!Hls.isSupported()) throw new Error('HLS playback is not supported by this browser.');

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90,
          });
          hlsRef.current = hls;
          hls.loadSource(source.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!cancelled) restoreProgress();
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (!data?.fatal || cancelled) return;
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setNotice('The stream could not be reached. Try another configured source.');
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              setNotice('The browser could not decode this stream. Try another source.');
            } else {
              setNotice('This stream could not be played. Try another configured source.');
            }
            setPlayerState('Playback error');
            hls.destroy();
            hlsRef.current = null;
          });
        })
        .catch((error) => {
          if (!cancelled) {
            setNotice(error.message || 'HLS playback could not be initialized.');
            setPlayerState('Playback error');
          }
        });
    }

    const handleWaiting = () => setPlayerState('Buffering');
    const handlePlaying = () => { setPlayerState('Playing'); setIsPlaying(true); };
    const handlePause = () => { setPlayerState('Paused'); setIsPlaying(false); };
    const handleTime = () => setCurrentTime(video.currentTime || 0);
    const handleDuration = () => setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    const handleVolume = () => { setVolume(video.volume); setMuted(video.muted); };
    const handleRate = () => setPlaybackRate(video.playbackRate || 1);
    const handleError = () => {
      setNotice('The selected stream could not be played. Try another configured source.');
      setPlayerState('Playback error');
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('durationchange', handleDuration);
    video.addEventListener('volumechange', handleVolume);
    video.addEventListener('ratechange', handleRate);
    video.addEventListener('error', handleError);

    return () => {
      cancelled = true;
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('durationchange', handleDuration);
      video.removeEventListener('volumechange', handleVolume);
      video.removeEventListener('ratechange', handleRate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', restoreProgress);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [source, progress]); // playbackRate is intentionally managed separately

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return undefined;

    const persist = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      savePlaybackProgress(identity, {
        currentTime: video.currentTime,
        duration: video.duration,
        title: metadata.title,
        backdrop: metadata.backdrop,
      });
    };

    const handleEnded = () => {
      persist();
      if (onEnded) onEnded();
    };

    const interval = setInterval(persist, 5000);
    video.addEventListener('pause', persist);
    video.addEventListener('ended', handleEnded);

    return () => {
      clearInterval(interval);
      video.removeEventListener('pause', persist);
      video.removeEventListener('ended', handleEnded);
      persist();
    };
  }, [identity, metadata, onEnded, source]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    Array.from(video.textTracks || []).forEach((track, index) => {
      track.mode = index === subtitleIndex ? 'showing' : 'disabled';
    });
  }, [subtitleIndex, subtitles, source]);

  const rememberBeforeSourceChange = () => {
    const video = videoRef.current;
    if (!video) return;
    resumePlayingRef.current = !video.paused;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      resumeTimeRef.current = video.currentTime;
      savePlaybackProgress(identity, {
        currentTime: video.currentTime,
        duration: video.duration,
        title: metadata.title,
        backdrop: metadata.backdrop,
      });
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    video.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const changeVolume = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    video.volume = value;
    video.muted = value === 0;
  };

  const changeRate = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const value = Number(event.target.value);
    playbackRateRef.current = value;
    video.playbackRate = value;
    setPlaybackRate(value);
  };

  const toggleFullscreen = async () => {
    const container = playerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    } catch (_error) {
      setNotice('Fullscreen could not be opened on this browser.');
    }
  };

  if (!source) {
    return (
      <div className='flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black p-8 text-center text-neutral-400'>
        No authorized stream is available for this title yet.
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className='group overflow-hidden border-y border-white/10 bg-black shadow-2xl shadow-black/40 sm:rounded-2xl sm:border fullscreen:flex fullscreen:h-screen fullscreen:flex-col fullscreen:justify-center'
    >
      <div className='relative flex w-full items-center justify-center bg-black'>
        <video
          ref={videoRef}
          playsInline
          preload='metadata'
          className='aspect-video min-h-[180px] max-h-[78vh] w-full bg-black object-contain touch-manipulation sm:min-h-0 fullscreen:max-h-[calc(100vh-132px)]'
          poster={metadata.backdrop || ''}
          onClick={togglePlayback}
          onDoubleClick={toggleFullscreen}
        >
          {subtitles.map((track) => (
            <track
              key={`${track.language}-${track.url}`}
              kind='subtitles'
              src={track.url}
              srcLang={track.language}
              label={track.label || track.language}
              default={false}
            />
          ))}
        </video>

        {!isPlaying ? (
          <button
            type='button'
            onClick={togglePlayback}
            aria-label='Play video'
            className='absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-xl text-white backdrop-blur transition hover:scale-105 sm:h-16 sm:w-16'
          >
            <FaPlay className='ml-1' />
          </button>
        ) : null}
      </div>

      <div className='border-t border-white/10 bg-neutral-950/95 px-2.5 py-2.5 sm:px-4 sm:py-3'>
        <div className='flex items-center gap-2 sm:gap-3'>
          <button
            type='button'
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm text-black transition hover:bg-neutral-200 sm:h-10 sm:w-10'
          >
            {isPlaying ? <FaPause /> : <FaPlay className='ml-0.5' />}
          </button>

          <span className='min-w-[38px] text-[10px] font-semibold tabular-nums text-neutral-300 sm:text-xs'>{formatTime(currentTime)}</span>
          <input
            type='range'
            min='0'
            max={duration || 0}
            step='0.1'
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            aria-label='Seek video'
            className='h-6 min-w-0 flex-1 cursor-pointer accent-blue-500'
          />
          <span className='hidden min-w-[38px] text-right text-[10px] font-semibold tabular-nums text-neutral-400 min-[380px]:inline sm:text-xs'>{formatTime(duration)}</span>

          <button
            type='button'
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-sm text-white transition hover:bg-white/10 sm:h-10 sm:w-10'
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>

        <div className='mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3'>
          <div className='col-span-2 flex min-w-0 items-center gap-2 sm:col-span-1 sm:w-40'>
            <button
              type='button'
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-neutral-200'
            >
              {muted || volume === 0 ? <FaVolumeXmark /> : <FaVolumeHigh />}
            </button>
            <input
              type='range'
              min='0'
              max='1'
              step='0.05'
              value={muted ? 0 : volume}
              onChange={changeVolume}
              aria-label='Volume'
              className='h-7 min-w-0 flex-1 cursor-pointer accent-blue-500'
            />
          </div>

          <label className='min-w-0'>
            <span className='sr-only'>Playback speed</span>
            <select
              value={playbackRate}
              onChange={changeRate}
              aria-label='Playback speed'
              className='h-10 w-full rounded-lg border border-white/10 bg-neutral-900 px-2 text-xs font-semibold text-white outline-none focus:border-blue-500 sm:w-auto sm:min-w-[92px] sm:text-sm'
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                <option key={rate} value={rate}>{rate === 1 ? 'Speed · 1x' : `${rate}x`}</option>
              ))}
            </select>
          </label>

          <label className='min-w-0'>
            <span className='sr-only'>Quality and source</span>
            <select
              value={selectedIndex}
              onChange={(event) => {
                rememberBeforeSourceChange();
                setSelectedIndex(Number(event.target.value));
              }}
              aria-label='Quality and source'
              className='h-10 w-full rounded-lg border border-white/10 bg-neutral-900 px-2 text-xs font-semibold text-white outline-none focus:border-blue-500 sm:w-auto sm:min-w-[126px] sm:text-sm'
            >
              {sources.map((item, index) => (
                <option key={`${item.url}-${index}`} value={index}>
                  {item.quality || 'Auto'} · {item.language || 'Original'}
                </option>
              ))}
            </select>
          </label>

          <label className='min-w-0'>
            <span className='sr-only'>Subtitles</span>
            <select
              value={subtitleIndex}
              onChange={(event) => setSubtitleIndex(Number(event.target.value))}
              aria-label='Subtitles'
              className='h-10 w-full rounded-lg border border-white/10 bg-neutral-900 px-2 text-xs font-semibold text-white outline-none focus:border-blue-500 sm:w-auto sm:min-w-[126px] sm:text-sm'
            >
              <option value={-1}>Subtitles · Off</option>
              {subtitles.map((track, index) => (
                <option key={`${track.language}-${track.url}`} value={index}>
                  {track.label || track.language}
                </option>
              ))}
            </select>
          </label>

          <div className='col-span-2 min-w-0 sm:ml-auto'>
            <p className='truncate text-[10px] font-bold uppercase tracking-wider text-neutral-500 sm:text-xs'>
              {playerState} · {source.sourceType?.toUpperCase() || 'VIDEO'}
            </p>
          </div>
        </div>
      </div>

      {notice ? <p className='border-t border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200'>{notice}</p> : null}
    </div>
  );
};

export default StreamingPlayer;
