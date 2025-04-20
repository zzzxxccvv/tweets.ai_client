// src/hooks/useWebSocket.ts
import { useState } from 'react'
import { Message } from '../state/message/reducer'
import useReactWebSocket from 'react-use-websocket'

export interface WebSocketMessage {
  content: string
  status: 'success' | 'error'
  type: Message['contents'][number]['type']
  echo: string
}

export default function useWebSocket(url: string, onMessage: (msg: WebSocketMessage) => void) {
  const [isConnected, setIsConnected] = useState(false)

  const { sendJsonMessage } = useReactWebSocket(url, {
    onOpen: () => {
      setIsConnected(true)
    },
    onMessage: (event: MessageEvent) => {
      const data = JSON.parse(event.data)

      onMessage(data as WebSocketMessage)
      console.log('WebSocket receive message', data)
    },
    shouldReconnect: () => true, // 所有关闭事件都触发重连
    reconnectAttempts: 5, // 最大重连次数
    reconnectInterval: attempt => Math.min(1000 * Math.pow(2, attempt), 30000) // 指数退避
  })

  return { isConnected, sendMessage: sendJsonMessage }
}
