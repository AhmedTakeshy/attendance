import { Dialog, DialogContent, } from "@/_components/ui/dialog"
import LoadingAuth from "../_components/LoadingAuth"


export default function Loading() {
    return (
        <div className="container mx-auto px-14">
            <Dialog defaultOpen={true}>
                <DialogContent>
                    <LoadingAuth />
                </DialogContent>
            </Dialog>
        </div>

    )
}
