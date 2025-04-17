import { useState, useRef, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import './index.scss'
import useWebSocket, { WebSocketMessage } from '../../hooks/useWebSocket'
import { useAddMessage, useMessages, useUpdateMessage } from '../../state/message/hooks'
import { Message } from '../../state/message/reducer'
import sleep from '../../utils/sleep'
import Input from './Input'
import ReactECharts from 'echarts-for-react'
import { nanoid } from '@reduxjs/toolkit'
import { createEcho, parseEcho } from '../../utils/echo'
import { WEB_SOCKET_URL } from '../../constants'

const renderer = new marked.Renderer()

renderer.link = function ({ href, title, text }) {
  const link = `<a class="break-words" href="${href}" target="_blank"${title ? ` title="${title}"` : ''}>${text}</a>`
  return link
}

marked.setOptions({
  renderer: renderer
})

const types: { name: string; id: Message['type'] }[] = [
  {
    name: 'Generate a tweet',
    id: 'create_tweets'
  },
  {
    name: 'Hot tweet interaction',
    id: 'public_opinions'
  },
  {
    name: 'Comment analysis',
    id: 'create_replies'
  }
] as const

const tipsMessages: {
  [K in Message['type']]: string
} = {
  create_tweets: 'Please @X handle, and a customized tweet will be generated for this X handle.',
  public_opinions:
    'Please enter the field you are interested in, such as trending crypto, entertainment, etc. We will find tweets worth real-time interaction based on your selected category.',
  create_replies:
    'You can enter the link of a published tweet to analyze the sentiment in the comment section, or enter a draft tweet to predict its sentiment.'
}

function Home() {
  const [currentType, setCurrentType] = useState<(typeof types)[number]>(types[0])
  const [isTyping, setIsTyping] = useState<{ [K in Message['type']]: boolean }>({
    create_tweets: false,
    public_opinions: false,
    create_replies: false
  })
  const [botTips, setBotTips] = useState<{ [K in Message['type']]: string }>({
    create_tweets: 'Analyzing the content characteristics of this X handle...',
    public_opinions: 'Searching for current trending events + related popular tweets...',
    create_replies: 'Retrieving comment section content and analyzing...'
  })

  const [messages] = useMessages(currentType.id)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const addMessage = useAddMessage()
  const updateMessage = useUpdateMessage()

  const createUserMessage = useCallback(
    (contents: Message['contents']): Message => {
      return {
        id: nanoid(),
        createAt: Date.now(),
        role: 'user',
        contents,
        type: currentType.id
      }
    },
    [currentType]
  )
  const createBotMessage = useCallback(
    (contents: Message['contents'], userMessageId?: string, msgType?: Message['type']): Message => {
      return {
        id: nanoid(),
        createAt: Date.now(),
        role: 'assistant',
        userMessageId,
        contents,
        type: msgType || currentType.id
      }
    },
    [currentType]
  )

  const onMessage = useCallback(
    async ({ content, status, type, echo }: WebSocketMessage) => {
      const [msgType, id] = parseEcho(echo)

      if (status === 'Error') {
        addMessage(createBotMessage([{ content: 'Data retrieval error.', type: 'md' }], id, msgType))
        setIsTyping(pre => ({ ...pre, [msgType]: false }))
        await sleep(50)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      const oldMessage = messages.find(item => {
        return item.userMessageId === id
      })

      if (oldMessage) {
        updateMessage(oldMessage.id, {
          contents: oldMessage?.contents.concat([{ content, type }])
        })
      } else if (['md', 'graphic_pie', 'graphic_line'].includes(type)) {
        addMessage(createBotMessage([{ content, type }], id, msgType))
      }

      if (['start'].includes(type)) {
        setIsTyping(pre => ({ ...pre, [msgType]: false }))
      }

      if (['thinking'].includes(type)) {
        setBotTips(pre => ({ ...pre, [msgType]: content }))
      }

      if (isTyping[msgType] && type === 'finish') {
        setIsTyping(pre => ({ ...pre, [msgType]: false }))
      }

      await sleep(50)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
    [addMessage, createBotMessage, isTyping, messages, updateMessage]
  )

  const { sendMessage } = useWebSocket(WEB_SOCKET_URL, onMessage)

  useEffect(() => {
    if (!messages.length) {
      addMessage(createBotMessage([{ content: tipsMessages[currentType.id], type: 'md' }]))
    }
  }, [addMessage, createBotMessage, currentType.id, messages])

  const handleSendMessage = async (value: string) => {
    const message = value.trim()

    if (!message || isTyping[currentType.id]) return

    const msg = createUserMessage([{ content: value, type: 'md' }])
    addMessage(msg)
    setIsTyping(pre => ({ ...pre, [currentType.id]: true }))

    await sleep(300)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

    sendMessage({
      action: currentType.id,
      payload: message,
      echo: createEcho(currentType.id, msg.id)
    })
  }

  const renderMessageContent = (msg: Message) => {
    const { role, contents } = msg

    if (role === 'assistant') {
      return (
        <div
          className='message-text'
          style={{
            width: contents.findIndex(item => ['graphic_pie', 'graphic_line'].includes(item.type)) > 0 ? '100%' : 'fit-content'
          }}>
          {contents.map(item => {
            if (item.type === 'md') {
              const html = marked.parse(item.content)

              return <div className='prose md:prose-lg' dangerouslySetInnerHTML={{ __html: html }} />
            }

            if (item.type === 'graphic_line') {
              return <ReactECharts option={JSON.parse(item.content)} style={{ height: 300, width: '100%' }} />
            }

            if (item.type === 'graphic_pie') {
              return <ReactECharts option={JSON.parse(item.content)} style={{ height: 260, width: '100%' }} />
            }

            return null
          })}
        </div>
      )
    }

    return <div className='message-text prose'>{contents[0].content}</div>
  }

  return (
    <div className='chat-container flex flex-col pb-[166px] pt-14 relative  overflow-y-auto'>
      <div className='h-14 absolute top-0 left-0 right-0 flex items-center justify-center font-medium'>{currentType.name}</div>

      <div className='chat-messages pb-6 relative flex flex-col-reverse' id='container'>
        {isTyping[currentType.id] && (
          <div className='message assistant'>
            <div className='message-avatar bot-avatar'>AI</div>
            <div className='message-content'>
              <div className='message-role'>AI</div>
              {renderMessageContent(createBotMessage([{ content: botTips[currentType.id], type: 'md' }]))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} id='messages-end' />
        <div>
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && <div className={`message-avatar ${msg.role}-avatar`}>{'AI'}</div>}
              <div className='message-content'>
                {msg.role === 'assistant' && <div className='message-role'>{'AI'}</div>}
                {renderMessageContent(msg)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white absolute bottom-0 left-0 right-0 pt-[10px]'>
        <div className='flex items-center pl-4 mb-[10px]'>
          {types.map(item => (
            <div
              key={item.id}
              className={`flex items-center h-7 last:mr-0 md:mr-4 mr-2 text-nowrap rounded-full border border-solid  md:px-[14px] px-2 cursor-pointer text-xs ${
                item.id === currentType.id
                  ? 'bg-[#DBEAFE] text-[#4D6BFE] border-[rgba(0,122,255,0.15)]'
                  : 'bg-white text-[#4c4c4c] border-[rgba(0,0,0,0.12)]'
              }`}
              onClick={() => {
                setCurrentType(item)
              }}>
              {item.name}
            </div>
          ))}
        </div>

        <Input isTyping={isTyping[currentType.id]} handleSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default Home
