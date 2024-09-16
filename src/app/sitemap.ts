import { MetadataRoute } from 'next'
import prisma from "../lib/prisma"
import { createPublicId } from '../lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links: MetadataRoute.Sitemap = [
    {
      url: 'https://attendancetracking.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://attendancetracking.vercel.app/login',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://attendancetracking.vercel.app/signup',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://attendancetracking.vercel.app/library',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://attendancetracking.vercel.app/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://attendancetracking.vercel.app/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://attendancetracking.vercel.app/students',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
  const students = await prisma.user.findMany({
    select: {
      id: true,
      publicId: true,
      tables: {
        select: {
          id: true,
          publicId: true,
        }
      }
    },
  })
  students.forEach((student) => {
    const profileUrl = `https://attendancetracking.vercel.app/${createPublicId(student.publicId, student.id)}`
    const studentUrl = `https://attendancetracking.vercel.app/students/${createPublicId(student.publicId, student.id)}`
    links.push(
      { url: profileUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, },
      { url: `${profileUrl}/create-table`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, },
      { url: studentUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9, },
    )

    student.tables.forEach((table) => {
      const tablePublicId = createPublicId(table.publicId, table.id);

      links.push(
        { url: `${profileUrl}/${tablePublicId}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9, },
        { url: `${profileUrl}/${tablePublicId}/edit`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, },
        { url: `${studentUrl}/${tablePublicId}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9, }
      );
    });
  })
  const data = await prisma.library.findMany({
    select: {
      tables: true,
    },
  })
  data?.forEach((library) => {
    library.tables.forEach((table) => {
      const libraryTableUrl = `https://attendancetracking.vercel.app/library/${createPublicId(table.publicId, table.id)}`;
      links.push(
        { url: libraryTableUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9, },
      )
    }
    )
  })
  return links;
}