import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { auth ,database,textdb} from '../../firebaseConfig';
import { toast } from 'react-toastify';
import "./Chatapp.css"
import { collection, doc,  getDoc } from 'firebase/firestore';
const ChatApp = () => {
    const [message, setMessage] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const currentUser = auth.currentUser;
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const userRole = await getUserRole(currentUser);
                setUserName(currentUser.displayName || '');
                setUserRole(userRole);
            }
        };

        fetchData();
    }, [currentUser]);

    useEffect(() => {
        const chatRef = ref(database, 'chat1');
        let q;

        const fetchData = async () => {
            if (currentUser) {
                const userRole = await getUserRole(currentUser);

                if (userRole === 'admin') {
                    q = chatRef;
                } else {
                    q = chatRef;
                }

                setUserRole(userRole);
            }

            if (q) {
                onValue(q, (snapshot) => {
                    const messagesData = [];
                    snapshot.forEach((childSnapshot) => {
                        messagesData.push({ id: childSnapshot.key, ...childSnapshot.val() });
                    });

                    // Sort messages by timestamp in descending order
                    messagesData.sort((a, b) => b.timestamp - a.timestamp);

                    setMessages(messagesData);
                });
            }
        };

        fetchData();
    }, [currentUser]);

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
            const chatRef = ref(database, 'chat1');

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
                            alignSelf: userRole === 'admin' ? (msg.userName === 'Admin' ? 'flex-end' : 'flex-start') : (msg.userName === 'Admin' ? 'flex-start' : 'flex-end'),
                            backgroundColor: userRole === 'admin' ? (msg.userName === 'Admin' ? '#d1eaf4' : '#f3f3f3') : (msg.userName === 'Admin' ? '#f3f3f3' : '#d1eaf4')
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
    return (
        <div className="chat-container">
            <h3>Welcome, {userName} ({userRole})</h3>

            <div className="messages-container">
                {renderMessagesWithDate()}
                <div ref={messagesEndRef} />
            </div>

            {userRole !== 'admin' && (
                <div className="input-container">
                    <textarea
    className='i'
    style={{ resize: 'none', overflowX: 'hidden' }}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    rows={1} 
    onInput={(e) => { e.target.style.height = ''; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
/>

                    
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}

            {userRole === 'admin' && (
                <div className="input-container">
                     <textarea
    className='i'
    style={{ resize: 'none', overflowX: 'hidden' }}
    value={adminMessage}
    onChange={(e) => setMessage(e.target.value)}
    rows={1} 
    onInput={(e) => { e.target.style.height = ''; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
/>
                   
                    <button onClick={sendMessage}>Send as Admin</button>
                </div>
            )}
        </div>
    );
};

export default ChatApp;
