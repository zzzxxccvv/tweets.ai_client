import { SVGAttributes } from 'react'

export default function Close({ ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      width='32.000000'
      height='32.000000'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...rest}>
      <desc>Created with Pixso.</desc>
      <defs>
        <clipPath id='clip163_171'>
          <rect width='32.000000' height='32.000000' fill='white' fill-opacity='0' />
        </clipPath>
      </defs>
      <rect  width='32.000000' height='32.000000' fill='#30313D' fill-opacity='1.000000' />
      <g clip-path='url(#clip163_171)'>
        <path
          d='M22.3638 11.0503L20.9497 9.63599L16 14.5858L11.0503 9.63599L9.63623 11.0503L14.5859 16L9.63623 20.9497L11.0503 22.3639L16 17.4142L20.9497 22.3639L22.3638 20.9497L17.4141 16L22.3638 11.0503Z'
          clipRule='evenodd'
          fill='#ECF0F2'
          fill-opacity='1.000000'
          fill-rule='evenodd'
        />
      </g>
    </svg>
  )
}
