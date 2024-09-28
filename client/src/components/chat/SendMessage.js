import React from 'react'

const SendMessage = ({ handleSubmit, text, setText }) => {
  return (
      <div className='flex flex-shrink-0 items-center bg-zinc-200 py-4 px-4 border-y border-y-zinc-300'>
          <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
          }} className='w-full flex-grow'>
              <input type="text" className='bg-white px-8 py-3 border-none outline-none w-full' value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter message' />
          </form>

      </div>
  )
}

export default SendMessage