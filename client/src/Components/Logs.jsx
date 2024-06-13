import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Logs = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userData, setUserData] = useState([]);
    const [password, setPassword] = useState('');

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

    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:3000/auth/deleteUser/${userId}`, {
            data: {
                password: password // Assuming you are sending the password to confirm the deletion
            }
        })
        .then(response => {
            if (response.data.status) {
                // After successful deletion, you might want to update the user data
                setUserData(userData.filter(user => user._id !== userId));
                console.log("User deleted successfully");
                toast.success("User deleted successfully"); // Displaying toast
            }
            console.log(response.data);
        })
        .catch(err => {
            console.log(err);
        });
    };
    

    if (!isLoggedIn || !isAdmin) {
        return "Erreur 401 - Unauthorized";
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <ToastContainer /> {/* Toast container */}
            {isAdmin && (
                <div className="container mx-auto py-8">
                    <h2 className="text-2xl font-bold mb-4">Users</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-800">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-800 px-4 py-2">User ID</th>
                                    <th className="border border-gray-800 px-4 py-2">Username</th>
                                    <th className="border border-gray-800 px-4 py-2">Email</th>
                                    <th className="border border-gray-800 px-4 py-2">Verified</th>
                                    <th className="border border-gray-800 px-4 py-2">Admin</th>
                                    <th className="border border-gray-800 px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map(user => (
                                    <tr key={user._id} className="text-gray-700">
                                        <td className="border border-gray-800 px-4 py-2">{user._id}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.username}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.email}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.isVerified ? 'Yes' : 'No'}</td>
                                        <td className="border border-gray-800 px-4 py-2">{user.isAdmin ? 'Yes' : 'No'}</td>
                                        <td className="border border-gray-800 px-4 py-2">
                                            <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logs;
