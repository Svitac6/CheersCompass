import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fut from '../assets/fut.jpg';
import { FaStar, FaRegHeart, FaTimes } from 'react-icons/fa'; // Importer FaTimes
import Card from './Cards';

const Bar_management = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [OpenHours, setOpenHours] = useState('');
    const [CloseHours, setCloseHours] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [userData, setUserData] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const fetchTags = () => {
        axios.get('http://localhost:3000/auth/tags', {})
            .then(res => {
                if (res.data.status) {
                    setTags(res.data.data);
                } else {
                    console.log(res.data.message); // Debugging
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    };

    useEffect(() => {
        fetchTags();
    }, []);



    useEffect(() => {
        axios.get('http://localhost:3000/auth/verify')
            .then(res => {
                if (res.data.status) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
                console.log(res);
            }).catch(err => {
                console.error(err);
                setIsLoggedIn(false);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/isAdmin', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setIsAdmin(res.data.data.isAdmin);
                    console.log(res.data.data.isAdmin);
                } else {
                    console.log(res.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching admin status:", error);
                navigate('/');
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/users', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setUserData(res.data.data);
                } else {
                    console.log(res.data.message); // Debugging
                    navigate('/');
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                navigate('/');
            });
    }, [navigate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/add_tag', {
            tag: newTag
        }).then(response => {
            if (response.status) {
                toast.success("Tag add successfully"); // Afficher la réponse du serveur
                setNewTag(''); // Effacer le champ de saisie
                fetchTags();

            } else {
                toast.error('Failed to add tag');
            }

        })
            .catch(err => {
                console.error(err);
                toast.error('An error occurred while adding the tag');
            });
    }

    const handleDeleteTag = (tagId) => {
        axios.delete(`http://localhost:3000/auth/delete_tag/${tagId}`, {
            data: {
                tagId: tagId
            }
        })
            .then(response => {
                if (response.status) {
                    toast.success("Tag delete successfully");
                    fetchTags();
                }


            })
            .catch(err => {
                console.log(err);
            });
    };
    const handleTagsChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedTags([...selectedTags, value]);
        } else {
            setSelectedTags(selectedTags.filter(tagId => tagId !== value));
        }
    };

    if (!isLoggedIn || !isAdmin) {
        return "Erreur 401 - Unauthorized";
    }

    return (
        <div className="relative w-full bg-gray-100">
            <Navbar />

            <div className='p-10'>
                <div className="justify-center flex">
                    <form onSubmit={handleSubmit} className="p-4  bg-white rounded shadow-md mt-4">
                        <h2 className="text-lg font-semibold mb-4">Add a New Tag</h2>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter new tag"
                            className="border p-2 w-full mb-4"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            Add Tag
                        </button>
                    </form>
                </div>

                <div className="p-4 mt-4 ">
                    <ul className='flex flex-wrap space-x-3'>
                        {tags.map(tag => (
                            <li className="rounded flex shadow-md p-2 bg-white mb-2" key={tag._id}>
                                <span className="flex-grow">{tag.name}</span>
                                <button onClick={() => handleDeleteTag(tag._id)} className='ml-2 text-red-600'><FaTimes /></button>
                            </li>
                        ))}
                    </ul>
                </div>

                <form className="p-4 bg-white rounded shadow-md mt-4  max-w-lg mx-auto">
                    <h2 className="text-lg font-semibold mb-4">Add a Bar</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                        <input type="file" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tags:</label>
                        <div className="flex flex-wrap">
                            {tags.map(tag => (
                                <label key={tag._id} className="inline-flex items-center mr-4 mb-2">
                                    <input
                                        type="checkbox"
                                        value={tag._id}
                                        checked={selectedTags.includes(tag._id)}
                                        onChange={handleTagsChange}
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                    />
                                    <span className="ml-2 text-gray-700">{tag.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Open Hours:</label>
                        <input
                            type="text"
                            value={OpenHours}
                            onChange={(e) => setOpenHours(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Close Hours:</label>
                        <input
                            type="text"
                            value={CloseHours}
                            onChange={(e) => setCloseHours(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Bar_management;
