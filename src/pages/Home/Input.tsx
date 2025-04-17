import { useState } from 'react'

export default function Input({ isTyping, handleSendMessage }: { isTyping: boolean; handleSendMessage: (value: string) => void }) {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className='chat-input-area flex flex-col'>
      <textarea
        className='chat-input flex-1'
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(inputValue)
            setInputValue('')
          }
        }}
        placeholder='Enter message...'
      />
      <div className='flex justify-end'>
      <button
        className='flex items-center justify-center w-8 h-8 rounded-full bg-[#4d6bfe] cursor-pointer disabled:cursor-not-allowed disabled:bg-[rgb(214,222,232)]'
        onClick={() => {
          handleSendMessage(inputValue)
          setInputValue('')
        }}
        disabled={!inputValue.trim() || isTyping}>
        <svg width='14' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            fill-rule='evenodd'
            clipRule='evenodd'
            d='M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z'
            fill='#fff'></path>
          <path
            fill-rule='evenodd'
            clipRule='evenodd'
            d='M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z'
            fill='#fff'></path>
          <path
            fill-rule='evenodd'
            clipRule='evenodd'
            d='M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z'
            fill='#fff'></path>
        </svg>
      </button>
      </div>
    </div>
  )
}
