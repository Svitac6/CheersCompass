import React, { useState } from "react";
import '../App.css'
import Axios from 'axios'
import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {

    const [password, setPassword] = useState('')
    const { token } = useParams()

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/reset-password/' + token, {
            password,
        }).then(response => {
            if (response.data.status) {
                navigate('/login')
            }
            console.log(response.data)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <form className="sign-up-form" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="*******"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                    >
                        Reset
                    </button>
                </form>
            </div>
        </div>

    )
}

export default ResetPassword