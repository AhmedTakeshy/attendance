import { getStudentTables } from "@/_actions/studentActions"
import { prisma } from "@/lib/prisma"
import { createPublicId, returnPublicId } from "@/lib/utils"
import { auth } from "@/lib/auth"
import { notFound, } from "next/navigation"
import Profile from "../../_components/profile"

export async function generateStaticParams() {
  const students = await prisma.user.findMany({
    select: {
      id: true,
      publicId: true,
    }
  })
  return students.map((student) => ({
    studentId: createPublicId(student.publicId, student.id),
  }))
}

type Props = {
  params: {
    studentId: string
  },
  searchParams: {
    [key: string]: string | undefined
  }
}

export default async function page({ params, searchParams }: Props) {
  const { studentId } = params
  const session = await auth()

  if (session?.user.id === studentId) {
    notFound()
  }

  const response = await getStudentTables({
    search: searchParams.search ?? "",
    studentId: returnPublicId(studentId),
    page: parseInt(searchParams.tablesPage ?? "1"),
    isPublic: true,
  })

  return (
    response.status === "Success" ? (
      <Profile data={response.data} />
    ) : (
      <p className="text-lg font-semibold text-red-600">Student not found</p>
    )
  )
}
