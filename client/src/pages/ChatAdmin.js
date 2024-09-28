import React, { useEffect, useRef, useState } from 'react'
import { getUserToken } from '../utils/constants';
import { getAllAdminList, getAllUserMessagesList, socketConnect } from '../api/api';
import ToastMsg from '../components/toast/ToastMsg';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import moment from 'moment';
import UserItem from '../components/chat/UserItem';
import SingleMessageItem from '../components/chat/SingleMessageItem';
import SendMessage from '../components/chat/SendMessage';
import ChatComponent from '../components/chat/ChatComponent';


const ChatAdmin = () => {
    const [text, setText] = useState('')
    const { user } = useSelector(state => state?.auth)
    const limit = 10
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [messageLoading, setMessageLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef()
    const messagesEndRef = useRef(null);
    const [activeUsers, setActiveUsers] = useState([]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };
    if (!socketRef.current) {
        socketRef.current = socketConnect('chat', getUserToken());
    }
    const handleSubmit = () => {
        const messageData = { text: text, adminId: userId };
        socketRef.current?.emit('userMessage', messageData);
        setMessages((prev) => [
            ...prev,
            { sender: user._id, recipient: userId, text, createdAt: new Date() },
        ]);
        setText(''); // Clear input
    }

    const getAllAdmin = async () => {
        setFetchLoading(true)
        try {
            const res = await getAllAdminList();
            const { status, data } = res;
            if (status >= 200 && status <= 300) {
                setUsers(data);
                // setUserId(data?.[0]?._id)
                // setSelectedUser(data?.[0])
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        } finally {
            setFetchLoading(false)
        }
    };
    const getAllUserMessages = async (userId) => {
        setMessageLoading(true)
        try {
            const res = await getAllUserMessagesList(userId, user?._id);
            const { status, data } = res;
            if (status >= 200 && status <= 300) {
                setMessages(data);
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        } finally {
            setMessageLoading(false)
        }
    };
    useEffect(() => {
        getAllAdmin();
    }, [page]);
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current?.on('userMessage', (data) => {
                setMessages(prev => [...prev, data])
            });
            socketRef.current.on('activeUsers', (activeUsers) => {
                console.log('Active users:', activeUsers);
                setActiveUsers(activeUsers)
                // Update the UI to reflect the active users
            });
        }

    }, [])
    useEffect(() => {
        if (userId && user?._id) {
            getAllUserMessages(userId)
        }

    }, [userId])
    const handleClickUser = (user) => {
        setUserId(user._id);
        getAllUserMessages(user._id)
        setSelectedUser(user)
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <>
            <ChatComponent
                users={users}
                selectedUser={selectedUser}
                handleSubmit={handleSubmit}
                handleClickUser={handleClickUser}
                text={text}
                setText={setText}
                ref={messagesEndRef}
                activeUsers={activeUsers}
                 userId={ userId}
                 messages={ messages}
                 user={ user}
                

            />
        </>
    )
}

export default ChatAdmin