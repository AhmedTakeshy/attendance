"use client"
import { ImSpinner9 } from 'react-icons/im'
import { Button, ButtonProps } from './ui/button'
import { cn } from '@/lib/utils'


type Props = ButtonProps & {
  pending?: boolean,
  children: React.ReactNode
}

export default function SubmitButton({ children, pending, ...props }: Props) {


  return (
    <Button
      disabled={pending}
      {...props}
      className={cn(" dark:bg-navy-600 dark:hover:bg-navy-700 dark:active:bg-navy-700 bg-brand-300 hover:bg-brand-300 active:bg-brand-400 disabled:cursor-wait text-white", props.className)}
    >
      <ImSpinner9
        size={25}
        className={`${pending ? "inline-flex opacity-100" : "hidden opacity-0"} ease-in-out  animate-spin mr-2 transition-opacity duration-300`} />
      {children}
    </Button>
  )
}
