import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetchDetails from '../../../hooks/useFetchDetails';
import { getStreamSources, getTvEpisodes } from '../../../api/streamApi';
import StreamingPlayer from '../components/StreamingPlayer';
import ErrorState from '../../../components/ui/ErrorState';
import Skeleton from '../../../components/ui/Skeleton';
import Button from '../../../components/ui/Button';
import { getSettings } from '../../me/settings';

const WatchPage = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mediaType = location.pathname.startsWith('/watch/tv/') ? 'tv' : 'movie';
  const id = Number(params.id);
  const season = Number(params.season || 0);
  const episode = Number(params.episode || 0);
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const detailsEndpoint = `/${mediaType}/${id}`;
  const { data: details } = useFetchDetails(detailsEndpoint);
  const [streamData, setStreamData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const response = await getStreamSources(mediaType, id, mediaType === 'tv' ? { season, episode } : {});
      setStreamData(response.data?.data || null);
      if (mediaType === 'tv' && season) {
        const episodeResponse = await getTvEpisodes(id, season);
        setEpisodes(episodeResponse.data?.data?.episodes || []);
      }
    } catch (requestError) {
      setError(requestError);
    } finally { setLoading(false); }
  }, [mediaType, id, season, episode]);

  useEffect(() => { load(); }, [load]);

  const title = details?.title || details?.name || streamData?.title || 'Now Playing';
  const backdrop = details?.backdrop_path ? `${imageURL}${details.backdrop_path}` : '';
  const identity = useMemo(() => ({ mediaType, tmdbId: id, season, episode }), [mediaType, id, season, episode]);

  if (loading) return <div className='mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10'><Skeleton className='aspect-video w-full' /></div>;
  if (error) return <div className='mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10'><ErrorState message='Playback could not be loaded right now.' onRetry={load} /></div>;

  const currentEpisodeIndex = episodes.findIndex((item) => Number(item.episode) === episode);
  const previousEpisode = currentEpisodeIndex > 0 ? episodes[currentEpisodeIndex - 1] : null;
  const nextEpisode = currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1 ? episodes[currentEpisodeIndex + 1] : null;

  return (
    <div className='mx-auto w-full max-w-[1400px] px-0 py-0 sm:px-6 sm:py-8 lg:px-10'>
      <div className='mb-3 flex flex-wrap items-end justify-between gap-3 px-3 pt-3 sm:mb-5 sm:px-0 sm:pt-0'>
        <div><p className='text-xs font-black uppercase tracking-[0.24em] text-red-500'>{mediaType === 'tv' ? `Season ${season} · Episode ${episode}` : 'Now Playing'}</p><h1 className='mt-2 text-2xl font-black text-white sm:text-3xl'>{title}</h1></div>
        <Link to={`/${mediaType}/${id}`} className='text-sm font-bold text-neutral-400 hover:text-white'>Back to Details</Link>
      </div>

      <StreamingPlayer
        sources={streamData?.sources || []}
        subtitles={streamData?.subtitles || []}
        identity={identity}
        metadata={{ title, backdrop }}
        onEnded={nextEpisode && getSettings().autoplayNextEpisode ? () => navigate(`/watch/tv/${id}/${season}/${nextEpisode.episode}`) : undefined}
      />

      <div className='mx-3 mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:mx-0 sm:mt-6 sm:p-5'>
        <p className='text-sm leading-6 text-neutral-400'>{streamData?.licenseNote || 'Playback is available only from sources that are owned, public domain, or properly authorized for use in CineVerse.'}</p>
      </div>

      {mediaType === 'tv' && episodes.length ? <section className='mx-3 mt-6 sm:mx-0 sm:mt-8'><h2 className='text-xl font-black text-white'>Episodes</h2><div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>{episodes.map((item) => <button key={item.episode} type='button' onClick={() => navigate(`/watch/tv/${id}/${season}/${item.episode}`)} className={`rounded-xl border p-4 text-left transition ${Number(item.episode) === episode ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}><p className='text-xs font-bold text-neutral-500'>EPISODE {item.episode}</p><p className='mt-1 font-bold text-white'>{item.title || `Episode ${item.episode}`}</p></button>)}</div><div className='mt-5 flex gap-3'>{previousEpisode ? <Button variant='secondary' onClick={() => navigate(`/watch/tv/${id}/${season}/${previousEpisode.episode}`)}>Previous Episode</Button> : null}{nextEpisode ? <Button onClick={() => navigate(`/watch/tv/${id}/${season}/${nextEpisode.episode}`)}>Next Episode</Button> : null}</div></section> : null}
    </div>
  );
};

export default WatchPage;
