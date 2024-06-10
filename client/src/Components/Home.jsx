import React, { useState } from "react";
import '../App.css'
import axios from 'axios'
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from './Navbar';

const Home = () =>{
    const navigate = useNavigate()
    
    return(
        <div className="Home">
            <Navbar />
        </div>
    )
}

export default Home