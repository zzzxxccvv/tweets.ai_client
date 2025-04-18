// src/hooks/useWebSocket.ts
import { useState, useEffect, useRef } from 'react'
import { Message } from '../state/message/reducer'

export interface WebSocketMessage {
  content: string
  status: 'success' | 'error'
  type: Message['contents'][number]['type']
  echo: string
}

export default function useWebSocket(url: string, onMessage: (msg: WebSocketMessage) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket>(null)

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setIsConnected(true)
      console.log('WebSocket connected')
    }

    ws.current.onclose = () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    }

    ws.current.onerror = error => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  useEffect(() => {
    if (onMessage && ws.current) {
      ws.current.onmessage = event => {
        const message: WebSocketMessage = JSON.parse(event.data)

        onMessage(message)
        console.log('WebSocket receive message', message)
      }
    }
  }, [onMessage])

  const sendMessage = (message: { action: Message['type']; payload: string; echo: string }) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return { isConnected, sendMessage }
}
