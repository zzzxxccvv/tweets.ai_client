import { SVGAttributes } from 'react'

export default function ArrowLine({ fill, ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg width='65.003906' height='13.321899' viewBox='0 0 65.0039 13.3219' fill='none' xmlns='http://www.w3.org/2000/svg' {...rest}>
      <desc>Created with Pixso.</desc>
      <defs />
      <path
        d='M61.58 5.66L57.63 1.71C57.24 1.31 57.24 0.69 57.63 0.29C58.03 -0.1 58.65 -0.1 59.05 0.29L64.7 5.95C65.1 6.34 65.1 6.97 64.7 7.36L59.05 13.02C58.65 13.42 58.03 13.42 57.63 13.02C57.24 12.62 57.24 12 57.63 11.61L61.58 7.66L0 7.66L0 5.66L61.58 5.66Z'
        fill={fill || '#B5FD14'}
        fill-opacity='1.000000'
        fill-rule='evenodd'
      />
    </svg>
  )
}
