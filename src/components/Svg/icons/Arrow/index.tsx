import { SVGAttributes, useMemo } from 'react'

export default function Arrow({
  fill,
  direction = 'down',
  ...rest
}: SVGAttributes<HTMLOrSVGElement> & { direction?: 'left' | 'top' | 'down' | 'right' }) {
  const _direction = useMemo(() => {
    switch (direction) {
      case 'left':
        return 'rotate-90'
      case 'top':
        return 'rotate-180'
      case 'down':
        return ''
      case 'right':
        return 'rotate-[270deg]'
    }
  }, [direction])

  return (
    <svg
      width='8.577148'
      height='6.744059'
      viewBox='0 0 8.57715 6.74406'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`${_direction}`}
      {...rest}>
      <desc>Created with Pixso.</desc>
      <defs />
      <path
        d='M3.46 6.31L0.17 1.56C-0.28 0.9 0.19 0 1 0L7.57 0C8.38 0 8.85 0.9 8.39 1.56L5.11 6.31C4.71 6.88 3.86 6.88 3.46 6.31Z'
        fill={fill || '#FFFFFF'}
        fill-opacity='1.000000'
        fill-rule='evenodd'
      />
    </svg>
  )
}
