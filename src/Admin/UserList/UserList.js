import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { textdb } from '../../firebaseConfig';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons for approve and deny buttons
import './UserList.css'; // Import custom CSS for styling
import Load from '../../Components/Loder/Load';

const UserList = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // State variable for loading indicator

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(textdb, 'users'));
                const userList = [];
                let hasNewUserRequests = false;
                querySnapshot.forEach((doc) => {
                    userList.push({ id: doc.id, ...doc.data() });
                    if (doc.data().requestedRole && isAdmin) {
                        hasNewUserRequests = true;
                    }
                });
                const sortedUsers = userList.sort((a, b) => {
                    if (a.requestedRole && !b.requestedRole) return -1;
                    if (!a.requestedRole && b.requestedRole) return 1;
                    return 0;
                });
                setUsers(sortedUsers);
                setLoading(false); // Set loading state to false when data is fetched
                if (hasNewUserRequests && Notification.permission === 'granted') {
                    new Notification('New User Requests');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const unsubscribe = onSnapshot(collection(textdb, 'users'), () => {
            fetchUsers();
        });

        return () => unsubscribe();
    }, [isAdmin]);

    useEffect(() => {
        // Check if the user is an admin
        // (You need to implement a method to check if the current user is an admin)
        setIsAdmin(true); // For demo purposes, assume the current user is an admin
    }, []);

    const handleSetRole = async (userId, role) => {
        try {
            const userDocRef = doc(textdb, 'users', userId);
            await updateDoc(userDocRef, {
                role: role,
                requestedRole: '',
            });
        } catch (error) {
            console.error('Error setting role:', error);
        }
    };

    const handleDenyRole = async (userId) => {
        try {
            const userDocRef = doc(textdb, 'users', userId);
            await updateDoc(userDocRef, {
                requestedRole: '',
            });
        } catch (error) {
            console.error('Error denying role:', error);
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            const userDocRef = doc(textdb, 'users', userId);
            await deleteDoc(userDocRef);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    return (
        <div className="user-list-container">
            {loading ? ( // Render loading indicator if loading state is true
                <div className="loading-indicator"><Load/></div>
            ) : (
                <div className="table-container">
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>City</th> {/* New column for city */}
                                <th>Requested Role</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.city}</td> {/* Display city */}
                                    <td>{user.requestedRole}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {isAdmin && user.requestedRole && (
                                            <>
                                                <button className="approve-btn" onClick={() => handleSetRole(user.id, user.requestedRole)}><FaCheck /> Approve</button>
                                                <button className="deny-btn" onClick={() => handleDenyRole(user.id)}><FaTimes /> Deny</button>
                                            </>
                                        )}
                                        <button className="remove-btn" onClick={() => handleRemoveUser(user.id)}>Remove User</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {children}
        </div>
    );
};

export default UserList;
