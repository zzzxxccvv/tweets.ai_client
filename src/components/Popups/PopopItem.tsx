import { useCallback, useEffect } from 'react'
import ToastPopup from './ToastPopup'
import { useRemovePopup } from '../../state/application/hooks'
import { PopupContent, PopupType } from '../../state/application/reducer'

export default function PopupItem({ removeAfterMs, content, popKey }: { removeAfterMs: number | null; content: PopupContent; popKey: string }) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])

  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  let popupContent
  if (content.type === PopupType.Toast) {
    popupContent = <ToastPopup desc={content.desc} error={content.error} onRemove={removeThisPopup} />
  }

  return <div className='mb-4 min-h-11 md:w-[320px] w-full p-[14px] z-[1001] bg-[#252731] border border-solid border-[#8D8E9B]'>{popupContent}</div>
}
