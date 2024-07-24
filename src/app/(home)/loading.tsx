import { ImSpinner } from "react-icons/im";

export default function loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <ImSpinner className="animate-spin rounded-full h-32 w-32 fill-indigo-700" />
        </div>
    )
}
