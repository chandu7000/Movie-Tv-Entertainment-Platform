import React, { useRef } from 'react'
import Card from './Card'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const HorizontalScrollCard = ({ data = [], heading, trending, media_type }) => {
    const containerRef = useRef()
    const handleNext = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 250
        }
    }

    const handlePrevious = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 250
        }
    }

    return (
        <div className='container mx-auto lg:px-10 my-10 px-4'>
            <h2 className='text-xl lg:text-2xl font-bold mb-3 text-white capitalize'>{heading}</h2>
            <div className='relative'>
                <div ref={containerRef} className='grid grid-cols-[repeat(auto-fit, 230px)] grid-flow-col gap-4 overflow-hidden relative z-10 overflow-x-scroll scroll-smooth transition-all scrollBar-none'>
                    {
                        data.map((data, index) => {
                            return (
                                <Card key={data.id + "heading" + index} data={data} index={index + 1} trending={trending} media_type={media_type} />
                            )
                        })
                    }
                </div>
                <div className='absolute top-0 hidden lg:flex h-full w-full  items-center justify-between px-5'>
                    <button onClick={handlePrevious} className='bg-white p-1 rounded-full text-2xl -ml-10 text-black z-10'>
                        <FaAngleLeft />
                    </button>

                    <button onClick={handleNext} className='bg-white p-1 rounded-full text-2xl -mr-10 text-black z-10'>
                        {<FaAngleRight className='' />}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default HorizontalScrollCard