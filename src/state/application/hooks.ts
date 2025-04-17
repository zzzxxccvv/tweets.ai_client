import { useCallback, useMemo } from 'react'
import { addPopup, PopupContent, PopupType, removePopup } from './reducer'
import { AppState } from '..'
import { DEFAULT_TXN_DISMISS_MS, DEFAULT_POPUP_DISMISS_MS } from '../../constants/misc'
import { useAppDispatch, useAppSelector } from '../hooks'

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string, removeAfterMs?: number) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (content: PopupContent, key?: string, removeAfterMs?: number) => {
      dispatch(addPopup({ content, key, removeAfterMs: removeAfterMs ?? DEFAULT_TXN_DISMISS_MS }))
    },
    [dispatch]
  )
}

export function useAddErrorPopup() {
  const dispatch = useAppDispatch()

  return useCallback(
    (desc: string, removeAfterMs?: number) => {
      dispatch(
        addPopup({
          content: {
            type: PopupType.Toast,
            desc,
            error: true
          },
          removeAfterMs: removeAfterMs ?? DEFAULT_POPUP_DISMISS_MS
        })
      )
    },
    [dispatch]
  )
}

export function useAddSuccessPopup() {
  const dispatch = useAppDispatch()

  return useCallback(
    (desc: string, removeAfterMs?: number) => {
      dispatch(
        addPopup({
          content: {
            type: PopupType.Toast,
            desc,
            error: false
          },
          removeAfterMs: removeAfterMs ?? DEFAULT_POPUP_DISMISS_MS
        })
      )
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useAppSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
}
