import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Importe Link de react-router-dom

const BarDetail = () => {
    const { barId } = useParams(); // Récupère barId depuis les paramètres de l'URL
    const [bar, setBar] = useState(null);

    // Utilisation de useEffect pour charger les détails du bar lors du montage du composant
    useEffect(() => {
        const fetchBar = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/auth/bars/${barId}`);
                if (response.data.status) {
                    setBar(response.data.data);
                } else {
                    console.error('Bar not found:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching bar:', error);
            }
        };

        fetchBar(); // Appel de la fonction pour charger les détails du bar
    }, [barId]); // Déclenche useEffect à chaque changement de barId

    if (!bar) {
        return <div>Loading...</div>; // Affichage pendant le chargement des données
    }

    return (
        <div className="mx-auto max-w-2xl p-4">
            {/* Bouton de retour */}
            <Link to="/" className="block mb-4 text-gray-700 hover:text-gray-500">
                {/* Utilisation d'une flèche de retour (peut être un autre style selon vos préférences) */}
                <svg className="w-4 h-4 inline-block mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Retour
            </Link>

            {/* Détails du bar */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{bar.name}</h1>
                <img src={`http://localhost:3000/${bar.image}`} alt={bar.name} className="rounded-lg mb-4" />
                <p className="text-gray-700 mb-2">Description: {bar.description}</p>
                <p className="text-gray-700 mb-2">Address: {bar.location}</p>
                <div className="flex items-center mb-2">
                    <p className="text-gray-700 mr-2">{bar.rating}</p>
                    {/* Icônes d'étoiles pour le rating */}
                    <div className="flex">
                        {[...Array(5)].map((_, index) => (
                            <svg key={index} className={`w-4 h-4 fill-current ${index < bar.rating ? 'text-yellow-500' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M10 1l2.6 6.6L18 7l-5 4.3L15.4 19 10 15.3 4.6 19l1.4-7.7L2 7l5.4.6L10 1z" />
                            </svg>
                        ))}
                    </div>
                </div>
                <p className="text-gray-700 mb-2">{bar.numRating} ratings</p>
                <div className="flex flex-wrap">
                    {/* Affichage des tags */}
                    {bar.types.map((tag, index) => (
                        <span key={index} className="mr-2 mb-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{tag}</span>
                    ))}
                </div>
                <p className="text-gray-700 mt-4">{`${bar.opening_hours} - ${bar.closing_hours}`}</p>
            </div>
        </div>
    );
};

export default BarDetail;
