"use client"
import Image from "next/image"
import AttendanceTables from "./attendanceTables"
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar"
import { UserWithTables } from "@/_actions/studentActions"
import { usePathname } from "next/navigation"
import ProfileOptions from "./profileOptions"


type ProfileProps = {
  data: Metadata<{ student: UserWithTables }>
}

export default function Profile({ data }: ProfileProps) {
  const pathname = usePathname()

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2.5xl dark:shadow-none shadow-2xl shadow-shadow-500 pb-8 mx-4">
      <div className="w-full h-[250px] relative">
        {!pathname.includes("students") && (
          <ProfileOptions studentId={data.student.id} studentPublicId={data.student.publicId} />
        )}
        <Image
          width={1247}
          height={250}
          priority
          src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
          alt="Profile background"
          className="w-full h-full rounded-t-2.5xl" />
      </div>
      <div className="flex flex-col items-center -mt-20">
        <Avatar
          className="w-40 h-40 rounded-full border-4 border-white bg-navy-700 dark:!border-navy-700">
          <AvatarImage className="w-full h-full" src={`${data.student.image}`} alt={`${data.student.firstName}-image`} />
          <AvatarFallback className="w-full h-full">
            {`${data.student.firstName[0]}${data.student.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-2xl">{data.student.firstName} {data.student.lastName}</p>
          {/* <span className="bg-blue-500 rounded-full p-1" title="Verified">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
          </span> */}
        </div>
        <p className="text-gray-500">{data.student.role ? "Student" : "Student(Admin)"}</p>
      </div>
      <div className="px-1 sm:px-4 md:px-8 mt-2">
        {/* <div className="flex items-center space-x-4 mt-2">
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
            </svg>
            <span>Connect</span>
          </button>
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
            </svg>
            <span>Message</span>
          </button>
        </div> */}
        {data.student.tables.length > 0 && (
          <AttendanceTables data={data} />
        )}
      </div>
    </div>
  )
}
