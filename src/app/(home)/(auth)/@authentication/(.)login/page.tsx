"use client"
import LoginForm from "../../_components/loginForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/_components/ui/dialog"
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
    <div className='flex items-center justify-center mt-12 max-w-md w-full mx-auto'>
      <Dialog open={isOpened} onOpenChange={() => { setIsOpened(prev => !prev); router.back() }}>
        <DialogContent aria-describedby={"Login form for users"}>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}
