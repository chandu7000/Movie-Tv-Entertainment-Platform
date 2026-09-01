import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import useFetchDetails from '../../../hooks/useFetchDetails';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaHeart, FaPlay } from 'react-icons/fa6';
import HorizontalScrollCard from '../../../components/media/HorizontalScrollCard';
import PersonCard from '../../../components/media/PersonCard';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import RatingBadge from '../../../components/ui/RatingBadge';
import GenreChip from '../../../components/ui/GenreChip';
import ErrorState from '../../../components/ui/ErrorState';
import Skeleton from '../../../components/ui/Skeleton';
import SectionHeader from '../../../components/ui/SectionHeader';
import MediaPlaceholder from '../../../components/ui/MediaPlaceholder';
import { addRecentlyViewed } from '../../history/recentlyViewed';
import { getStreamAvailability } from '../../../api/streamApi';
import { getResolvedTrailer } from '../../../api/trailerApi';
import { isFavorite, toggleFavorite, FAVORITES_EVENT } from '../../me/favorites';

const formatMoney = (value) => value ? `$${Number(value).toLocaleString()}` : 'Not available';

const MetadataItem = ({ label, children }) => (
  <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4'>
    <p className='text-xs font-bold uppercase tracking-wider text-neutral-500'>{label}</p>
    <div className='mt-1.5 text-sm font-semibold text-neutral-200'>{children || 'Not available'}</div>
  </div>
);

