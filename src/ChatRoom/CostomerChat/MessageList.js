import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { textdb, auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './MessageList.css'; 

import { BiMessageDetail } from "react-icons/bi";
import Load from '../../Components/Loder/Load';
import Dashboard from '../../Admin/Dashboard/Dashboard';

const MessageList = () => {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [clickedUsers, setClickedUsers] = useState([]);
    const [seenMessages, setSeenMessages] = useState(new Set());
    const [notifiedUsers, setNotifiedUsers] = useState(new Set());
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const chatRef = collection(textdb, 'chat2');
                const q = query(
                    chatRef,
                    where('userName', '!=', 'Admin'),
                );

                const newMessagesMap = {};

                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const messagesData = [];

                    querySnapshot.forEach((doc) => {
                        const data = { id: doc.id, ...doc.data() };
                        if (!clickedUsers.includes(data.userId)) {
                            if (!newMessagesMap[data.userId]) {
                                newMessagesMap[data.userId] = [];
                            }
                            newMessagesMap[data.userId].push(data);
                        }
                    });

                    const updatedMessages = Object.values(newMessagesMap).map(userMessages => {
                        userMessages.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
                        const latestMessage = userMessages[0];
                        const newMessage = !seenMessages.has(latestMessage.id) && !notifiedUsers.has(latestMessage.userId);
                        if (newMessage) {
                            setNotifiedUsers(prevNotifiedUsers => new Set(prevNotifiedUsers.add(latestMessage.userId)));
                        }
                        return { ...latestMessage, newMessage };
                    });

                    setMessages(updatedMessages);
                    setLoading(false);

                    // Save message count in local storage
                    localStorage.setItem('messageCount', JSON.stringify(updatedMessages.length));
                });

                return () => unsubscribe();
            }
        };

        fetchData();
    }, [currentUser, clickedUsers, seenMessages, notifiedUsers]);

    const handleUsernameClick = (userId, messageId) => {
        if (!clickedUsers.includes(userId)) {
            setClickedUsers(prevClickedUsers => [...prevClickedUsers, userId]);
            setSeenMessages(prevSeenMessages => new Set(prevSeenMessages.add(messageId)));
            navigate(`/cuchat/${userId}`);
        }
    };

    if (loading) {
        return <div><Load/></div>; 
    }

    return (
        <>
           
            <div className='mainmlist'>
                <div className='firstmlist'>
                    <h1>Messages Of Users</h1>
                    {messages.map(msg => (
                        <div onClick={() => handleUsernameClick(msg.userId, msg.id)}  className={`message2 ${msg.newMessage ? 'new-message' : ''}`} key={msg.id}>
                            <BiMessageDetail className='messagicon'/> ㅤ  <p onClick={() => handleUsernameClick(msg.userId, msg.id)}>
                                <strong>{msg.userName}</strong>: {msg.message.length > 20 ? `${msg.message.slice(0, 20)}...` : msg.message}
                                {msg.newMessage && !clickedUsers.includes(msg.userId) && (
                                    <span className="new-message-blink"></span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
                <div className='secondmlist'>
                    <img src='https://res.cloudinary.com/ddkyeuhk8/image/upload/v1709816927/cf1x5gg5k61zsjzzfrrg.png' alt='' />
                </div>
            </div>
        </>
    );
}

export default MessageList;
