import React, { useState } from "react";
import '../App.css'
import Axios from 'axios'
import { Link, useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {

    const {token} = useParams()

    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/verify-email/'+token).then(response => {
            if (response.data.status) {
                navigate('/login')
            }
            console.log(response.data)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="sign-up-container">

            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Verify email</h2>
                <button type="submit">ok</button>

            </form>
        </div>
    )
}

export default VerifyEmail