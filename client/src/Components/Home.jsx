import React from "react";
import '../App.css';
import Navbar from './Navbar';
import fut from '../assets/fut.jpg';
import { FaStar, FaRegHeart } from 'react-icons/fa';
import Card from './Cards';

const Home = () => {
    return (
        <div className="relative w-full h-screen bg-gray-100">
            <Navbar />
            
            <Card
                name="Bar Title"
                image={fut}
                rating={4.5}
                tags={['Tag 1', 'Tag 2', 'Tag 3']}
                hours="10 AM - 10 PM"
                address="1234 Main Street, City, Country"
                description="This is a description of the bar. It includes details about the ambiance..."
            />
        </div>
    );
}

export default Home;
