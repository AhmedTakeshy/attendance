import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://attendancetracking.vercel.app/sitemap.xml',
    host: 'https://attendancetracking.vercel.app/',
  }
}