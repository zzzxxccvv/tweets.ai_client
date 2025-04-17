import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import AppBody from '../pages/AppBody'
import Markdown from '../pages/Markdown'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppBody,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/markdown',
        element: <Markdown />
      },
     
    ]
  }
])
