import React, { useState } from "react";
import '../App.css'
import Axios from 'axios'
import { Link, useNavigate, useParams } from "react-router-dom";
import videoBg from '../assets/test.mp4';
import icone from '../assets/icone.png'

const VerifyEmail = () => {

    const { token } = useParams()

    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/verify-email/' + token).then(response => {
            if (response.data.status) {
                navigate('/login')
            }
            console.log(response.data)
        }).catch(err => {
            console.log(err)
        })
    }



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
                        <h2 className="text-2xl font-semibold mb-6 text-center">The email has been verified :)</h2>
                        <p></p>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Ok ! bro
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );




}

export default VerifyEmail