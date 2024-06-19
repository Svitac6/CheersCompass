// Home.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Card from './Cards';
import Footer from './Footer';
import axios from 'axios';
import video from '../assets/bar.mp4';
import 'react-toastify/dist/ReactToastify.css';
import { Transition } from '@headlessui/react';

const Home = () => {
    const [bars, setBars] = useState([]);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [barsPerPage] = useState(4); // Nombre de bars par page
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' pour croissant, 'desc' pour décroissant
    const nodeRef = useRef(null); // Définissez nodeRef en utilisant useRef

    useEffect(() => {
        axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setUserData(res.data.data);
                } else {
                    console.log(res.data.message);
                    navigate('/');
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                navigate('/');
            });
    }, [navigate]);

    const fetchBars = () => {
        axios.get('http://localhost:3000/auth/bars')
            .then(res => {
                if (res.data.status) {
                    setBars(res.data.data);
                } else {
                    console.error(res.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching bars:', error);
            });
    };

    useEffect(() => {
        fetchBars();
    }, []);

    // Fonction pour filtrer et trier les bars par tags sélectionnés
    const filteredBars = bars.filter((bar) => {
        if (selectedTags.length === 0) {
            return true; // Affiche tous les bars si aucun tag sélectionné
        } else {
            return selectedTags.every((tag) => bar.types.some((t) => t.name === tag));
        }
    });

    const sortedBars = filteredBars.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.rating - b.rating;
        } else {
            return b.rating - a.rating;
        }
    });

    // Fonction pour gérer le changement de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Générer les checkboxes pour les tags uniques
    const uniqueTags = Array.from(new Set(bars.flatMap((bar) => bar.types.map((tag) => tag.name))));

    return (
        <div className="relative w-full min-h-screen bg-gray-100 flex flex-col">
            <Navbar />

            <div className="relative h-96">
                <video
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                    autoPlay
                    loop
                    muted
                >
                    <source src={video} type="video/mp4" />
                    Votre navigateur ne prend pas en charge la balise vidéo.
                </video>
                <Transition
                    show={true}
                    as="div"
                    ref={nodeRef}
                    className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-1000"
                >
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4 animate-text-reveal">
                            Trouve ton bar et bien plus encore
                        </h1>
                        
                    </div>
                </Transition>
                
            </div>

            <div className="flex-grow lg:pl-32 lg:pr-32 lg:pt-20 lg:pb-20 pl-5 pr-5 pb-10 pt-10">
                {/* Boutons de tri */}
                <div className="mb-4">
                    <div className="flex mb-2">
                        <button
                            className={`px-3 py-1 mr-2 bg-white border border-gray-300 rounded-md hover:bg-gray-200 ${sortOrder === 'asc' ? 'font-bold' : ''}`}
                            onClick={() => setSortOrder('asc')}
                        >
                            Ascendant
                        </button>
                        <button
                            className={`px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-200 ${sortOrder === 'desc' ? 'font-bold' : ''}`}
                            onClick={() => setSortOrder('desc')}
                        >
                            Descendant
                        </button>
                    </div>

                    {/* Checkboxes pour les tags */}
                    <div>
                        {uniqueTags.map((tag) => (
                            <label key={tag} className="inline-flex items-center mr-4 mb-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                    checked={selectedTags.includes(tag)}
                                    onChange={(e) =>
                                        e.target.checked
                                            ? setSelectedTags([...selectedTags, tag])
                                            : setSelectedTags(selectedTags.filter((t) => t !== tag))
                                    }
                                />
                                <span className="ml-2 text-gray-700">{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Liste des bars filtrés et triés */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {sortedBars.slice((currentPage - 1) * barsPerPage, currentPage * barsPerPage).map((bar) => (
                        <div key={bar._id} className="">
                            <Card
                                userId={userData ? userData._id : null}
                                barId={bar._id}
                                name={bar.name}
                                image={`http://localhost:3000/${bar.image}`}
                                rating={bar.rating}
                                tags={bar.types.map((tag) => tag.name)}
                                hours={`${bar.opening_hours} - ${bar.closing_hours}`}
                                address={bar.location}
                                description={bar.description}
                                numRating={bar.numRating}
                            />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <nav className="mt-4 flex justify-center">
                    <ul className="inline-flex">
                        {Array.from({ length: Math.ceil(sortedBars.length / barsPerPage) }, (_, index) => index + 1).map((number) => (
                            <li key={number}>
                                <button
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-200 ${currentPage === number ? 'font-bold' : ''}`}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
