"use client"
import SignUpForm from '../../signup/_components/SignUpForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/_components/ui/dialog"
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function Page() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpened, setIsOpened] = useState<boolean>(true)

    const handleOpen = (val: boolean) => {
        setIsOpened(val)
    }
    useEffect(() => {
        handleOpen(pathname.includes("/signup"))
    }, [pathname])
    return (
        <div className='flex items-center justify-center mt-12 max-w-md w-full mx-auto'>
            <Dialog open={isOpened} onOpenChange={() => { setIsOpened(prev => !prev); router.push("/") }}>
                <DialogContent aria-describedby={"Sign up form for users"}>
                    <DialogHeader>
                        <DialogTitle>Sign up</DialogTitle>
                    </DialogHeader>
                    <SignUpForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}
