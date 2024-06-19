import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const Card = ({ userId, barId, name, image, rating, tags, hours, address, description, numRating }) => {
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/auth/is_liked/${barId}?userId=${userId}`);
                if (response.data.status && response.data.isLiked) {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        };

        if (userId) {
            checkIfLiked();
        }
    }, [userId, barId]);

    const handleLike = async () => {
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const endpoint = isLiked ? `http://localhost:3000/auth/unlike_bar/${barId}` : `http://localhost:3000/auth/like_bar/${barId}`;
            const method = isLiked ? 'delete' : 'post';
            const response = await axios({
                method,
                url: endpoint,
                data: { userId }
            });

            if (response.status === 200) {
                setIsLiked(!isLiked);
            } else {
                console.error('Failed to toggle like');
            }

        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Fonction pour générer les étoiles du rating
    const renderStars = () => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const starElements = [];

        for (let i = 0; i < fullStars; i++) {
            starElements.push(<BsStarFill key={`full-star-${i}`} className="text-yellow-400" />);
        }

        if (halfStar) {
            starElements.push(<BsStarHalf key={`half-star`} className="text-yellow-400" />);
        }

        const remainingStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < remainingStars; i++) {
            starElements.push(<BsStar key={`empty-star-${i}`} className="text-gray-300" />);
        }

        return starElements;
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105">
            <img src={image} alt={name} className="w-full h-48 object-cover object-center" />
            <div className="p-4">
                <div className="flex items-center mb-2">
                    <div className="flex space-x-1 text-yellow-400">{renderStars()}</div>
                    <div className="text-sm text-gray-600 ml-2">{numRating} note(s)</div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{name}</h2>
                <p className="text-gray-600 mb-2">{description}</p>
                <p className="text-gray-600 mb-2">{hours}</p>
                <p className="text-gray-600 mb-2">{address}</p>
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="text-sm bg-gray-200 py-1 px-2 rounded-lg">{tag}</span>
                        ))}
                    </div>
                    <button onClick={handleLike} className="text-red-500">
                        <FaHeart className={`text-xl cursor-pointer ${isLiked ? 'text-red-500' : 'text-gray-500'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
