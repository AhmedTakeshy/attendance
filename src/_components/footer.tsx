import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <div className='flex items-center justify-center gap-2 mt-8 text-gray-400'>
            <p >
                Copyrights &copy; 2024 Attendance. All Rights Reserved.
            </p>
            |
            <p>
                Developed by
                <Link
                    href="https://takeshy.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='font-bold text-transparent animate-text bg-clip-text bg-gradient-to-r from-blue-500 via-orange-500 to-purple-500'
                > Takeshy
                </Link>
            </p>
        </div>
    )
}