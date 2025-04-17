import { SVGAttributes } from 'react'

export default function Share({ fill, ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg width='16.000000' height='16.000000' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...rest}>
      <desc>Created with Pixso.</desc>
      <defs />
      <path d='M13 8L13 13L3 13L3 3L8 3' stroke={fill || '#000000'} stroke-opacity='1.000000' stroke-width='1.000000' />
      <path d='M10.66 1.33L14.66 1.33L14.66 5.33' stroke={fill || '#000000'} stroke-opacity='1.000000' stroke-width='1.000000' />
      <path d='M8.33 7.66L14.66 1.33' stroke={fill || '#000000'} stroke-opacity='1.000000' stroke-width='1.000000' />
    </svg>
  )
}
