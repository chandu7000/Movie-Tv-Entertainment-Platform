import React, { use } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import Card from '../components/Card'

const ExplorePage = () => {
  const params = useParams()
  const [pageNo, setPageNo] = useState(1)
  const [data, setData] = useState([])
  const [totalPage, setTotalPageNo] = useState(0)

  console.log("params", params.explore)

  const fetchData = async () => {
    try {
      const response = await axios.get(`discover/${params.explore}`, {
        params: {
          page: pageNo,
        }
      })
      setData((prev) => {
        return [
          ...prev,
          ...response.data.results
        ]
      })
      setTotalPageNo(response.data.total_pages)
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
      setPageNo((prev) => prev + 1)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pageNo])

  useEffect(() => {
    setPageNo(1)
    setData([])
    fetchData()
  }, [params.explore])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='py-14'>
      <div className='container mx-auto px-4'>
        <h3 className='capitalize text-white text-lg lg:text-2xl font-semibold my-3'>Popular {params.explore} Show</h3>
        <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-5 justify-center lg:justify-start'>
          {
            data.map((exploreData, index) => {
              return (
                <Card data={exploreData} key={exploreData.id + "exploreSection"} media_type={params.explore} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ExplorePage