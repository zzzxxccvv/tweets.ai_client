import { SVGAttributes } from 'react'

export default function Triangle({ ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg width='16.000000' height='16.000000' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...rest}>
      <desc>Created with Pixso.</desc>
      <defs />
      <path
        d='M1.93 10.5C1.55 11.16 2.03 12 2.8 12L13.19 12C13.96 12 14.44 11.16 14.06 10.5L8.86 1.5C8.48 0.83 7.51 0.83 7.13 1.5L1.93 10.5ZM2.8 11L13.19 11L8 2L2.8 11Z'
        fill='#FFFFFF'
        fill-opacity='1.000000'
        fill-rule='evenodd'
      />
      <path d='M8 5L8 8' stroke='#FFFFFF' stroke-opacity='1.000000' stroke-width='1.000000' />
      <path d='M8 9L8 10' stroke='#FFFFFF' stroke-opacity='1.000000' stroke-width='1.000000' />
    </svg>
  )
}
