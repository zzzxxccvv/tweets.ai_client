import { ButtonHTMLAttributes, ReactNode, RefAttributes } from 'react'

export const variants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  DANGER: 'danger',
  EMPTY: 'empty'
} as const

export const scales = {
  MD: 'md',
  SM: 'sm',
  XS: 'xs'
} as const

export type Scale = (typeof scales)[keyof typeof scales]
export type Variant = (typeof variants)[keyof typeof variants]

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: Variant
  scale?: Scale
  roundedFull?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  ref?: RefAttributes<HTMLButtonElement>['ref'] | undefined
}
