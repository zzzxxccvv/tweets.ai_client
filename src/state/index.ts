import { configureStore } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'
import application, { ApplicationState } from './application/reducer'
import message from './message/reducer'

type MergedState = {
  application: ApplicationState
}
const PERSISTED_KEYS: string[] = ['application']
const loadedState = load({ states: PERSISTED_KEYS }) as MergedState

const store = configureStore({
  reducer: {
    application,
    message
  },
  middleware: gDM => gDM().concat(save({ states: PERSISTED_KEYS })),
  preloadedState: loadedState
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
