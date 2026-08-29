import { FaCompass, FaHome } from 'react-icons/fa';
import { PiTelevisionFill } from 'react-icons/pi';
import { BiSolidCameraMovie } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';

export const navigation = [
  {
    label: 'Home',
    href: '/',
    icon: <FaHome />,
    end: true,
  },
  {
    label: 'Movies',
    href: '/movie',
    icon: <BiSolidCameraMovie />,
  },
  {
    label: 'TV Shows',
    href: '/tv',
    icon: <PiTelevisionFill />,
  },
  {
    label: 'Discover',
    href: '/discover',
    icon: <FaCompass />,
  },
  {
    label: 'Search',
    href: '/search',
    icon: <IoIosSearch />,
  },
];

export const mobileNavigation = [
  {
    label: 'Home',
    href: '/',
    icon: <FaHome />,
    end: true,
  },
  {
    label: 'Movies',
    href: '/movie',
    icon: <BiSolidCameraMovie />,
  },
  {
    label: 'TV',
    href: '/tv',
    icon: <PiTelevisionFill />,
  },
  {
    label: 'Search',
    href: '/search',
    icon: <IoIosSearch />,
  },
];
