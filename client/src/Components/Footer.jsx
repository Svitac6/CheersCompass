import React from 'react';
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../assets/icone2.png'; // Assurez-vous de remplacer par le chemin correct vers votre logo

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-8 w-full">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center">
                    {/* Section du logo */}
                    <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
                        <img src={logo} alt="Logo" className="w-40 mx-auto md:mx-0" />
                    </div>
                    
                    {/* Section des liens de navigation */}
                    <div className="w-full md:w-1/4 text-center md:text-left mb-4 md:mb-0">
                        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
                        <ul>
                            <li className="mb-2">
                                <Link to="/" className="hover:text-yellow-500">Home</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/dashboard" className="hover:text-yellow-500">Favorite Bar</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/info" className="hover:text-yellow-500">Info</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/contact" className="hover:text-yellow-500">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section des réseaux sociaux */}
                    <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
                        <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
                        <div className="flex justify-center space-x-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-yellow-500">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-yellow-500">
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-yellow-500">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-yellow-500">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Section des informations de contact */}
                    <div className="w-full md:w-1/4 text-center md:text-right">
                        <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
                        <p className="mb-2">96 rue du Coin De La Rue</p>
                        <p className="mb-2">Reims</p>
                        <p className="mb-2">Email: cheerscompass51@gmail.com</p>
                        <p className="mb-2">Phone: +33 6.00.00.00.01</p>
                    </div>
                </div>

                {/* Section du copyright */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        &copy; 2024 Tchin & co . All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
