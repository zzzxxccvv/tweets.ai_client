import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import store from './state'
import { Provider } from 'react-redux'
import Popups from './components/Popups'
import './styles/index.scss'

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Popups />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
