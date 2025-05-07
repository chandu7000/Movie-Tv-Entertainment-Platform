import React, { useEffect, useState } from 'react'
import logo from '../assets/logo'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import userIcon from '../assets/user';
import { IoIosSearch } from "react-icons/io";
import { navigation } from '../constants/navigation';


const Header = () => {
    const location = useLocation()
    const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
    const [searchInput, setSearchInput] = useState(removeSpace);
    const navigate = useNavigate()


    console.log("location",);

    useEffect(() => {
        if (searchInput) {
            navigate(`/search?q=${searchInput}`)
        }
    }, [searchInput])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <header className='fixed top-0 w-full h-16 bg-neutral-600 bg-opacity-50 z-40'>
            <div className='container mx-auto px-12 flex items-center h-full'>
                <Link to='/'>
                    <img src={logo} alt="logo" width={100} />
                </Link>
                <nav className='hidden lg:flex items-center gap-1 ml-5'>
                    {
                        navigation.map((nav, index) => {
                            return (
                                <div>
                                    <NavLink key={nav.label} to={nav.href} className={({ isActive }) => 'px-2 hover:text-neutral-100 ${isActive && "text-neutral-100"}'}>
                                        {nav.label}
                                    </NavLink>
                                </div>
                            )
                        })
                    }
                </nav>
                <div className='ml-auto flex items-center gap-5'>
                    <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                        <input type='search' placeholder='Search here...'
                            className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block'
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={searchInput} />
                        <button className='text-2xl text-white'>
                            <IoIosSearch />
                        </button>
                    </form>
                    <div className='w-8 h-9 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                        <img src={userIcon} alt="User Icon" width='w-full h-full' />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header