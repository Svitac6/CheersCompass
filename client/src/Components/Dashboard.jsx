import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Card from './Cards';
import Footer from './Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Initialize userData as null

  useEffect(() => {
    axios.get('http://localhost:3000/auth/verify')
      .then(res => {
        if (res.data.status) {
          // User is verified, do nothing or set some state if needed
        } else {
          navigate('/');
        }
        console.log(res);
      })
      .catch(error => {
        console.error("Error verifying user:", error);
        navigate('/');
      });
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
      .then(res => {
        if (res.data.status) {
          setUserData(res.data.data);
          console.log(res.data.data._id);
        } else {
          console.log(res.data.message);
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    if (userData && userData._id) { // Check if userData and _id are available
      axios.get(`http://localhost:3000/auth/favorites/${userData._id}`)
        .then(response => {
          if (response.status === 200 && response.data.status) {
            console.log('Favorites data:', response.data.data);
            setFavorites(response.data.data);
          } else {
            console.log("Error fetching favorites:", response.data.message);
          }
        })
        .catch(err => {
          console.error('Error fetching favorites:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // Set loading to false if userData is null or _id is not available
    }
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 relative w-full min-h-screen">
      <Navbar />
      {favorites.length > 0 ? (
        <div className="flex-grow lg:pl-32 lg:pr-32 lg:pt-20 lg:pb-20 pl-5 pr-5 pb-10 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {favorites.map((favorite) => (
              <div key={favorite.bar._id} className="">
                <Card
                  userId={userData ? userData._id : null}
                  barId={favorite.bar._id}
                  name={favorite.bar.name}
                  image={`http://localhost:3000/${favorite.bar.image}`}
                  rating={favorite.bar.rating}
                  tags={favorite.bar.types.map((tag) => tag.name)}
                  hours={`${favorite.bar.opening_hours} - ${favorite.bar.closing_hours}`}
                  address={favorite.bar.location}
                  description={favorite.bar.description}
                  numRating={favorite.bar.numRating}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No favorites found.</p>
      )}
       <Footer />
    </div>
  );
};

export default Dashboard;
