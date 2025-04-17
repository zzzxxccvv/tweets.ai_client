import { createSlice, nanoid } from '@reduxjs/toolkit'

export interface Message {
  id: string
  createAt: number
  role: 'assistant' | 'user'
  content: string
  type: 'create_tweets' | 'public_opinions' | 'create_replies'
  textType: 'md' | 'graphic_pie' | 'graphic_line' | 'start' | 'finish' | 'thinking' | 'error'
}

export interface MessageState {
  messages: Message[]
}

const initialState: MessageState = {
  messages: [
    {
      id: nanoid(),
      createAt: Date.now(),
      role: 'assistant',
      content: '请@X号,将为这个X号生成定制化推文。',
      type: 'create_tweets',
      textType: 'md'
    }
  ]
}

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage(state, { payload: { message } }) {
      state.messages = [...state.messages.filter(item => item.id !== message.id), message]
    },
    removeMessage(state, { payload: { id } }) {
      state.messages = state.messages.filter(item => {
        return item.id !== id
      })
    }
  }
})

export const { addMessage, removeMessage } = messageSlice.actions
export default messageSlice.reducer
