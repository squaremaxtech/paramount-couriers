import { ViewPackage } from '@/components/packages/ViewPackages'
import { getSpecificPackage } from '@/serverFunctions/handlePackages'
import { extractIdFromTrackingNumber } from '@/utility/utility'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const usableId = extractIdFromTrackingNumber(id)
    console.log(`$usableId`, usableId);

    //validate
    const seenPackage = await getSpecificPackage(usableId, { crud: "ro", resourceId: `${usableId}` })
    if (seenPackage === undefined) return (<p>not seeing specific package</p>)

    return (
        <main>
            <ViewPackage seenPackage={seenPackage} />
        </main>
    )
}