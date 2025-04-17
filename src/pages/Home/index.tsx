import { useState, useRef, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import './index.scss'
import useWebSocket, { WebSocketMessage } from '../../hooks/useWebSocket'
import { useAddMessage, useMessages } from '../../state/message/hooks'
import { Message } from '../../state/message/reducer'
import sleep from '../../utils/sleep'
import Input from './Input'
import ReactECharts from 'echarts-for-react'
import { nanoid } from '@reduxjs/toolkit'
import { createEcho, parseEcho } from '../../utils/echo'

const renderer = new marked.Renderer()

renderer.link = function ({ href, title, text }) {
  const link = `<a href="${href}" target="_blank"${title ? ` title="${title}"` : ''}>${text}</a>`
  return link
}

marked.setOptions({
  renderer: renderer
})

const types: { name: string; id: Message['type'] }[] = [
  {
    name: '生成推文',
    id: 'create_tweets'
  },
  {
    name: '热推互动',
    id: 'public_opinions'
  },
  {
    name: '评论分析',
    id: 'create_replies'
  }
] as const

const tipsMessages: {
  [K in Message['type']]: string
} = {
  create_tweets: '请@X号,将为这个X号生成定制化推文。',
  public_opinions: '请输入您关注的领域,如全网热门crypto、娱乐等。根据您选择的板块寻找值得实时互动的推文。',
  create_replies: '可输入一条已发布的推文链接来分析评论区舆情，也可输入一条待发布推文预测舆情。'
}

function Home() {
  const [currentType, setCurrentType] = useState<(typeof types)[number]>(types[0])
  const [isTyping, setIsTyping] = useState<{ [K in Message['type']]: boolean }>({
    create_tweets: false,
    public_opinions: false,
    create_replies: false
  })
  const [botTips, setBotTips] = useState<{ [K in Message['type']]: string }>({
    create_tweets: '正在分析该x号内容特点...',
    public_opinions: '正在寻找当前热门事件+相关热门推文...',
    create_replies: '正在获取评论区内容及分析中...'
  })

  const [messages] = useMessages(currentType.id)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const addMessage = useAddMessage()

  const createUserMessage = useCallback(
    (content: string): Message => {
      return {
        id: nanoid(),
        createAt: Date.now(),
        role: 'user',
        content,
        type: currentType.id,
        textType: 'md'
      }
    },
    [currentType]
  )
  const createBotMessage = useCallback(
    (content: string, textType: Message['textType'], msgType?: Message['type']): Message => {
      return {
        id: nanoid(),
        createAt: Date.now(),
        role: 'assistant',
        content,
        type: msgType || currentType.id,
        textType
      }
    },
    [currentType]
  )

  const onMessage = useCallback(
    async ({ content, status, type, echo }: WebSocketMessage) => {
      const [msgType] = parseEcho(echo)

      if (status === 'Error') {
        addMessage(createBotMessage('获取数据错误', 'md', msgType))
        setIsTyping(pre => ({ ...pre, [msgType]: false }))
        await sleep(50)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      if (['md', 'graphic_pie', 'graphic_line'].includes(type)) {
        addMessage(createBotMessage(content, type))
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
    [addMessage, createBotMessage, isTyping]
  )

  const { sendMessage } = useWebSocket('ws://47.254.52.20:3000', onMessage)

  useEffect(() => {
    if (!messages.length) {
      addMessage(createBotMessage(tipsMessages[currentType.id], 'md'))
    }
  }, [addMessage, createBotMessage, currentType.id, messages])

  const handleSendMessage = async (value: string) => {
    const message = value.trim()

    if (!message || isTyping[currentType.id]) return

    const msg = createUserMessage(value)
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

  const renderMessageContent = (content: string, role: Message['role'], type: Message['textType']) => {
    if (role === 'assistant') {
      if (type === 'md') {
        const html = marked.parse(content)

        return <div className='message-text md' dangerouslySetInnerHTML={{ __html: html }} />
      }

      if (type === 'graphic_line') {
        return <ReactECharts option={JSON.parse(content)} style={{ height: 300 }} />
      }

      if (type === 'graphic_pie') {
        return <ReactECharts option={JSON.parse(content)} style={{ height: 260 }} />
      }
    }

    return <div className='message-text'>{content}</div>
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
              <div className='message-text w-fit'>{botTips[currentType.id]}</div>
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
                {renderMessageContent(msg.content, msg.role, msg.textType)}
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
              className={`flex items-center h-7 mr-4 rounded-full border border-solid  px-[14px] cursor-pointer text-xs ${
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
