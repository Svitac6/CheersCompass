import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Card from './Cards';
import Footer from './Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null); // Initialize userData as null
    const [currentPage, setCurrentPage] = useState(1);
    const [favoritesPerPage] = useState(4); // Number of favorites per page
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

    useEffect(() => {
        axios.get('http://localhost:3000/auth/verify')
            .then(res => {
                if (res.data.status) {
                    // User is verified, do nothing or set some state if needed
                } else {
                    navigate('/login');
                }
                console.log(res);
            })
            .catch(error => {
                console.error("Error verifying user:", error);
                navigate('/login');
            });
    }, [navigate]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setUserData(res.data.data);
                    console.log(res.data.data._id);
                } else {
                    console.log(res.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    useEffect(() => {
        if (userData && userData._id) {
            axios.get(`http://localhost:3000/auth/favorites/${userData._id}`)
                .then(response => {
                    if (response.status === 200 && response.data.status) {
                        console.log('Favorites data:', response.data.data);
                        setFavorites(response.data.data);
                        // Extract unique tags from favorites
                        const uniqueTags = Array.from(new Set(response.data.data.flatMap(favorite => favorite.bar.types.map(tag => tag.name))));
                        setTags(uniqueTags);
                    } else {
                        console.log("Error fetching favorites:", response.data.message);
                    }
                })
                .catch(err => {
                    console.error('Error fetching favorites:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [userData]);

    const indexOfLastFavorite = currentPage * favoritesPerPage;
    const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
    const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleTagCheckboxChange = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const filteredFavorites = currentFavorites.filter((favorite) => {
        if (selectedTags.length === 0) {
            return true; // Show all favorites if no tag is selected
        } else {
            return selectedTags.some(tag => favorite.bar.types.some(t => t.name === tag));
        }
    });

    const sortedFavorites = filteredFavorites.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.bar.rating - b.bar.rating;
        } else {
            return b.bar.rating - a.bar.rating;
        }
    });

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="bg-gray-100 relative w-full min-h-screen">
                <Navbar />
                <div className="flex-grow lg:pl-32 lg:pr-32 lg:pt-20 lg:pb-20 pl-5 pr-5 pb-10 pt-10">
                    <div className="mb-4">
                        <div className="flex mb-2">
                            <button
                                className={`px-3 py-1 mr-2 bg-white border border-gray-300 rounded-md hover:bg-gray-200 ${sortOrder === 'asc' ? 'font-bold' : ''}`}
                                onClick={toggleSortOrder}
                            >
                                Ascending
                            </button>
                            <button
                                className={`px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-200 ${sortOrder === 'desc' ? 'font-bold' : ''}`}
                                onClick={toggleSortOrder}
                            >
                                Descending
                            </button>
                        </div>

                        <div key="1" className="">
                            {tags.map(tag => (
                                <label key={tag} className="inline-flex items-center mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagCheckboxChange(tag)}
                                    />
                                    <span className="ml-2 text-gray-700">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {sortedFavorites.map(favorite => (
                            <div key={favorite.bar._id} className="">
                                <Card
                                    userId={userData ? userData._id : null}
                                    barId={favorite.bar._id}
                                    name={favorite.bar.name}
                                    image={`http://localhost:3000/${favorite.bar.image}`}
                                    rating={favorite.bar.rating}
                                    tags={favorite.bar.types.map(tag => tag.name)}
                                    hours={`${favorite.bar.opening_hours} - ${favorite.bar.closing_hours}`}
                                    address={favorite.bar.location}
                                    description={favorite.bar.description}
                                    numRating={favorite.bar.numRating}
                                />
                            </div>
                        ))}
                    </div>

                    <nav className="mt-4 flex justify-center">
                        <ul className="inline-flex">
                            {Array.from({ length: Math.ceil(filteredFavorites.length / favoritesPerPage) }, (_, index) => index + 1).map((number) => (
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
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
