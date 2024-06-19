import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from "react-router-dom";
import icone from '../assets/icone.png';
import icone2 from '../assets/icone2.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // État de connexion
    const [isAdmin, setIsAdmin] = useState(false); // État d'administration
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false); // État du menu de navigation
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // État du menu de profil

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3000/auth/verify')
            .then(res => {
                if (res.data.status) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
                
            }).catch(err => {
                console.error(err);
                setIsLoggedIn(false);
            });
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/isAdmin', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setIsAdmin(res.data.data.isAdmin);
                    
                } else {
                    console.log(res.data.message); // Debugging
                }
            })
            .catch(error => {
                console.error("Error fetching admin status:", error);
                navigate('/');
            });
    }, [navigate]);

    const handleLogout = () => {
        axios.get('http://localhost:3000/auth/logout')
            .then(res => {
                if (res.data.status) {
                    setIsLoggedIn(false);
                    navigate('/login');
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const getLinkClass = (path) => (
        location.pathname === path
            ? 'bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium'
            : 'text-gray-white hover:bg-yellow-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
    );

    const toggleNavMenu = () => {
        setIsNavMenuOpen(!isNavMenuOpen);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    return (
        <nav className="bg-white text-gray-800 ">
            <div className=" px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        
                        <div className="hidden  md:flex md:space-x-8 text-gray-800">
                            <Link to="/" className={getLinkClass('/')}>Home</Link>
                            <Link to="/dashboard" className={getLinkClass('/dashboard')}>Favorite Bar</Link>
                            <Link to="/info" className={getLinkClass('/info')}>Info</Link>
                            {isLoggedIn && isAdmin && (
                                <Link to="/logs" className={getLinkClass('/logs')}>Logs</Link>
                            )}
                            {isLoggedIn && isAdmin && (
                                <Link to="/bar_manage" className={getLinkClass('/bar_manage')}>Bar manage</Link>
                            )}
                        </div>
                        
                        
                    </div>
                    <div className="flex mr-32 items-center">
                            <img width="200" src={icone2} alt="Icon" />
                    </div>
                    <div className="flex items-center">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button onClick={toggleProfileMenu} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out">
                                    <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="User Profile" />
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="relative">
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Profile {isAdmin && <span className="text-xs text-gray-400">(Admin)</span>}
                                            </Link>
                                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                            <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Sign out</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={toggleNavMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-white hover:bg-yellow-500 focus:outline-none focus:bg-yellow-700 focus:text-white">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={isNavMenuOpen ? 'block md:hidden' : 'hidden'}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="text-gray-800 hover:bg-yellow-500  px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                    <Link to="/dashboard" className="text-gray-800 hover:bg-yellow-500 px-3 py-2 rounded-md text-sm font-medium">Favorite Bar</Link>
                    <Link to="/info" className="text-gray-800 hover:bg-yellow-500  px-3 py-2 rounded-md text-sm font-medium">Info</Link>

                    {isLoggedIn && isAdmin && (
                        <Link to="/logs" className="text-gray-800 hover:text-white hover:bg-yellow-500 px-3 py-2 rounded-md text-sm font-medium">Logs</Link>
                    )}
                    {isLoggedIn && isAdmin && (
                        <Link to="/bar_manage" className="text-gray-800 hover:text-white hover:bg-yellow-500 px-3 py-2 rounded-md text-sm font-medium">Bar manage</Link>
                    )}


                </div>
            </div>
        </nav>
    );
};

export default Navbar;
