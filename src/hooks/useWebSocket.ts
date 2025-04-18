// src/hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react'
import { Message } from '../state/message/reducer'
import sleep from '../utils/sleep'

export interface WebSocketMessage {
  content: string
  status: 'success' | 'error'
  type: Message['contents'][number]['type']
  echo: string
}

export default function useWebSocket(url: string, onMessage: (msg: WebSocketMessage) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket>(null)

  const connect = useCallback(() => {
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
  }, [url])

  useEffect(() => {
    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  useEffect(() => {
    if (onMessage && ws.current) {
      ws.current.onmessage = event => {
        const message: WebSocketMessage = JSON.parse(event.data)

        onMessage(message)
        console.log('WebSocket receive message', message)
      }
    }
  }, [onMessage])

  useEffect(() => {
    async function _reconnect() {
      await sleep(2000)
      connect()
    }

    if (!isConnected && ws.current) {
      _reconnect()
    }
  }, [connect, isConnected])

  const sendMessage = (message: { action: Message['type']; payload: string; echo: string }) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return { isConnected, sendMessage }
}
