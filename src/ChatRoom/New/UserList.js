import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { textdb, auth } from "../../firebaseConfig";


const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(textdb, 'users'), where('hasNewMessage', '==', true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.hasNewMessage !== undefined) { // Check if the field is defined
          userList.push({ id: doc.id, ...userData });
        }
      });
      setUsers(userList);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  

  return (
    <div>
      <h2>Users with New Messages</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {/* Use Link component for navigation */}
            <Link to={`/chat/${user.id}`}>{user.displayName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
