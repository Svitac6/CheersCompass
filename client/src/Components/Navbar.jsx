import React, { useState } from 'react';
import axios from 'axios'
import { Link, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import icone from '../assets/icone.png'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation();
    axios.defaults.withCredentials = true;
    const handleLogout = () => {
        axios.get('http://localhost:3000/auth/logout')
            .then(res => {
                if (res.data.status)
                    navigate('/login')
            }).catch(err => {
                console.log(err)
            })
    }
    const getLinkClass = (path) => (
        location.pathname === path
            ? 'bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex ">
                            <img width="30" src={icone} alt="" />
                        </div>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link to="/" className={getLinkClass('/')}>Home</Link>
                            <Link to="/dashboard" className={getLinkClass('/dashboard')}>Bar favoris</Link>
                            <Link to="/info" className={getLinkClass('/info')}>Info</Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button onClick={toggleMenu} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out">
                                <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="User Profile" />
                            </button>
                            {isMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                    <Link to="/profil" href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                    <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>

                                </div>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={isMenuOpen ? 'block md:hidden' : 'hidden'}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"> Home</Link>
                    <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Bar favoris</Link>
                    <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Info</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
