import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useFetchDetails from '../hooks/useFetchDetails'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Divider from '../components/Divider'
import HorizontalScrollCard from '../components/HorizontalScrollCard'
import VideoPlay from '../components/VideoPlay'


const DetailsPage = () => {
  const params = useParams()
  const imageURL = useSelector(state => state.movieData.imageURL)
  const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`)
  const { data: castData } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`)
  const { data: similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`)
  const { data: recommendationData } = useFetch(`/${params?.explore}/${params?.id}/recommendations`)
  const [ playVideo, setPlayVideo ] = useState(false)
  const [ playVideoId, setPlayVideoId ] = useState("")


  console.log("data", data)
  console.log("star cast", castData)

  const handlePlayVideo = (data) => {
    setPlayVideoId(data)
    setPlayVideo(true)
  }

  const duration = (Number(data?.runtime) / 60)?.toFixed(1)?.split(".")
  const writer = castData?.crew?.filter(el => el?.job === "Story")?.map(el => el?.name)?.join(", ");
  return (
    <div>
      <div className='w-full h-[350px] relative hidden lg:block'>
        <div className='w-full h-full'>
          <img
            src={imageURL + data?.backdrop_path}
            alt={data?.title || 'Backdrop image'}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent '>

        </div>
      </div>
      <div className='container mx-auto px-4 py-20 lg:py-0 flex flex-col lg:flex-row gap-5'>
        <div className='relative mx-auto lg:-mt-28 lg:mx-0 w-fit min-w-60'>
          <img
            src={imageURL + data?.poster_path}
            alt={data?.title || 'Backdrop image'}
            className='h-80 w-60 object-cover rounded'
          />
          <button onClick={() => handlePlayVideo(data)} className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all'>Play Now</button>
        </div>

        <div>
          <h2 className='text-2xl lg:text-4xl font-bold text-white'>{data?.title || data?.name}</h2>
          <p className='text-neutral-400'>{data?.tagline}</p>

          <Divider />

          <div className='flex items-center gap-3'>
            <p>Rating : {Number(data?.vote_average).toFixed(1)}+</p>
            <span>|</span>
            <p>View : {Number(data?.vote_count)}</p>
            <span>|</span>
            <p>Duration : {duration[0]}h {duration[1]}m</p>
          </div>

          <Divider />

          <div>
            <h3 className='text-xl font-bold text-white mb-1'>Overview</h3>
            <p className='text-neutral-400'>{data?.overview}</p>


            <Divider />
            <div className='flex items-center gap-3 my-3 text-center'>
              <p>Status : {data?.status}</p>
              <span>|</span>
              <p>Release Date : {moment(data?.release_date).format("Do MMMM YYYY")}</p>
              <span>|</span>
              <p>Revenue : {Number(data?.revenue)}</p>
            </div>
            <Divider />

          </div>

          <div>
            <p><span className='text-white'>Director</span> : {castData?.crew[1]?.name}</p>

            <Divider />

            <p><span className='text-white'>Writer</span> : {writer}</p>
          </div>

          <Divider />

          <h2 className='text-lg font-bold'>Cast</h2>
          <div className='grid grid-cols-[repeat(auto-fit,96px)] gap-5'>
            {
              castData?.cast?.filter(el => el?.profile_path).map((startCast, index) => {
                return (
                  <div>
                    <div>
                      <img
                        src={imageURL + startCast?.profile_path}
                        alt={startCast?.name}
                        className='h-24 w-24 object-cover rounded-full'
                      />
                      <div>
                        <p className='text-center text-sm text-neutral-400'>{startCast?.name}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      <div>
        <HorizontalScrollCard data={similarData} heading={"Similar " + params?.explore} media_type={params?.explore} />
        <HorizontalScrollCard data={recommendationData} heading={"Recommendation " + params?.explore} media_type={params?.explore} />
      </div>
      {
        playVideo && (
          <VideoPlay data={playVideoId} close={() => setPlayVideo(false)} media_type={params.explore} />
        )
      }


    </div>
  )
}

export default DetailsPage