const DetailsPage = () => {
  const params = useParams();
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/tv/') ? 'tv' : 'movie';
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const { data, loading, error, retry } = useFetchDetails(`/${mediaType}/${params?.id}`);
  const { data: castData } = useFetchDetails(`/${mediaType}/${params?.id}/credits`);
  const { data: videosData } = useFetchDetails(`/${mediaType}/${params?.id}/videos`);
  const { data: releaseData } = useFetchDetails(`/${mediaType}/${params?.id}/${mediaType === 'movie' ? 'release_dates' : 'content_ratings'}`);
  const { data: similarData } = useFetch(`/${mediaType}/${params?.id}/similar`);
  const { data: recommendationData } = useFetch(`/${mediaType}/${params?.id}/recommendations`);
  const [availability, setAvailability] = useState(null);
  const [resolvedTrailer, setResolvedTrailer] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (data?.id) addRecentlyViewed(null, data, mediaType);
  }, [data, mediaType]);

  useEffect(() => {
    const refreshFavorite = () => setFavorite(isFavorite(params.id, mediaType));
    refreshFavorite();
    window.addEventListener(FAVORITES_EVENT, refreshFavorite);
    return () => window.removeEventListener(FAVORITES_EVENT, refreshFavorite);
  }, [params.id, mediaType]);


  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const response = await getStreamAvailability(mediaType, params.id, mediaType === 'tv' ? { season: 1, episode: 1 } : {});
        if (active) setAvailability(response.data?.data || null);
      } catch {
        if (active) setAvailability({ available: false });
      }
    };
    check();
    return () => { active = false; };
  }, [mediaType, params.id]);

  useEffect(() => {
    let active = true;
    setTrailerLoading(true);
    setResolvedTrailer(null);

    const loadTrailer = async () => {
      try {
        const response = await getResolvedTrailer(mediaType, params.id);
        if (active) setResolvedTrailer(response.data?.trailer || null);
      } catch {
        if (active) setResolvedTrailer(null);
      } finally {
        if (active) setTrailerLoading(false);
      }
    };

    loadTrailer();
    return () => { active = false; };
  }, [mediaType, params.id]);

  const certification = useMemo(() => {
    if (mediaType === 'movie') {
      const region = releaseData?.results?.find((item) => item.iso_3166_1 === 'US') || releaseData?.results?.[0];
      return region?.release_dates?.find((item) => item.certification)?.certification || 'NR';
    }
    return releaseData?.results?.find((item) => item.iso_3166_1 === 'US')?.rating || releaseData?.results?.[0]?.rating || 'NR';
  }, [releaseData, mediaType]);

  if (loading && !data) return <div className='mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10'><Skeleton className='h-[520px] w-full' /></div>;
  if (error && !data) return <div className='mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10'><ErrorState message='Unable to load this title right now.' onRetry={retry} /></div>;

  const runtimeMinutes = Number(data?.runtime || data?.episode_run_time?.[0] || 0);
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;
  const duration = runtimeMinutes ? `${hours ? `${hours}h ` : ''}${minutes}m` : '';
  const releaseDate = data?.release_date || data?.first_air_date;
  const director = castData?.crew?.find((person) => person?.job === 'Director')?.name;
  const creators = data?.created_by?.map((person) => person.name).join(', ');
  const writers = castData?.crew?.filter((person) => ['Writer', 'Screenplay', 'Story'].includes(person?.job))?.map((person) => person?.name)?.filter((name, index, values) => values.indexOf(name) === index)?.slice(0, 4)?.join(', ');
  const videos = (videosData?.results || [])
    .filter((video) => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type))
    .sort((a, b) => Number(Boolean(b.official)) - Number(Boolean(a.official)))
    .slice(0, 6);
  const watchPath = mediaType === 'tv' ? `/watch/tv/${params.id}/1/1` : `/watch/movie/${params.id}`;

  return (
    <div>
      <section className='relative min-h-[560px] overflow-hidden'>
        {data?.backdrop_path || data?.poster_path ? <img src={`${imageURL}${data?.backdrop_path || data?.poster_path}`} alt='' className='absolute inset-0 h-full w-full object-cover' /> : <div className='absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black' />}
        <div className='absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/30' />
        <div className='absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30' />
        <div className='relative mx-auto flex min-h-[560px] w-full max-w-[1600px] items-end px-4 pb-12 pt-20 sm:px-6 lg:px-10'>
          <div className='grid w-full gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-end'>
            <div className='hidden overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl lg:block'>{data?.poster_path || data?.backdrop_path ? <img src={`${imageURL}${data?.poster_path || data?.backdrop_path}`} alt={`${data?.title || data?.name} poster`} className='aspect-[2/3] h-full w-full object-cover' /> : <MediaPlaceholder title={data?.title || data?.name || 'CineVerse title'} className='aspect-[2/3]' />}</div>
            <div className='max-w-4xl'>
              <div className='flex flex-wrap gap-2'><Badge>{mediaType === 'tv' ? 'TV Series' : 'Movie'}</Badge><Badge>{certification}</Badge><RatingBadge value={data?.vote_average} voteCount={data?.vote_count} showLabel /></div>
              <h1 className='mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl'>{data?.title || data?.name}</h1>
              {data?.tagline ? <p className='mt-3 text-lg italic text-neutral-300'>{data.tagline}</p> : null}
              <div className='mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-neutral-300'>{releaseDate ? <span>{moment(releaseDate).format('YYYY')}</span> : <span>Release TBA</span>}{duration ? <span>{duration}</span> : null}{mediaType === 'tv' ? <><span>{data?.number_of_seasons || 0} seasons</span><span>{data?.number_of_episodes || 0} episodes</span></> : null}</div>
              {data?.genres?.length ? <div className='mt-4 flex flex-wrap gap-2'>{data.genres.map((genre) => <GenreChip key={genre.id || genre.name}>{genre.name}</GenreChip>)}</div> : null}
              <p className='mt-5 max-w-3xl text-base leading-7 text-neutral-300'>{data?.overview || 'Synopsis not available for this title.'}</p>
              <div className='mt-6 flex flex-wrap gap-3'>
                {availability?.available ? <Link to={watchPath}><Button><FaPlay className='text-xs' /> Watch Now</Button></Link> : <Button disabled className='cursor-not-allowed opacity-60'><FaPlay className='text-xs' /> Not Available to Watch</Button>}
                {resolvedTrailer?.key ? <Link to={`/trailer/${mediaType}/${params.id}/${resolvedTrailer.key}`}><Button variant='secondary'>Official Trailer</Button></Link> : trailerLoading ? <Button variant='secondary' disabled>Finding trailer…</Button> : <Button variant='secondary' disabled className='cursor-not-allowed opacity-50'>Trailer Not Available</Button>}
                <Button variant='secondary' onClick={() => setFavorite(toggleFavorite(data, mediaType))}><FaHeart className={favorite ? 'text-red-400' : ''} /> {favorite ? 'Saved to Favorites' : 'Add to Favorites'}</Button>
              </div>
              {!availability?.available ? <p className='mt-3 text-xs text-neutral-500'>Streaming is available only when an authorized playback source has been configured for this title.</p> : null}
            </div>
          </div>
        </div>
      </section>

      <div className='mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10'>
        {mediaType === 'tv' && data?.seasons?.length ? <section className='mb-14'><SectionHeader title='Seasons' description='Choose a season to start watching available episodes.' /><div className='flex flex-wrap gap-3'>{data.seasons.filter((season) => season.season_number > 0).map((season) => <Link key={season.id} to={`/watch/tv/${params.id}/${season.season_number}/1`} className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-neutral-200 transition hover:bg-white/[0.08]'>Season {season.season_number}</Link>)}</div></section> : null}

        <section><SectionHeader title='Cast & Creators' description={mediaType === 'tv' ? 'Cast and creators for this series.' : 'Featured cast and key creative credits.'} /><div className='mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'><MetadataItem label={mediaType === 'tv' ? 'Creators' : 'Director'}>{mediaType === 'tv' ? creators : director}</MetadataItem><MetadataItem label='Writer / Story'>{writers}</MetadataItem><MetadataItem label='Original language'>{data?.original_language?.toUpperCase()}</MetadataItem></div><div className='grid grid-cols-[repeat(auto-fit,110px)] gap-5'>{castData?.cast?.filter((person) => person?.profile_path)?.slice(0, 18)?.map((person) => <PersonCard key={`${person.id}-${person.cast_id || person.character || person.name}`} person={person} imageURL={imageURL} />)}</div></section>

        <section className='mt-14'><SectionHeader title='Title Information' description='Release, production and distribution details.' /><div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'><MetadataItem label='Status'>{data?.status}</MetadataItem><MetadataItem label={mediaType === 'tv' ? 'First air date' : 'Release date'}>{releaseDate ? moment(releaseDate).format('Do MMMM YYYY') : 'Not available'}</MetadataItem>{mediaType === 'movie' ? <><MetadataItem label='Budget'>{formatMoney(data?.budget)}</MetadataItem><MetadataItem label='Revenue'>{formatMoney(data?.revenue)}</MetadataItem></> : <><MetadataItem label='Networks'>{data?.networks?.map((network) => network.name).join(', ')}</MetadataItem><MetadataItem label='Last air date'>{data?.last_air_date ? moment(data.last_air_date).format('Do MMMM YYYY') : 'Not available'}</MetadataItem></>}<MetadataItem label='Production companies'>{data?.production_companies?.slice(0, 3).map((company) => company.name).join(', ')}</MetadataItem><MetadataItem label='Original title'>{data?.original_title || data?.original_name}</MetadataItem></div></section>

        {videos.length ? <section className='mt-14'><SectionHeader title='Trailers & Videos' description='Official trailers and teasers available for this title.' /><div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>{videos.map((video) => <Link key={video.id} to={`/trailer/${mediaType}/${params.id}/${video.key}`} className='group rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.07]'><p className='text-xs font-bold uppercase tracking-wider text-neutral-500'>{video.type}</p><h3 className='mt-2 font-bold text-white group-hover:underline'>{video.name}</h3><p className='mt-3 text-xs font-bold text-red-400'>Watch Video</p></Link>)}</div></section> : null}
      </div>

      <HorizontalScrollCard data={similarData} heading={`More Like This`} media_type={mediaType} />
      <HorizontalScrollCard data={recommendationData} heading='You May Also Like' media_type={mediaType} variant='landscape' />
    </div>
  );
};

export default DetailsPage;
