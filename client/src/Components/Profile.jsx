import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'

const Profil = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/forgot-password', {
            email,
        }).then(reponse => {
            if (reponse.data.status) {
                alert("chek you email for reset password link")
                navigate('/login')
            }

        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
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



    return (
        <div className="relative w-full h-screen">

            <div className="absolute top-4 left-4 z-20">
                <Link to="/">
                    <FaArrowLeft className="text-black text-2xl" />
                </Link>
            </div>
            <div className="relative z-10 flex justify-center items-center min-h-screen flex-col">
                <div className="flex mb-8">
                    <h1 className="text-4xl text-white font-bold text-center">CHEERSCOMPASS</h1>
                </div>
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                    {userData ? (
                        <div>
                            <h1 className='text-center text-2xl font-semibold mb-4'>Profil</h1>
                            <h2>Username: {userData.username}</h2>
                            <h2>Email: {userData.email}</h2>
                        </div>
                    ) : (
                        <p className="text-center text-gray-700">Loading user data...</p> // Message de chargement
                    )}
                </div>
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 mt-5">
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Change Password</h2>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="off"
                                placeholder="Email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>


    );
};

export default Profil;
