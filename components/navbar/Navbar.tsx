import { auth } from '@/auth/auth'
import React from 'react'
import LogButton from '../logButtons/LogButton'

export default async function Navbar() {
    const session = await auth()

    return (
        <nav style={{ display: "flex", overflow: "auto", gap: "var(--spacingR)", whiteSpace: "nowrap" }}>
            {session === null ? (
                <>
                    <LogButton option='login' />
                </>
            ) : (
                <>
                    <LogButton option='logout' />
                </>
            )}
        </nav>
    )
}
