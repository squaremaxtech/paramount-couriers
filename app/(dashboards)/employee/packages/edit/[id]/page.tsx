import AddEditPackage from '@/components/packages/AddEditPackage'
import { getSpecificPackage } from '@/serverFunctions/handlePackages'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    //validate
    const seenPackage = await getSpecificPackage(parseInt(id), { crud: "r" })
    if (seenPackage === undefined) return (<p>not seeing specific pre Alert</p>)

    return (
        <main>
            <AddEditPackage sentPackage={seenPackage} wantedCrudObj={{ crud: "u" }} />
        </main>
    )
}