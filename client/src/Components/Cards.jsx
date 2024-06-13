import React from 'react';
import PropTypes from 'prop-types';
import { FaRegHeart, FaStar } from 'react-icons/fa';

const Card = ({ name, image, rating, tags, hours, address, description }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row m-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center p-4 md:w-1/2">
                <h1 className="text-2xl font-bold mb-2">{name}</h1>
                <img src={image} alt={name} className="rounded-md max-w-full h-auto" style={{ maxWidth: '80%' }} />
            </div>

            <div className="flex flex-col p-4 md:w-1/2 relative">
                <div className="absolute top-4 right-4">
                    <FaRegHeart className="text-pink-500 text-2xl" />
                </div>
                <div className="flex flex-wrap space-x-2 mb-4">
                    {tags.map((tag, index) => (
                        <div key={index} className="bg-yellow-500 text-white text-xs font-semibold inline-block py-1 px-2 rounded-full uppercase">
                            {tag}
                        </div>
                    ))}
                </div>

                <div className="flex items-center mb-4">
                    <FaStar className="text-yellow-500 text-lg mr-2" />
                    <span className="text-gray-600 text-lg">{rating}</span>
                    <span className="text-gray-600 ml-4">Hours: {hours}</span>
                </div>

                <div className="flex flex-col mb-4">
                    <div>
                        <h1 className="text-xl font-semibold">Address</h1>
                        <p className="text-gray-600">{address}</p>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">Description</h1>
                        <p className="text-gray-700">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    hours: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default Card;
