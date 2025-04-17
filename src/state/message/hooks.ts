import { useCallback, useMemo } from 'react'
import { addMessage, Message, removeMessage } from './reducer'
import { AppState } from '..'
import { useAppDispatch, useAppSelector } from '../hooks'

export function useAddMessage(): (message: Message) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (message: Message) => {
      dispatch(addMessage({ message }))
    },
    [dispatch]
  )
}

export function useRemoveMessage(): (id: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (id: string) => {
      dispatch(removeMessage({ id }))
    },
    [dispatch]
  )
}

export function useMessages(type: Message['type']): [AppState['message']['messages']] {
  const list = useAppSelector((state: AppState) => state.message.messages)

  return useMemo(() => {
    return [list.filter(item => item.type === type)]
  }, [list, type])
}
