"use client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/_components/ui/navigation-menu"
import Link from "next/link"
import ModeToggle from "@/_components/modeToggle"
import { useEffect, useState } from "react"
import { Button, buttonVariants } from "@/_components/ui/button"
import { LuUserCircle2 } from "react-icons/lu";
import Image from "next/image"
import logo from "@/../public/logo.png"
import { PiSignInFill, PiSignOutBold } from "react-icons/pi";
import { usePathname } from "next/navigation"
import { ImSpinner9 } from "react-icons/im"
import { IoIosArrowDown } from "react-icons/io"
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/popover"


export default function NavMenu() {
    const [open, setOpen] = useState<boolean>(false)
    const pathname = usePathname()


    useEffect(() => {
        setOpen(false)
    }, [pathname])




    return (
        <header className={`flex mt-6 mb-10 mx-auto md:justify-around justify-between items-center w-full md:px-8 px-3`}>
            <Link href="/" aria-describedby="open home page" aria-label="open home page" aria-controls="navbar-default" aria-expanded="false">
                <Image src={logo} width={200} height={75} alt="logo" priority className="w-auto h-auto" />
            </Link>
            <NavigationMenu className={` items-center  justify-between hidden gap-2 md:flex`}>
                <NavigationMenuList className="items-center justify-between hidden gap-2 md:flex ">
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem tabIndex={-1}>
                        <Link href="/library" tabIndex={-1} legacyBehavior passHref>
                            <NavigationMenuLink tabIndex={-1} className={`${navigationMenuTriggerStyle()} pointer-events-none`}>Library</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/about" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/contact" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="items-center gap-3 hidden md:flex">
                <Button variant={"outline"} asChild>
                    <Link href="/signin" className="flex items-center">
                        Sign In
                        <PiSignInFill className="ml-2" />
                    </Link>
                </Button>
                <ModeToggle />
            </div>

            {/* Nav for small screens */}
            < div className={`flex items-center justify-between h-full md:hidden rounded-xl `}>
                <Popover onOpenChange={setOpen} open={open}>
                    <PopoverTrigger aria-controls="2" aria-labelledby="open menu button" asChild>
                        <div className="flex items-center gap-2">
                            <Button aria-describedby="open main menu" aria-label="open menu" data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                                </svg>
                            </Button>
                            <ModeToggle />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="relative w-screen mx-px top-2">
                        <div className="flex flex-col items-center mx-auto">
                            <NavigationMenu>
                                <NavigationMenuList className="flex flex-col items-center justify-center gap-2">
                                    <NavigationMenuItem>
                                        <Link href="/" legacyBehavior passHref>
                                            <NavigationMenuLink onClick={() => setOpen(false)} className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem tabIndex={-1}>
                                        <Link href="/library" tabIndex={-1} legacyBehavior passHref className="pointer-events-none">
                                            <NavigationMenuLink tabIndex={-1} onClick={() => setOpen(false)} className={`${navigationMenuTriggerStyle()} pointer-events-none`}>Library</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link href="/about" legacyBehavior passHref>
                                            <NavigationMenuLink onClick={() => setOpen(false)} className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link href="/contact" legacyBehavior passHref>
                                            <NavigationMenuLink onClick={() => setOpen(false)} className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                            <Button asChild>
                                <Link href="/signin" className="flex items-center w-full">
                                    Sign In
                                    <PiSignInFill className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div >
        </header >
    )
}