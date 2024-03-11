import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, doc, where, getDoc } from 'firebase/firestore';
import { textdb, auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import './Chat.css'; 

const Chat = () => {
    const [message, setMessage] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const currentUser = auth.currentUser;

    const getUserRole = async (user) => {
        if (user) {
            try {
                const userDocRef = doc(collection(textdb, 'users'), user.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    return userData.role || 'user';
                }
            } catch (error) {
                console.error('Error fetching user data from Firestore:', error);
            }
        }

        return 'user';
    };

    useEffect(() => {
        const chatRef = collection(textdb, 'chat');
        let q;
    
        const fetchData = async () => {
            if (currentUser) {
                const userRole = await getUserRole(currentUser);
    
                if (userRole === 'admin') {
                    q = query(chatRef);
                } else {
                    q = query(
                        chatRef,
                        where('userId', 'in', [currentUser.uid, 'admin'])
                    );
                }
    
                setUserName(currentUser.displayName || '');
                setUserRole(userRole);
            }
    
            if (q) {
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const messagesData = [];
                    querySnapshot.forEach((doc) => {
                        messagesData.push({ id: doc.id, ...doc.data() });
                    });
    
                    // Reverse the order of messages if user is admin
                    if (userRole === 'admin') {
                        setMessages(messagesData.reverse());
                    } else {
                        setMessages(messagesData);
                    }
                });
    
                return () => unsubscribe();
            }
        };
    
        fetchData();
    }, [currentUser]);
    

    const sendMessage = async () => {
        if (!currentUser) {
            toast.error('Unauthorized access. Please log in.');
            return;
        }

        try {
            const chatRef = collection(textdb, 'chat');
            
            if (userRole === 'admin') {
                await addDoc(chatRef, {
                    userId: 'admin',
                    message: adminMessage,
                    userName: 'Admin',
                    timestamp: new Date(),
                });
            } else {
                await addDoc(chatRef, {
                    userId: currentUser.uid,
                    message,
                    userName: userName,
                    timestamp: new Date(),
                });
            }

            setMessage('');
            setAdminMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error sending message');
        }
    };

    return (
        <div className="chat-container">
            <h3>Welcome, {userName} ({userRole})</h3>

            <div className="messages-container">
            <div className="messages-container">
    <div className="admin-messages">
        {messages
            .filter(msg => msg.userId === 'admin')
            .map(msg => (
                <div className="admin-message" key={msg.id}>
                    <p>
                        <strong>{msg.userName}</strong>: {msg.message}
                        <span className="timestamp">{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}</span>
                    </p>
                </div>
            ))}
    </div>
    <div className="user-messages">
        {messages
            .filter(msg => msg.userId !== 'admin')
            .map(msg => (
                <div className="user-message" key={msg.id}>
                    <p>
                        <strong>{msg.userName}</strong>: {msg.message}
                        <span className="timestamp">{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}</span>
                    </p>
                </div>
            ))}
    </div>
</div>

            </div>

            {userRole !== 'admin' && (
                <div className="input-container">
                    <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}

            {userRole === 'admin' && (
                <div className="input-container">
                    <input type='text' value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send as Admin</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
