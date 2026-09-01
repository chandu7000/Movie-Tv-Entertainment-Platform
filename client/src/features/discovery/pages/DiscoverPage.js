import React from 'react';
import { Link } from 'react-router-dom';
import { BiSolidCameraMovie } from 'react-icons/bi';
import { PiTelevisionFill } from 'react-icons/pi';
import SectionHeader from '../../../components/ui/SectionHeader';

const DiscoverPage = () => {
  const options = [
    {
      title: 'Discover Movies',
      description: 'Explore popular, now-playing, upcoming and top-rated movies with flexible filters.',
      href: '/movie',
      icon: <BiSolidCameraMovie />,
    },
    {
      title: 'Discover TV Shows',
      description: 'Explore popular and currently airing TV series with dedicated discovery controls.',
      href: '/tv',
      icon: <PiTelevisionFill />,
    },
  ];

  return (
    <section className='px-4 py-10 sm:px-6 lg:px-10'>
      <div className='mx-auto w-full max-w-[1600px]'>
        <SectionHeader title='Discover' />
        <p className='mb-8 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base'>
          Explore movies and TV series by popularity, release status, genre, language and more.
        </p>

        <div className='grid gap-5 md:grid-cols-2'>
          {options.map((option) => (
            <Link
              key={option.title}
              to={option.href}
              className='group rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
            >
              <div className='mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl text-neutral-950'>
                {option.icon}
              </div>
              <h2 className='text-2xl font-black text-white'>{option.title}</h2>
              <p className='mt-3 max-w-xl leading-6 text-neutral-400'>{option.description}</p>
              <span className='mt-6 inline-block text-sm font-bold text-white transition group-hover:translate-x-1'>
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverPage;
