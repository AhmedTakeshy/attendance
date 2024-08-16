import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/_components/ui/dropdown-menu"
import { BsThreeDotsVertical } from "react-icons/bs"
import { Button } from "@/_components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/_components/ui/dialog"
import UpdateProfileForm from "./updateProfileForm"
import { useParams, usePathname } from "next/navigation"
import { returnPublicId } from "@/lib/utils"
import { toast } from "sonner"
import { deleteUser } from "@/_actions/userActions"
import { signOut } from "next-auth/react"


export default function ProfileOptions() {
    const pathname = usePathname()
    const { profileId } = useParams<{ profileId: string }>()

    function handleShareProfileId() {
        navigator.clipboard.writeText(profileId)
        toast.success("Profile Id copied to clipboard")
    }

    async function handleRemoveUser() {
        try {
            const res = await deleteUser(returnPublicId(profileId))
            if (res.status === "Success") {
                signOut({ callbackUrl: "/" })
                toast.success("User has been deleted successfully.")
            } else {
                toast.error("User has not been deleted.")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={"icon"} className="absolute top-6 right-6">
                    <BsThreeDotsVertical size={25} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 dark:bg-navy-800">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={`${pathname}/create-table`}>
                            Create Table
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={"ghost"} className="w-full pl-2 justify-start">
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-fit sm:rounded-2xl max-sm:px-2 rounded">
                                <UpdateProfileForm />
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareProfileId}>
                        Share profile Id
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleRemoveUser} className={`text-rose-600 hover:!text-rose-600`}>
                        Delete profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
