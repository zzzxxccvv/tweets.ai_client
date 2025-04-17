import { Close2Icon, ErrorIcon } from '../Svg'
import { Success3Icon } from '../Svg'

export default function ToastPopup({ desc, error, onRemove }: { desc?: string; error?: boolean; onRemove: () => void }) {
  return (
    <div className='flex items-center z-[1002]'>
      <div className='mr-[6px]'>{error ? <ErrorIcon /> : <Success3Icon />}</div>
      <div className='flex-1'>
        <div className={`text-sm`}>{desc}</div>
      </div>
      <div className='ml-[6px]'>
        <Close2Icon
          className='cursor-pointer'
          onClick={e => {
            e.stopPropagation()
            onRemove()
          }}
        />
      </div>
    </div>
  )
}
