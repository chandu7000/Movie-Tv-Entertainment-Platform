import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Card = ({ data, trending, index, media_type }) => {
    const imageURL = useSelector(state => state.movieData.imageURL)
    const mediaType = data.media_type ?? media_type
    return (
        <Link to={"/" + mediaType + "/" + data.id} className='w-full min-w-[230px] max-w-[230px] block h-80 overflow-hidden rounded relative hover:scale-105 transition-all'>

            {
                data?.backdrop_path ? (
                    <img src={imageURL + data?.poster_path} />
                ) : (
                    <div className='w-full h-full bg-neutral-800 flex items-center justify-center'>
                        No Image Found
                    </div>
                )
            }

            <div className='absolute top-4'>
                {
                    trending && (
                        <div className='py-1 px-4 backdrop-blur-3xl rounded-r-full bg-black/60 overflow-hidden'>
                            #{index} Trending
                        </div>
                    )
                }
            </div>
            <div className='absolute bottom-0 h-15 backdrop-blur-3xl bg-black/60 w-full overflow-hidden p-2'>
                <h2 className='text-ellipsis line-clamp-1 text-lg text-white font-semibold'>
                    {data?.title || data?.name}
                </h2>
                <div className='flex text-sm text-neutral-400 justify-between items-center'>
                    <p>{moment(data.relase_date).format("MMM Do YYYY")}</p>
                    <p className='bg-black px-1 rounded-full text-xs text-white'> Ratings: {Number(data.vote_average).toFixed(1)} </p>
                </div>
            </div>
        </Link>
    )
}

export default Card