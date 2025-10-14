"use client"
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StarterInfoCheck({ seenSession }: { seenSession: Session | null }) {
    const router = useRouter()

    //redirect if info incomplete
    useEffect(() => {
        if (seenSession === null) return

        if (seenSession.user.role === "customer" && (seenSession.user.name === "" || seenSession.user.name === null)) {
            router.push("/customer/account")
        }

    }, [])

    return null
}