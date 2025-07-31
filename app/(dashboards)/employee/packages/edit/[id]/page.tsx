import AddEditPackage from '@/components/packages/AddEditPackage'
import { getSpecificPackage } from '@/serverFunctions/handlePackages'
import { extractIdFromTrackingNumber } from '@/utility/utility'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const usableId = extractIdFromTrackingNumber(id)

    //validate
    const seenPackage = await getSpecificPackage(usableId, { crud: "r" })
    if (seenPackage === undefined) return (<p>not seeing specific package</p>)

    return (
        <main>
            <AddEditPackage sentPackage={seenPackage} wantedCrudObj={{ crud: "u" }} />
        </main>
    )
}