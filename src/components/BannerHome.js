import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const BannerHome = () => {
  const bannerData = useSelector(state => state.movieData.bannerData)
  const imageURL = useSelector(state => state.movieData.imageURL)
  const [currentImage, setCurrentImage] = useState(0)
  const handleNext = () => {
    if (currentImage < bannerData.length - 1) {
      setCurrentImage(prev => prev + 1)
    } else {
      setCurrentImage(0)
    }
  }
  const handlePrevious = () => {
    if (currentImage > 0) {
      setCurrentImage(prev => prev - 1)
    } else {
      setCurrentImage(0)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImage < bannerData.length - 1) {
        handleNext()
      } else {
        setCurrentImage(0)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [bannerData, imageURL, currentImage])

  return (
    <section className='w-full h-full'>
      <div className='flex min-h-full max-h-[95vh] overflow-hidden'>
        {bannerData.map((data, index) => {
          return (
            <div key={data.id + "bannerHome" + index} className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all' style={{ transform: `translateX(-${currentImage * 100}%)` }}>
              <div className='w-full h-full'>
                <img
                  src={imageURL + data.backdrop_path}
                  alt={data?.title || data?.name || "Banner image"}
                  className='h-full object-cover w-full'
                />
              </div>

              {/***button next and previous image */}
              <div className='absolute top-0 h-full w-full flex items-center justify-between px-5'>
                <button onClick={handlePrevious} className='bg-white p-1 rounded-full text-2xl z-10 text-black'>
                  <FaAngleLeft />
                </button>

                <button onClick={handleNext} className='bg-white p-1 rounded-full text-2xl z-10 text-black'>
                  <FaAngleRight />
                </button>
              </div>

              <div className='absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent'>

              </div>

              <div className='container lg:ml-7'>
                <div className='w-full bottom-0 max-w-md absolute px-3'>
                  <h2 className='font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl'>{data?.title || data?.name}</h2>
                  <p className='text-ellipsis line-clamp-3 my-2'>{data.overview}</p>
                  <div className='flex items-center gap-2'>
                    <p>Ratings: {Number(data.vote_average).toFixed(1)}+</p>
                    <span>I</span>
                    <p>Views: {Number(data.popularity).toFixed(0)}</p>
                  </div>
                  <Link to={"/" + data?.media_type + "/" + data?.id} >
                    <button className='bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-red-500 to-orange-300 shadow-md transition-all hover:scale-105'>Play Now</button>
                  </Link>
                </div>
              </div>
            </div>
          )
        }
        )
        }
      </div>
    </section>
  )
}

export default BannerHome