import { SVGAttributes } from 'react'
import './index.scss'

export default function ArrowTop({
  isExpand,
  className,
  ...rest
}: SVGAttributes<HTMLOrSVGElement> & {
  isExpand?: boolean
}) {
  return (
    <svg
      className={`arrow-top ${className} ${isExpand ? 'arrow-expand' : undefined}`}
      width='9.003906'
      height='8.014465'
      viewBox='0 0 9.00391 8.01447'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...rest}>
      <desc>Created with Pixso.</desc>
      <defs />
      <path
        d='M0.5 3.51L4.5 0.51L8.5 3.51'
        stroke='#8B9495'
        stroke-opacity='1.000000'
        stroke-width='1.000000'
        stroke-linejoin='round'
        stroke-linecap='round'
      />
      <path
        d='M0.5 7.51L4.5 4.51L8.5 7.51'
        stroke='#8B9495'
        stroke-opacity='1.000000'
        stroke-width='1.000000'
        stroke-linejoin='round'
        stroke-linecap='round'
      />
    </svg>
  )
}
