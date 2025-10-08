import AddEditUser from '@/components/users/AddEditUser'
import { getSpecificUser } from '@/serverFunctions/handleUsers'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    //validate
    const seenUser = await getSpecificUser(id, { action: "r" })
    if (seenUser === undefined) return (<p>not seeing specific user</p>)

    return (
        <main>
            <AddEditUser sentUser={seenUser} />
        </main>
    )
}