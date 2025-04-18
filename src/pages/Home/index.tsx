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
  const link = `<a class="break-words" href="${href}" target="_blank" ${title ? ` title="${title}"` : ''}>${text}</a>`
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
    name: 'Interact with hot tweets',
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
  const [loadingTips, setLoadingTips] = useState<{ [K in Message['type']]: string }>({
    create_tweets: '',
    public_opinions: '',
    create_replies: ''
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

  const createContent = useCallback((content: string, type: Message['contents'][number]['type']): Message['contents'][number] => {
    return {
      id: nanoid(),
      content: content,
      type: type
    }
  }, [])

  const onMessage = useCallback(
    async ({ content, type, echo }: WebSocketMessage) => {
      const [msgType, id] = parseEcho(echo)

      if (['list'].includes(type) && currentType.id === msgType) {
        setLoadingTips(pre => ({ ...pre, [msgType]: content }))
        return
      }

      if (type === 'error') {
        addMessage(createBotMessage([createContent(content, 'md')], id, msgType))
        setIsTyping(pre => ({ ...pre, [msgType]: false }))
        await sleep(50)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      if (['thinking'].includes(type) && currentType.id === msgType) {
        setBotTips(pre => ({ ...pre, [msgType]: content }))
        await sleep(50)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      if (['start'].includes(type) && currentType.id === msgType) {
        setIsTyping(pre => ({ ...pre, [msgType]: true }))
        return
      }

      if (type === 'finish') {
        console.log(type === 'finish')
        setIsTyping(pre => ({ ...pre, [msgType]: false }))
        return
      }

      const oldMessage = messages.find(item => {
        return item.userMessageId && item.userMessageId === id
      })

      if (oldMessage) {
        updateMessage(oldMessage.id, {
          contents: oldMessage?.contents.concat([createContent(content, type)])
        })

        await sleep(50)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      if (['md', 'graphic_pie', 'graphic_line'].includes(type)) {
        addMessage(createBotMessage([createContent(content, type)], id, msgType))

        await sleep(50)
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }
    },
    [addMessage, createBotMessage, createContent, currentType.id, messages, updateMessage]
  )

  const { sendMessage } = useWebSocket(WEB_SOCKET_URL, onMessage)

  useEffect(() => {
    if (!messages.length) {
      addMessage(createBotMessage([createContent(tipsMessages[currentType.id], 'md')]))
    }
  }, [addMessage, createBotMessage, createContent, currentType.id, messages])

  const handleSendMessage = async (value: string) => {
    const message = value.trim()

    if (!message || isTyping[currentType.id]) return

    const msg = createUserMessage([createContent(value, 'md')])
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
          style={{
            width: contents.findIndex(item => ['graphic_pie', 'graphic_line'].includes(item.type)) > 0 ? '100%' : 'fit-content',
            maxWidth: '900px'
          }}>
          {contents.map(item => {
            if (item.type === 'md') {
              const html = marked.parse(item.content)

              return <div key={item.id} className='prose max-w-[900px]' dangerouslySetInnerHTML={{ __html: html }} />
            }

            if (item.type === 'graphic_line') {
              return <ReactECharts key={item.id} option={JSON.parse(item.content)} style={{ height: 300, width: '100%', maxWidth: '800px' }} />
            }

            if (item.type === 'graphic_pie') {
              return <ReactECharts key={item.id} option={JSON.parse(item.content)} style={{ height: 260, width: '100%', maxWidth: '800px' }} />
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
        {loadingTips[currentType.id] && (
          <div className='message assistant'>
            <div className='message-avatar assistant-avatar'>AI</div>
            <div className='message-content pt-1'>{renderMessageContent(createBotMessage([createContent(loadingTips[currentType.id], 'md')]))}</div>
          </div>
        )}
        {isTyping[currentType.id] && (
          <div className='message assistant'>
            <div className='message-avatar assistant-avatar'>AI</div>
            <div className='message-content pt-1'>{renderMessageContent(createBotMessage([createContent(botTips[currentType.id], 'md')]))}</div>
          </div>
        )}
        <div ref={messagesEndRef} id='messages-end' />
        <div>
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && <div className={`message-avatar ${msg.role}-avatar`}>{'AI'}</div>}
              <div className='message-content'>{renderMessageContent(msg)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white absolute bottom-0 left-0 right-0 pt-[10px]'>
        <div className='flex items-center pl-4 mb-[10px] w-full overflow-x-auto'>
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
