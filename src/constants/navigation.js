import { FaHome } from "react-icons/fa";
import { PiTelevisionFill } from "react-icons/pi";
import { BiSolidCameraMovie } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";


export const navigation = [
    {
        label: 'TV Shows',
        href: 'tv',
        icon: <PiTelevisionFill />,
    },
    {
        label: 'Movies',
        href: 'movie',
        icon: <BiSolidCameraMovie />,
    },
]

export const mobileNavigation = [
    {
        label: 'Home',
        href: '/',
        icon: <FaHome />,
    },
    ...navigation,
    {
        label: 'Search',
        href: '/search',
        icon: <IoIosSearch />,
    }

]