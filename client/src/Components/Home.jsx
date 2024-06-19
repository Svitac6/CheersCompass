import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Card from './Cards'; // Adjusted import path
import Footer from './Footer';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [bars, setBars] = useState([]);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setUserData(res.data.data);
                } else {
                    console.log(res.data.message);
                    navigate('/');
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                navigate('/');
            });
    }, [navigate]);

    const fetchBars = () => {
        axios.get('http://localhost:3000/auth/bars')
            .then(res => {
                if (res.data.status) {
                    setBars(res.data.data);
                } else {
                    console.error(res.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching bars:', error);
            });
    };

    //console.log(userData._id );
    useEffect(() => {
        fetchBars();
    }, []);
    
    
    return (
        <div className="relative w-full min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <div className="flex-grow lg:pl-32 lg:pr-32 lg:pt-20 lg:pb-20 pl-5 pr-5 pb-10 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                  
                    {bars.map((bar) => (
                        <div key={bar._id} className="">
                            <Card
                                userId={userData ? userData._id : null}
                                barId={bar._id}
                                name={bar.name}
                                image={`http://localhost:3000/${bar.image}`}
                                rating={bar.rating}
                                tags={bar.types.map((tag) => tag.name)}
                                hours={`${bar.opening_hours} - ${bar.closing_hours}`}
                                address={bar.location}
                                description={bar.description}
                                numRating={bar.numRating}
                                
                            />
                            
                        </div>
                    ))}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default Home;
