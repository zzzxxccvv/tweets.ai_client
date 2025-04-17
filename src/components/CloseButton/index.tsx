import { SVGAttributes } from 'react'
import {CloseIcon} from '../Svg'

export default function CloseButton({ className, ...rest }: SVGAttributes<HTMLOrSVGElement>) {
  return <CloseIcon className={`cursor-pointer ${className}`} {...rest} />
}
