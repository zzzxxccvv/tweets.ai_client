import { createSlice, nanoid } from '@reduxjs/toolkit'

export interface Message {
  id: string
  userMessageId?: string
  createAt: number
  role: 'assistant' | 'user'
  contents: {
    type: 'md' | 'graphic_pie' | 'graphic_line' | 'start' | 'finish' | 'thinking' | 'error' | 'list'
    content: string
    id: string
  }[]
  type: 'create_tweets' | 'public_opinions' | 'create_replies'
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
      contents: [
        {
          content: 'Please @X handle, and a customized tweet will be generated for this X handle.',
          type: 'md',
          id: nanoid()
        }
      ],
      type: 'create_tweets'
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
    updateMessage(state, { payload: { id, message } }) {
      const oldMessage = state.messages.find(item => item.id === id)

      if (oldMessage) {
        state.messages = [
          ...state.messages.filter(item => {
            return item.id !== id
          }),
          { ...oldMessage, ...message }
        ]
      }
    },
    removeMessage(state, { payload: { id } }) {
      state.messages = state.messages.filter(item => {
        return item.id !== id
      })
    }
  }
})

export const { addMessage, removeMessage, updateMessage } = messageSlice.actions
export default messageSlice.reducer
