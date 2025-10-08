import { auth } from '@/auth/auth'
import AddEditUser from '@/components/users/AddEditUser'
import { getSpecificUser } from '@/serverFunctions/handleUsers'
import React from 'react'

export default async function Page() {
    const session = await auth()
    if (session === null) throw new Error("not seeing session")

    const seenUser = await getSpecificUser(session.user.id, { action: "r", resourceId: session.user.id })
    if (seenUser === undefined) throw new Error("not seeing user")

    return (
        <main>
            <AddEditUser sentUser={seenUser} />
        </main>
    )
}