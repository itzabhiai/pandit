import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { textdb, auth } from '../firebaseConfig'; // Assuming `auth` is your Firebase authentication service
import Load from '../Components/Loder/Load';

const ProtectedRoute = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                console.log('Fetching user role...');
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userDocRef = doc(textdb, 'users', currentUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    const userData = userDocSnapshot.data();
                    console.log('User data:', userData);
                    if (userData && userData.role === 'admin') {
                        setIsAdmin(true);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user role:', error);
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        console.log('User role:', isAdmin ? 'admin' : 'not admin');
    }, [isAdmin]);

    const user = auth.currentUser;
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (loading) {
        return <Load />;
    }

    if (!isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
