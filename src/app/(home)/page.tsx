import { FlipWords } from "@/app/(home)/_components/flipWords";
import { Button } from "@/_components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { returnPublicId } from "@/lib/utils";
import { getLastAttendanceTable } from "@/_actions/tableActions";
import SimpleAttendanceTable from "./_components/simpleAttendanceTable";

export default async function Home() {
  const words = ["easy", "responsive", "smart", "accessible"];
  const session = await auth();
  const response = await getLastAttendanceTable(returnPublicId(session?.user.id as string));
  return (
    response?.status === "Success" ? (
      <SimpleAttendanceTable table={response.data.table} />
    ) : (
      <>
        <div className="flex justify-center items-center px-4 mx-auto">
          <div className="text-4xl mx-auto font-normal text-slate-600 dark:text-slate-500">
            Create
            <FlipWords words={words} /> <br />
            tables to track you attendance
          </div>
        </div>
        <Button asChild>
          <Link href={`/login`} className="flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300">
            Create attendance table
          </Link>
        </Button>
      </>
    )
  );
}