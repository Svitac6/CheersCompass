import React, { useState } from "react";
import '../App.css'
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    Axios.defaults.withCredentials =true;
    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('http://localhost:3000/auth/login', {
            email,
            password
        }).then(reponse => {
            if (reponse.data.status) {
                navigate('/')
            }

        }).catch(err => {
            console.log(err)
        })
    }

    return (

        <div className="sign-up-container">

            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Login</h2>


                <label htmlFor="email">Email:</label>
                <input type="email" id="email"  autoComplete="off" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="password">Password: </label>
                <input type="password" id="password" placeholder="*******" onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Login</button>
                <Link to="/forgotPassword">Forgot Password?</Link>
                <p>Don't have Account ? <Link to="/signup">Sign up</Link></p> 
                

            </form>
        </div>
    )
}

export default Login;