import React, { useState } from "react";
import '../App.css'
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {

    const [email, setEmail] = useState('')

    const navigate = useNavigate()

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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
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

    )
}

export default ForgotPassword