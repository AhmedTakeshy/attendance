"use client"
import LoginForm from "../../_components/loginForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/_components/ui/dialog"
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from "react"


export default function Page() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpened, setIsOpened] = useState<boolean>(true)

  const handleOpen = (val: boolean) => {
    setIsOpened(val)
  }
  useEffect(() => {
    handleOpen(pathname.includes("/login"))
  }, [pathname])

  return (
    <Dialog open={isOpened} onOpenChange={() => { setIsOpened(prev => !prev); router.back() }}>
      <DialogContent className='p-0 rounded-sm md:rounded-2xl'>
        <DialogHeader className="sr-only">
          <DialogTitle className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            Welcome to Attendance
          </DialogTitle>
          <DialogDescription className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Sign up to attendance to create a table and start tracking your attendance.
          </DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}
