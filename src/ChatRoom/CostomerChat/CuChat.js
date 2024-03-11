import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, query, doc, where, getDoc } from 'firebase/firestore';
import { textdb, auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './CuChat.css'; // Import the CSS file
import { FaPaperPlane } from 'react-icons/fa';

const CuChat = () => {
    const [message, setMessage] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [serviceTitleSent, setServiceTitleSent] = useState(false); // Track whether service title is sent
    const currentUser = auth.currentUser;
    const navigate = useNavigate();
    const { userId } = useParams();
    const location = useLocation();
    const messagesEndRef = useRef(null);

    const getServiceTitleFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        const title = searchParams.get('title');
        return typeof title === 'string' ? decodeURIComponent(title) : ''; // Decode URI component and ensure it's a string
    };

    const serviceTitle = getServiceTitleFromQuery();

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
        const fetchData = async () => {
            if (userId) {
                const chatRef = collection(textdb, 'chat2');
                const q = query(
                    chatRef,
                    where('userId', '==', userId)
                );

                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const messagesData = [];
                    querySnapshot.forEach((doc) => {
                        messagesData.push({ id: doc.id, ...doc.data() });
                    });

                    // Sort messages by timestamp before setting state
                    messagesData.sort((a, b) => a.timestamp - b.timestamp);

                    setMessages(messagesData);
                });

                return () => unsubscribe();
            }
        };

        fetchData();
    }, [userId]);

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
            const chatRef = collection(textdb, 'chat2');
            const timestamp = new Date();

            let finalMessage = message;

            if (serviceTitle && !serviceTitleSent) {
                finalMessage = `${serviceTitle}: ${message}`;
                setServiceTitleSent(true);
            }

            if (userRole === 'admin') {
                await addDoc(chatRef, {
                    userId,
                    message: adminMessage,
                    userName: 'Admin',
                    timestamp,
                });
            } else {
                await addDoc(chatRef, {
                    userId: currentUser.uid,
                    message: finalMessage,
                    userName,
                    timestamp,
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
        return messages.map((msg, index) => {
            const messageDate = new Date(msg.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            });
            const previousMessageDate = index > 0 ? new Date(messages[index - 1].timestamp.seconds * 1000).toLocaleDateString('en-US', {
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
                            <strong>{msg.userName}</strong>: {msg.message} <br/>
                            <span className="timestamp">{new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}</span>
                        </p>
                    </div>
                </React.Fragment>
            );
        });
    };

    return (
        <div className="chat-container">
        {/* <h3>Welcome, {userName} ({userRole})</h3> */}
      

        <div className="messages-container">
        <h3>Welcome, {userName} ({userRole})</h3>

            {renderMessagesWithDate()}
            <div ref={messagesEndRef} />
        </div>
        {serviceTitle && !serviceTitleSent && (
<div  className="service-title">
    <p ><strong></strong> {serviceTitle}</p>
</div>
)}
        <div className='main-input'> 
        <div className="input-container">
            <textarea
                className='inputtext'
                style={{ resize: 'none', overflowX: 'hidden' }}
                value={userRole === 'admin' ? adminMessage : message}
                onChange={(e) => userRole === 'admin' ? setAdminMessage(e.target.value) : setMessage(e.target.value)}
                rows={1} // Set initial number of rows
                onInput={(e) => { e.target.style.height = ''; e.target.style.height = (e.target.scrollHeight) + 'px'; }}
            />
            <button className='inputbtn' onClick={sendMessage}><FaPaperPlane /></button>
        </div>
        </div>
    </div>
    );
};

export default CuChat;
