import PopupItem from './PopopItem'
import { useActivePopups } from '../../state/application/hooks'

export default function Popups() {
  const activePopups = useActivePopups()

  return (
    <div className='fixed z-[1000] md:right-3 md:left-[initial] md:top-[88px] top-16 left-4 right-4'>
      {activePopups.map(item => (
        <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
      ))}
    </div>
  )
}
