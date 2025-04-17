import { ReactNode } from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import './index.scss'
import CloseButton from '../CloseButton'

export default function Dialog({
  title,
  className,
  minHeight,
  children,
  onOpenChange,
  ...props
}: RadixDialog.DialogProps & { title?: ReactNode; minHeight?: string; className?: string }) {
  return (
    <RadixDialog.Root {...props} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild />
      <RadixDialog.Portal>
        <RadixDialog.Overlay className='dialog-overlay' />
        <RadixDialog.Content
          className={'dialog-content-wrapper'}
          onClick={e => {
            e.stopPropagation()
            if (onOpenChange) {
              onOpenChange(false)
            }
          }}>
          <div
            className={'dialog-content ' + className || ''}
            style={{
              minHeight: minHeight ? minHeight : '500px'
            }}
            onClick={e => e.stopPropagation()}>
            <div className='flex justify-between'>
              <div className='text-xl font-semibold'>{title}</div>
              <CloseButton onClick={() => onOpenChange && onOpenChange(false)} />
            </div>
            <div className='relative mt-6'>{children}</div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
