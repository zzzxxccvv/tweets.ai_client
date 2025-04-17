import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import AppBody from '../pages/AppBody'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppBody,
    children: [
      {
        index: true,
        element: <Home />
      },
     
    ]
  }
])
