import { SVGAttributes } from 'react'

export default function Twitter({ ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg width='20.000000' height='20.000000' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...rest}>
      <desc>Created with Pixso.</desc>
      <defs>
        <clipPath id='clip892_191'>
          <rect id='twitter' width='20.000000' height='20.000000' fill='white' fill-opacity='0' />
        </clipPath>
      </defs>
      <g clip-path='url(#clip892_191)'>
        <mask id='mask892_193' mask-type='alpha' maskUnits='userSpaceOnUse' x='0.000000' y='0.000000' width='20.000000' height='20.000000'>
          <rect id='rect' width='20.000000' height='20.000000' fill='#000000' fill-opacity='1.000000' />
        </mask>
        <g mask='url(#mask892_193)'>
          <path
            id='path'
            d='M15.47 1.66L18.31 1.66L12.09 8.78L19.41 18.46L13.68 18.46L9.19 12.59L4.04 18.46L1.2 18.46L7.85 10.85L0.83 1.66L6.71 1.66L10.77 7.03L15.47 1.66ZM14.47 16.76L16.04 16.76L5.85 3.28L4.16 3.28L14.47 16.76Z'
            fill='#8D8E9B'
            fill-opacity='1.000000'
            fill-rule='nonzero'
          />
        </g>
      </g>
    </svg>
  )
}
