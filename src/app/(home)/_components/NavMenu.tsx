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
import { useState } from "react"
import { Button } from "@/_components/ui/button"
import Image from "next/image"
import logo from "@/../public/logo.png"
import { PiSignInBold, PiSignOutBold, PiStudentFill } from "react-icons/pi";
import { ImSpinner9 } from "react-icons/im"
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/popover"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/_components/ui/dropdown-menu"
import { LuUserCircle2 } from "react-icons/lu"
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar"
import { MdSpaceDashboard } from "react-icons/md"



export default function NavMenu() {
    const [open, setOpen] = useState<boolean>(false)
    const session = useSession()
    console.log("🚀 ~ NavMenu ~ session:", session)
    const fullName = session.data ? (session.data.user.name ?? `${session?.data.user.firstName} ${session?.data.user.lastName}`) : undefined

    function logoutAction() {
        signOut({ callbackUrl: "/login" })
        toast.info("Logout", {
            description: "Goodbye, see you soon!",
        })
    }

    return (
        <header className={`flex mt-6 mb-10 mx-auto md:justify-around justify-between items-center w-full md:px-8 px-3`}>
            <Link href="/" aria-describedby="open home page" aria-label="open home page" aria-controls="navbar-default" aria-expanded="false">
                <Image src={logo} width={256} height={96} alt="logo" priority className="sm:w-64 sm:h-24 w-48 h-16" />
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
                {session.status === "loading" ?
                    <Button variant={"outline"} className="w-full">
                        <ImSpinner9 className="animate-spin ease-in-out" />
                    </Button>
                    :
                    session.status === "authenticated" ?
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="hover:cursor-pointer">
                                    <AvatarImage src={session.data.user.image || ""} alt={`${fullName}-image`} />
                                    <AvatarFallback>
                                        {fullName?.split(" ").map((name) => name.charAt(0)).join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-2.5xl dark:bg-navy-800">
                                <DropdownMenuLabel>👋 Hey, {fullName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${session.data.user.id}?tablesPage=1`}
                                            aria-label="open profile"
                                            aria-controls="navbar-default"
                                            aria-expanded="false"
                                            className="hover:cursor-pointer hover:!text-navy-400">
                                            <LuUserCircle2 className="w-5 h-5 mr-2 " />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/students`}
                                            aria-label="open wishlist"
                                            aria-controls="navbar-default"
                                            aria-expanded="false"
                                            className="hover:cursor-pointer hover:!text-indigo-600">
                                            <PiStudentFill className="w-5 h-5  mr-2" />
                                            Students
                                        </Link>
                                    </DropdownMenuItem>
                                    {session.data.user.role === "ADMIN" && (
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard`}
                                                aria-label="open profile"
                                                aria-controls="navbar-default"
                                                aria-expanded="false"
                                                className="hover:cursor-pointer hover:!text-cyan-400">
                                                <MdSpaceDashboard className="w-5 h-5 mr-2 " />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        asChild
                                        onClick={logoutAction}>
                                        <span className="hover:cursor-pointer hover:!text-red-600">
                                            <PiSignOutBold className="w-5 h-5 mr-2" />
                                            Logout
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        :
                        <Button variant={"outline"} asChild>
                            <Link href="/login" className="flex items-center">
                                Login
                                <PiSignInBold className="ml-2" />
                            </Link>
                        </Button>}
                <ModeToggle />
            </div>

            {/* Nav for small screens */}
            < div className={`flex items-center gap-3 justify-between h-full md:hidden rounded-xl `}>
                {!!session.data &&
                    <div className="items-center gap-3 flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="hover:cursor-pointer">
                                    <AvatarImage src={session.data.user.image || ""} alt={`${fullName}-image`} />
                                    <AvatarFallback>
                                        {fullName?.split(" ").map((name) => name.charAt(0)).join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 rounded-2.5xl dark:bg-navy-800">
                                <DropdownMenuLabel>👋 Hey, {fullName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/${session.data.user.id}?tablesPage=1`}
                                            aria-label="open profile"
                                            aria-controls="navbar-default"
                                            aria-expanded="false"
                                            className="hover:cursor-pointer hover:!text-blue-400">
                                            <LuUserCircle2 className="w-5 h-5 mr-2 " />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/students`}
                                            aria-label="open wishlist"
                                            aria-controls="navbar-default"
                                            aria-expanded="false"
                                            className="hover:cursor-pointer hover:!text-indigo-600">
                                            <PiStudentFill className="w-5 h-5  mr-2" />
                                            Students
                                        </Link>
                                    </DropdownMenuItem>
                                    {session.data.user.role === "ADMIN" && (
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard`}
                                                aria-label="open profile"
                                                aria-controls="navbar-default"
                                                aria-expanded="false"
                                                className="hover:cursor-pointer hover:!text-cyan-400">
                                                <MdSpaceDashboard className="w-5 h-5 mr-2 " />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        asChild
                                        onClick={logoutAction}>
                                        <span className="hover:cursor-pointer hover:!text-red-600">
                                            <PiSignOutBold className="w-5 h-5 mr-2" />
                                            Logout
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ModeToggle />
                    </div>
                }
                <Popover onOpenChange={setOpen} open={open}>
                    <PopoverTrigger aria-controls="2" aria-labelledby="open menu button" asChild>
                        <div className="flex items-center gap-2">
                            <Button aria-describedby="open main menu" aria-label="open menu" data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                                </svg>
                            </Button>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="relative w-screen mx-px top-2 bg-lightPrimary dark:bg-navy-900">
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
                            {session.status === "loading" ?
                                <Button variant={"outline"} className="w-full">
                                    <ImSpinner9 className="animate-spin ease-in-out" />
                                </Button> :
                                !session?.data &&
                                <Button variant={"outline"} asChild>
                                    <Link href="/login" className="flex items-center w-full">
                                        Login
                                        <PiSignInBold className="ml-2" />
                                    </Link>
                                </Button>}
                        </div>
                    </PopoverContent>
                </Popover>

            </div >
        </header >
    )
}