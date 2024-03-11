import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue ,off} from 'firebase/database';
import { auth, database, textdb } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';

import { collection, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Printing = () => {
    const [message, setMessage] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userJoinTimestamp, setUserJoinTimestamp] = useState(null); // New state to hold user's join timestamp
    const currentUser = auth.currentUser;
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const userRole = await getUserRole(currentUser);
                setUserName(currentUser.displayName || '');
                setUserRole(userRole);

                // Check if the user is authorized to access this page
                if (userRole !== 'admin' && userRole !== 'printing') {
                    console.log('You are not authorized to access this page.'); // Example: Log message
                    return; // Stop further execution
                }

                // Fetch user's join timestamp if user is not an admin
                if (userRole !== 'admin') {
                    const userDocRef = doc(collection(textdb, 'users'), currentUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setUserJoinTimestamp(userData.joinTimestamp || null);
                    }
                }
            }
        };

        fetchData();
    }, [currentUser]);

    useEffect(() => {
        const chatRef = ref(database, 'printing');

        const fetchData = () => {
            onValue(chatRef, (snapshot) => {
                const messagesData = [];
                snapshot.forEach((childSnapshot) => {
                    messagesData.push({ id: childSnapshot.key, ...childSnapshot.val() });
                });

                // Filter messages based on user's join timestamp
                const filteredMessages = messagesData.filter(msg => !userJoinTimestamp || msg.timestamp >= userJoinTimestamp);

                // Sort messages by timestamp in descending order
                filteredMessages.sort((a, b) => b.timestamp - a.timestamp);

                setMessages(filteredMessages);
            });
        };

        fetchData();

        // Clean up listener on unmount
        return () => {
            off(chatRef);
        };
    }, [userJoinTimestamp]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!currentUser) {
            toast.error('Unauthorized access. Please log in.');
            return;
        }

        try {
            const chatRef = ref(database, 'printing');

            if (userRole === 'admin') {
                await push(chatRef, {
                    userId: 'admin',
                    message: adminMessage,
                    userName: 'Admin',
                    timestamp: Date.now(),
                });
            } else {
                await push(chatRef, {
                    userId: currentUser.uid,
                    message: message,
                    userName: userName,
                    timestamp: Date.now(),
                });
            }

            setMessage('');
            setAdminMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error sending message');
        }
    };

    const renderMessagesWithDate = () => {
        let currentDate = null;
        // Reverse the order of messages
        const reversedMessages = [...messages].reverse();
        
        return reversedMessages.map((msg, index) => {
            const messageDate = new Date(msg.timestamp).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            });
            const previousMessageDate = index > 0 ? new Date(reversedMessages[index - 1].timestamp).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            }) : null;
    
            const showDate = messageDate !== previousMessageDate && messageDate !== currentDate;
            currentDate = messageDate;
    
            const dateComponent = showDate ? <div className="message-date">{messageDate}</div> : null;
    
            return (
                <React.Fragment key={msg.id}>
                    {dateComponent}
                    <div
                        className="message"
                        style={{
                            alignSelf: (userRole === 'printing' && msg.userId === currentUser.uid) || (userRole === 'admin' && msg.userId === 'admin') ? 'flex-end' : 'flex-start',
                            backgroundColor: (userRole === 'printing' && msg.userId === currentUser.uid) || (userRole === 'admin' && msg.userId === 'admin') ? '#d1eaf4' : '#f3f3f3',
                        }}
                        
                    >
                        <p>
                            <strong>{msg.userName}</strong>: {msg.message}
                            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </p>
                    </div>
                </React.Fragment>
            );
        });
    };
    
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
    
    // Render the component only if the user is authorized
    if (userRole !== 'admin' && userRole !== 'printing') {
        return <div className='unauthorise'> 
        <img src='https://res.cloudinary.com/ddkyeuhk8/image/upload/v1709031154/io1bossm9eykl4mhzs3j.png' alt='img' />
        <h3>You are not authorized to access this page. </h3>
        <Link style={{textDecoration:'none'}} to="/"> <button >Home</button></Link>
        </div>;
    }

    return (
        <div className="chat-container">
            <h3>Welcome, {userName} ({userRole})</h3>

            <div className="messages-container">
                {renderMessagesWithDate()}
                <div ref={messagesEndRef} />
            </div>
            <div className='main-input'>
            {userRole !== 'admin' && (
                <div className="input-container">
                    <textarea
                        className='inputtext'
                        style={{ resize: 'none', overflowX: 'hidden' }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={1} 
                        onInput={(e) => { e.target.style.height = ''; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
                    />

                    <button className='inputbtn' onClick={sendMessage}>Send</button>
                </div>
            )}

            {userRole === 'admin' && (
                <div className="input-container">
                    <textarea
                        className='inputtext'
                        style={{ resize: 'none', overflowX: 'hidden' }}
                        value={adminMessage}
                        onChange={(e) => setAdminMessage(e.target.value)}
                        rows={1} 
                        onInput={(e) => { e.target.style.height = ''; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
                    />
                    <button className='inputbtn' onClick={sendMessage}><FaPaperPlane /></button>
                </div>
            )}

        </div>
        </div>
    );
};

export default Printing;
