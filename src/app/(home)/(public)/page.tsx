import { FlipWords } from "@/_components/flip-words";
import { Button } from "@/_components/ui/button";
import Link from "next/link";

export default function Home() {
  const words = ["easy", "responsive", "smart", "accessible"];
  return (
    <main className="flex flex-col items-center justify-center gap-y-12 min-h-full">
      <div className="flex justify-center items-center px-4 mt-24 mx-auto">
        <div className="text-4xl mx-auto font-normal text-slate-600 dark:text-slate-500">
          Create
          <FlipWords words={words} /> <br />
          tables to track you attendance
        </div>
      </div>
      <Button asChild>
        <Link href="/signin" className="flex items-center bg-blue-500 hover:bg-blue-700 transition-colors duration-300">
          Create attendance table
        </Link>
      </Button>
    </main>
  );
}