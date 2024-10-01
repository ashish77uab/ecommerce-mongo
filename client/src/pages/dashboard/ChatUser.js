import React, { useEffect, useRef, useState } from 'react'
import { getAllUsersList, socketConnect, getAllUserMessagesList } from '../../api/api';
import { toast } from 'react-toastify';
import ToastMsg from '../../components/toast/ToastMsg';
import { getUserToken } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import ChatComponent from '../../components/chat/ChatComponent';
import { setUsersToChat } from '../../redux/features/authSlice';
const ChatUser = () => {
    const [text, setText] = useState('')
    const dispatch = useDispatch()
    const { user, usersToChat } = useSelector(state => state?.auth)
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
    const token = getUserToken()
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
                dispatch(setUsersToChat(data));
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
    const updateUnReadMessage=(data)=>{
        const tempUserId = data?.sender
        let tempIndex;
        const temparr = usersToChat?.users?.map((item, index) => {
            if (item?._id === tempUserId) {
                tempIndex = index
                return { ...item, unreadMessages: [data, ...item.unreadMessages] }
            } else {
                return item
            }
        })
        if (tempIndex) {
            let tempElemt = temparr[tempIndex]
            temparr?.splice(tempIndex, 1)
            temparr?.splice(0, 0, tempElemt)

        }
        let tempData = { ...usersToChat, users: temparr }
        dispatch(setUsersToChat(tempData));
    }
    useEffect(() => {
        if (!socketRef.current && token) {
            socketRef.current = socketConnect('chat', token);
        }

        const handleUserMessage = (data) => {
            if (userId) {
                if (userId === data.sender) {
                    setMessages((prev) => [...prev, data]);
                } else {
                    updateUnReadMessage(data);
                }
            } else {
                updateUnReadMessage(data);
            }
        };

        const handleActiveUsers = (activeUsers) => {
            setActiveUsers(activeUsers);
        };

        socketRef.current.on('adminMessage', handleUserMessage);
        socketRef.current.on('activeUsers', handleActiveUsers);
        return () => {
            if (socketRef.current) {
                socketRef.current?.off('adminMessage', handleUserMessage);
                socketRef.current?.off('activeUsers', handleActiveUsers);
                socketRef.current?.disconnect(); // Disconnect socket when component unmounts
                socketRef.current = null; // Clear socket reference
            }
        };

    }, [ token, usersToChat]);
  
    const handleClickUser = (user) => {
        setUserId(user._id);
        getAllUserMessages(user._id)
        setSelectedUser(user)
        const tempUserId = user._id
        const temparr = usersToChat?.users?.map((item, index) => {
            if (item?._id === tempUserId) {
                return { ...item, unreadMessages: [] }
            } else {
                return item
            }
        })
        let tempData = { ...usersToChat, users: temparr }
        dispatch(setUsersToChat(tempData));
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <ChatComponent
            users={usersToChat?.users}
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