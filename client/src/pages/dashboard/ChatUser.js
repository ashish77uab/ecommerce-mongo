import React, { useEffect, useRef, useState } from 'react'
import { getAllUsersList, socketConnect, getAllUserMessagesList } from '../../api/api';
import { toast } from 'react-toastify';
import ToastMsg from '../../components/toast/ToastMsg';
import { getUserToken } from '../../utils/constants';
import { useSelector } from 'react-redux';
import moment from 'moment';
import UserItem from '../../components/chat/UserItem';
import SingleMessageItem from '../../components/chat/SingleMessageItem';
import SendMessage from '../../components/chat/SendMessage';
import ChatComponent from '../../components/chat/ChatComponent';

const ChatUser = () => {
    const [text, setText] = useState('')
    const { user } = useSelector(state => state?.auth)
    const limit = 10
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
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
        const messageData = { text: text, userId };
        socketRef.current?.emit('adminMessage', messageData);
        setMessages((prev) => [
            ...prev,
            { sender: user._id, recipient: userId, text, createdAt: new Date() },
        ]);
        setText(''); // Clear input
    };
    const getAllUsers = async () => {
        setFetchLoading(true)
        try {
            const res = await getAllUsersList({ limit, page });
            const { status, data } = res;
            if (status >= 200 && status <= 300) {
                setUsers(data);
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
        getAllUsers();
    }, [page]);
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current?.on('adminMessage', (data) => {
                setMessages(prev => [...prev, data])
            });
            socketRef.current.on('activeUsers', (activeUsers) => {
                setActiveUsers(activeUsers)
            });


        }

    }, [])
    const handleClickUser = (user) => {
        setUserId(user._id);
        getAllUserMessages(user._id)
        setSelectedUser(user)
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <ChatComponent
            users={users}
            selectedUser={selectedUser}
            handleSubmit={handleSubmit}
            handleClickUser={handleClickUser}
            text={text}
            setText={setText}
            ref={messagesEndRef}
            activeUsers={activeUsers}
            userId={userId}
            messages={messages}
            user={user}


        />
    )
}

export default ChatUser