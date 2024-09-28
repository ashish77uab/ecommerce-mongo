import moment from 'moment'
import React from 'react'

const UserItem = ({ handleClickUser, user, userId, activeUsers }) => {
    console.log(activeUsers,'activeUsers')
    const isActive = activeUsers?.includes(user?._id)
    const hasUnread = user?.unreadMessages?.length>0
    const singleMessage = hasUnread ? user?.unreadMessages?.[0] : user?.latestReadMessage?.[0]
    return (
        <div onClick={() => handleClickUser(user)} className={`flex items-start gap-4 border-b border-b-zinc-300  px-4 py-3 cursor-pointer ${user?._id === userId ? 'bg-sky-500' : 'bg-white'} `}>
            <div className='w-12 h-12 shadow-lg rounded-full relative bg-gray-200'>
                <div className={`w-4 h-4 rounded-full absolute top-[-3px] right-[-6px] z-[2]   ${isActive && 'bg-green-500 border-2  border-white'}`}></div>
                <img className='object-cover w-full h-full rounded-full' src={user?.profileImage || "/images/user.png"} alt="" />
            </div>
            <div className='text-sm flex-grow'>
                <h6 className={`heading-6 leading-[1] ${user?._id === userId ? 'text-white ' : 'text-black'}`}>{user?.fullName}</h6>
                <div className='flex items-start gap-1  line-clamp-1'>
                    <p className={`opacity-80 flex-grow  leading-[1] mt-1 ${user?._id === userId ? 'text-white ' : 'text-black'}`}>{singleMessage?.text}</p>
                   {hasUnread && <p className={`opacity-80 w-4 h-4 rounded-full flex-center bg-green-500 flex-shrink-0  text-xs leading-[1] mt-1 ${user?._id === userId ? 'text-white ' : 'text-black'}`}>{user?.unreadMessages?.length}</p>}
                    <p className={`opacity-80 flex-shrink-0  text-xs leading-[1] mt-1 ${user?._id === userId ? 'text-white ' : 'text-black'}`}>{moment(singleMessage?.createdAt)?.format('hh:mm a')}</p>
                </div>
            </div>

        </div>
    )
}

export default UserItem