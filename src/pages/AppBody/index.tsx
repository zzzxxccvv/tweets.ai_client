import { Outlet } from 'react-router-dom'
// import Header from '../../components/Header'
import './index.scss'

export default function AppBody() {
  return (
    <div className='h-screen flex flex-col relative'>
      {/* <Header /> */}
      <div className='flex-[1] h-fit'>
        <Outlet />
      </div>
      {/* <img className='app-body-bg' src='' /> */}
    </div>
  )
}
