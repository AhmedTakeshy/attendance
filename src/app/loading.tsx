import { ImSpinner9 } from "react-icons/im";

export default function loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <ImSpinner9 className="animate-spin rounded-full h-32 w-32 fill-indigo-700" />
        </div>
    )
}
