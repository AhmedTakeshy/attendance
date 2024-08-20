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
  const response = session?.user ? await getLastAttendanceTable(returnPublicId(session?.user.id as string)) : null;
  return (
    session?.user ? (
      response?.status === "Success" ? (
        <SimpleAttendanceTable table={response.data.table} />
      ) : (
        <CreateTableSection path="create" userId={`${session.user.id}`} words={words} />
      )
    ) : (
      <CreateTableSection path="login" words={words} />
    )
  );
}

type CreateTableSectionProps = {
  path: "login" | "create",
  userId?: string,
  words: string[]
}
function CreateTableSection({ path, words, userId }: CreateTableSectionProps) {
  return (
    <>
      <div className="flex justify-center items-center px-4 mx-auto">
        <div className="text-4xl mx-auto font-normal text-slate-600 dark:text-slate-500">
          Create
          <FlipWords words={words} /> <br />
          tables to track you attendance
        </div>
      </div>
      <Button asChild>
        <Link href={`/${path === "login" ? "login" : userId}/create-table`} className="flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300">
          Create attendance table
        </Link>
      </Button>
    </>
  )
}