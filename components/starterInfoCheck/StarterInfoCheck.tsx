"use client"
import { retreiveFromLocalStorage, saveToLocalStorage } from '@/utility/saveToStorage'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StarterInfoCheck({ seenSession }: { seenSession: Session | null }) {
    const router = useRouter()

    //redirect if info incomplete
    useEffect(() => {
        if (seenSession === null) return

        let nameCheckRedirect = false

        if (seenSession.user.role === "customer" && (seenSession.user.name === "" || seenSession.user.name === null)) {
            nameCheckRedirect = true
            router.push("/customer/account")
        }

        //redirect if first time logginIn - only if not redirected already for name
        if (!nameCheckRedirect && seenSession.user.role === "customer") {
            //check for variable
            const loginRedirectedOnce = retreiveFromLocalStorage("loginRedirectedOnce")
            if (loginRedirectedOnce === true) return

            //save to local storage
            saveToLocalStorage("loginRedirectedOnce", true)

            //redirect
            router.push("/customer")
        }

    }, [])

    return null
}