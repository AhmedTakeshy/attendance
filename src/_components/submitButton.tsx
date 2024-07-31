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
      className={cn(props.className, " dark:bg-navy-800 dark:hover:bg-navy-700 dark:active:bg-navy-600 bg-white hover:bg-slate-100 active:bg-slate-200 disabled:cursor-wait")}
    >
      <ImSpinner9
        size={25}
        className={`${pending ? "inline-flex opacity-100" : "hidden opacity-0"} ease-in-out  animate-spin mr-2 transition-opacity duration-300`} />
      {children}
    </Button>
  )
}
