"use client"
import { ImSpinner9 } from 'react-icons/im'
import { Button, ButtonProps } from './ui/button'


type Props = ButtonProps & {
  pending?: boolean,
  children: React.ReactNode
}

export default function SubmitButton({ children, pending, ...props }: Props) {


  return (
    <Button
      disabled={pending}
      {...props}
    >
      <ImSpinner9 className={`${pending ? "inline-flex opacity-100" : "hidden opacity-0"} ease-in-out animate-spin mr-2 transition-opacity duration-300`} size={25} />
      {children}
    </Button>
  )
}
