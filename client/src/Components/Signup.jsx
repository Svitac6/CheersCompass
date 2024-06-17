import React, { useState } from "react";
import '../App.css'
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import videoBg from '../assets/test.mp4'
import icone from '../assets/icone.png'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ajout des logs pour déboguer
        console.log("Submitting:", { username, email, password });

        Axios.post('http://localhost:3000/auth/signup', {
            username,
            email,
            password
        }).then(response => {
            console.log("Response received:", response);

            if (response.data.status) {
                console.log("Success, navigating to login");
                navigate('/login', { state: { signupSuccess: true } });

            } else {
                console.log("Signup failed:", response.data.message);
                toast.error("Signup Failed");
            }

        }).catch(err => {
            console.log("Error during signup request:", err);
        });
    };

    return (
        <div className="relative w-full h-screen">
            <video className="absolute inset-0 w-full h-full object-cover" src={videoBg} autoPlay loop muted />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex justify-center items-center min-h-screen flex-col">
                <div className="flex mb-8">
                    <img width="50" className="mr-4" src={icone} alt="" />
                    <h1 className="text-4xl text-white font-bold text-center">CHEERSCOMPASS</h1>
                </div>

                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                    <form className="sign-up-form" onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Username"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="off"
                                placeholder="Email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="*******"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Sign Up
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Have an Account? <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;
