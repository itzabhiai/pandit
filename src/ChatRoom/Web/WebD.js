import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore'; // Import necessary Firebase functions for fetching data
import { textdb } from '../../firebaseConfig'; // Import Firebase configuration
import { FaMapLocation } from "react-icons/fa6";
import Load from '../../Components/Loder/Load';

const WebD = () => {
    const [userCities, setUserCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCities = async () => {
            try {
                const usersCollection = collection(textdb, 'users'); // Assuming 'users' is the collection name
                const usersSnapshot = await getDocs(usersCollection);
                const citiesSet = new Set(); // Use a Set to store unique city names

                usersSnapshot.forEach(userDoc => {
                    const userData = userDoc.data();
                    const userCity = userData.city;
                    if (userCity) {
                        citiesSet.add(userCity);
                    }
                });

                setUserCities(Array.from(citiesSet)); // Convert Set to array
                setLoading(false); // Set loading state to false after data is fetched
            } catch (error) {
                console.error('Error fetching user cities:', error);
            }
        };

        fetchUserCities();
    }, []);

    return (
        <div className='mainmlist'>
          
                    <div className='firstmlist'>
                        <h1>Available city</h1>
                        {loading ? (
                <div className="loading-indicator"><Load/></div>
            ) : (
                <>
                        {userCities.map((city, index) => (
                            <Link key={index} to={`/web/${city}`} style={{textDecoration:"none"}}>
                                <div className='message2'>
                                    <FaMapLocation className='messagicon' style={{marginLeft:"20px"}}/> ㅤ <p> <strong>{city}  </strong></p> </div>
                            </Link>
                        ))}
                            </>
            )}
                    </div>
                    <div className='secondmlist'>
                        <img src='https://res.cloudinary.com/ddkyeuhk8/image/upload/v1709887605/wbjwkaewms0ip9qa7nzh.png' alt='' />
                    </div>
            
        </div>
    );
};

export default WebD;
