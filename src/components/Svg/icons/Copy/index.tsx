import { SVGAttributes } from 'react'

export default function Copy({ fill, ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg width='15.000000' height='15.000000' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg' {...rest}>
      <desc>Created with Pixso.</desc>
      <defs />
      <rect x='4.500000' width='10.500000' height='10.500000' fill={fill || '#8D8E9B'} fill-opacity='1.000000' />
      <rect x='1.000000' y='3.500000' width='10.500000' height='10.500000' fill={fill || '#8D8E9B'} fill-opacity='1.000000' />
      <rect x='0.500000' y='3.000000' width='11.500000' height='11.500000' stroke='#000000' stroke-opacity='1.000000' stroke-width='1.000000' />
    </svg>
  )
}
