import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, off, remove } from 'firebase/database';
import { auth, database, textdb } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Web = (props) => {
    const [loading, setLoading] = useState(true); // Loading state
    const [message, setMessage] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userJoinTimestamp, setUserJoinTimestamp] = useState(null);
    const [newMessageReceived, setNewMessageReceived] = useState(false);
    const currentUser = auth.currentUser;
    const messagesEndRef = useRef(null);
    const { cityId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentUser) {
                    const userRole = await getUserRole(currentUser);
                    setUserRole(userRole);
                    const userDocRef = doc(collection(textdb, 'users'), currentUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setUserName(userData.name || '');
                        setUserJoinTimestamp(userData.joinTimestamp || null);
                    }

                    const chatRef = ref(database, cityId);
                    onValue(chatRef, (snapshot) => {
                        const messagesData = [];
                        snapshot.forEach((childSnapshot) => {
                            messagesData.push({ id: childSnapshot.key, ...childSnapshot.val() });
                        });

                        const filteredMessages = messagesData.filter(msg => !userJoinTimestamp || msg.timestamp >= userJoinTimestamp);
                        filteredMessages.sort((a, b) => b.timestamp - a.timestamp);
                        const newMessagesReceived = filteredMessages.length > messages.length;
                        if (newMessagesReceived) {
                            setNewMessageReceived(true);
                        }

                        setMessages(filteredMessages);
                        setLoading(false); // Data fetching complete, set loading to false
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                console.log('City ID:', cityId);
                setLoading(false); // Error occurred, set loading to false
            }
        };

        fetchData();

        // Cleanup function to remove Firebase listener
        return () => {
            off(ref(database, cityId));
        };
    }, [cityId, currentUser, userJoinTimestamp]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (newMessageReceived) {
            const latestMessage = messages[messages.length - 1];
            if (latestMessage && latestMessage.userId !== currentUser.uid) {
                if (Notification.permission === 'granted') {
                    new Notification('New Message Received');
                }
            }
            setNewMessageReceived(false);
        }
    }, [newMessageReceived, currentUser, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!currentUser) {
            toast.error('Unauthorized access. Please log in.');
            return;
        }

        try {
            const chatRef = ref(database, cityId);

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

            const isAdmin = userRole === 'admin' || msg.userId === 'admin';
            const isCurrentUser = msg.userId === currentUser.uid;

            if (isAdmin || isCurrentUser) {
                return (
                    <React.Fragment key={msg.id}>
                        {dateComponent}
                        <div
                            className="message"
                            style={{
                                alignSelf: (userRole === 'webdeveloper' && msg.userId === currentUser.uid) || (userRole === 'admin' && msg.userId === 'admin') ? 'flex-end' : 'flex-start',
                                backgroundColor: (userRole === 'webdeveloper' && msg.userId === currentUser.uid) || (userRole === 'admin' && msg.userId === 'admin') ? '#d1eaf4' : '#f3f3f3',
                            }}
                        >
                            <p>
                                <strong>{msg.userName}:</strong> {msg.message}
                                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </p>
                        </div>
                    </React.Fragment>
                );
            } else {
                return null;
            }
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

    const handleDeleteMessages = async () => {
        if (userRole === 'admin') {
            try {
                const chatRef = ref(database, cityId);
                await remove(chatRef);
                toast.success('All messages deleted successfully.');
            } catch (error) {
                console.error('Error deleting messages:', error);
                toast.error('Error deleting messages.');
            }
        }
    };

    if (userRole !== 'admin' && userRole !== 'webdeveloper') {
        return (
            <div className='unauthorise'>
                <img src='https://res.cloudinary.com/ddkyeuhk8/image/upload/v1709031154/io1bossm9eykl4mhzs3j.png' alt='img' />
                <h3>You are not authorized to access this page. </h3>
                <Link style={{ textDecoration: 'none' }} to="/"> <button >Home</button></Link>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="messages-container">
                        <h3>Welcome, {userName} ({userRole}) 

                        <>
                        {userRole === 'admin' && (
                        
                         <span style={{color:"rgb(148, 2, 2)" ,height:"40px" ,width:"150px" ,backgroundColor:"#007bff" , padding:"10px" ,borderRadius:"20px" ,cursor:"pointer"}} onClick={handleDeleteMessages}>Delete All Messages</span>
                        )}
                         </>
                         
                         </h3>
                        
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
                                <button className='inputbtn' onClick={sendMessage}><FaPaperPlane /></button>
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
                    {userRole === 'admin' && (
                        <div>
                            <button onClick={handleDeleteMessages}>Delete All Messages</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Web;
