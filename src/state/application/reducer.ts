import { createSlice, nanoid } from '@reduxjs/toolkit'
import { DEFAULT_TXN_DISMISS_MS } from '../../constants/misc'

export enum PopupType {
  Transaction = 'transaction',
  Toast = 'toast'
}

export type PopupContent =
  | {
      type: PopupType.Transaction
      hash: string
    }
  | {
      type: PopupType.Toast
      desc?: string
      error?: boolean
    }

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  readonly popupList: PopupList
}

const initialState: ApplicationState = {
  popupList: []
}

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    addPopup(state, { payload: { content, key, removeAfterMs = DEFAULT_TXN_DISMISS_MS } }) {
      key = key || nanoid()
      state.popupList = [
        ...state.popupList.filter(popup => popup.key !== key),
        {
          key,
          show: true,
          content,
          removeAfterMs
        }
      ]
    },
    removePopup(state, { payload: { key } }) {
      state.popupList = state.popupList.map(popup => {
        if (popup.key === key) {
          popup.show = false
        }
        return popup
      })
    }
  }
})

export const { addPopup, removePopup } = applicationSlice.actions
export default applicationSlice.reducer
