"use client"
import Image from "next/image"
import AttendanceTables from "./attendanceTables"
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar"
import { UserWithTables } from "@/_actions/studentActions"
import { usePathname } from "next/navigation"
import ProfileOptions from "./profileOptions"
import { sendVerificationToken } from "@/_actions/tokenActions"
import { toast } from "sonner"
import { FaCircleCheck } from "react-icons/fa6"
import SubmitButton from "@/_components/submitButton"


type ProfileProps = {
  data: Metadata<{ student: UserWithTables }>
}

export default function Profile({ data }: ProfileProps) {
  const pathname = usePathname()
  const fullName = data.student.name ?? `${data.student.firstName} ${data.student.lastName}`

  async function handleVerification() {
    try {
      const response = await sendVerificationToken(data.student.email, data.student.firstName)
      if (response?.status === "Success") {
        toast.success("Success!", {
          description: response.successMessage,
        })
      } else {
        toast.error("Oops!", {
          description: response?.errorMessage,
        })
      }
    } catch (error) {
      toast.error("Oops!", {
        description: "Something went wrong!",
      })
    }
  }
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2.5xl dark:shadow-none shadow-2xl shadow-shadow-500 pb-8 mx-4">
      <div className="w-full h-[250px] relative">
        {!pathname.includes("students") && (
          <ProfileOptions />
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
          <AvatarImage className="w-full h-full" src={`${data.student.image}`} alt={`${fullName}-image`} />
          <AvatarFallback className="w-full h-full">
            {fullName?.split(" ").map((name) => name.charAt(0)).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-2xl">{fullName}</p>
          {data.student.emailVerified?.getDate() && (
            <span className="bg-blue-500 rounded-full p-1" title="Verified">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
          )}
        </div>
        <p className="text-gray-500">{data.student.role ? "Student" : "Student(Admin)"}</p>
      </div>
      <div className="px-1 sm:px-4 md:px-8 mt-2 tablesPlace">
        <div className="flex items-center space-x-4 mt-2 justify-end">
          {!data.student.emailVerified?.getDate() && (
            <SubmitButton
              onClick={handleVerification}
              className="flex items-center !bg-brand-600 hover:!bg-brand-700 text-gray-100 text-sm transition duration-100 verifyEmail">
              <FaCircleCheck size={15} />
              <span className="ml-2">Verify Email</span>
            </SubmitButton>)}
          {/* <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
            </svg>
            <span>Message</span>
          </button> */}
        </div>
        {data.student.tables.length > 0 && (
          <AttendanceTables data={data} />
        )}
      </div>
    </div>
  )
}
