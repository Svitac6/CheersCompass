import React, { useState } from "react";
import '../App.css'
import axios from 'axios'
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

const Home = () =>{
    const navigate = useNavigate()
    axios.defaults.withCredentials=true;
    const handleLogout  = () =>{
        axios.get('http://localhost:3000/auth/logout')
        .then(res=>{
            if(res.data.status)
                navigate('/login')
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="Home">
            <h2>Home</h2>
            <button ><Link to="/dashboard" > Dashboard</Link></button>
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}

export default Home