import { login } from "@/_actions/userActions"
import BottomGradient from "@/_components/bottomGradient"
import SubmitButton from "@/_components/submitButton"
import { useState } from "react"
import { RiTwitterXLine, RiInstagramLine } from "react-icons/ri"
import { FcGoogle } from "react-icons/fc"

export default function LoginWithProvider() {
    const [isPending, setIsPending] = useState<{ [key: string]: boolean }>({})

    async function loginWithProvider(provider: OAuthProvider) {
        setIsPending(prev => ({ ...prev, [provider.type]: true }))
        try {
            await login(provider)
        } catch (error) {
            return { error: true, message: "Something went wrong!", status: 401 }
        }
        setIsPending(prev => ({ ...prev, [provider.type]: false }))
    }
    return (
        <div className="flex flex-col space-y-4">
            <SubmitButton
                disabled={isPending["google"] || false}
                pending={isPending["google"] || false}
                onClick={() => loginWithProvider({ type: "google" })}
                className="hover:cursor-pointer relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            >
                <FcGoogle className="h-4 w-4" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                    Google
                </span>
                <BottomGradient />
            </SubmitButton>
            <SubmitButton
                disabled={isPending["twitter"] || false}
                pending={isPending["twitter"] || false}
                onClick={() => loginWithProvider({ type: "twitter" })}
                className="hover:cursor-pointer relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            >
                <RiTwitterXLine className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                    X
                </span>
                <BottomGradient />
            </SubmitButton>
            <SubmitButton
                disabled={isPending["instagram"] || false}
                pending={isPending["instagram"] || false}
                onClick={() => loginWithProvider({ type: "instagram" })}
                className="hover:cursor-pointer relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            >
                <RiInstagramLine className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                    Instagram
                </span>
                <BottomGradient />
            </SubmitButton>
        </div>
    )
}
