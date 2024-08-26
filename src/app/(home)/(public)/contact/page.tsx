import React from 'react'
import EmailTemplate from '../../_components/emailTemplate'

export default function page() {
    return (
        <EmailTemplate firstName={"Ahmed"} token={"https://attendancetracking.vercel.app"} />
    )
}
