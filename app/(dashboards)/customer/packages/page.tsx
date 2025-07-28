import ViewTable from '@/components/viewTable/ViewTable'
import { packages } from '@/db/schema'
import { sessionCheck } from '@/serverFunctions/handleAuth'
import { getPackages } from '@/serverFunctions/handlePackages'
import { locationOptions, packageType, statusOptions, tableFilterTypes } from '@/types'
import { generateTableProvider } from '@/utility/utility'
import React from 'react'

export default async function Page() {
    const session = await sessionCheck()
    const seenPackages = await getPackages({ userId: session.user.id, }, { crud: "r" })

    return (
        <main>
            <ViewTable
                wantedItems={seenPackages}
                // headingOrder={["id", "trackingNumber", "description", "dateCreated"]}
                hideColumns={["userId", "comments", ("enableRLS") as (keyof packageType)]}
                tableProvider={generateTableProvider(packages, { location: locationOptions, status: statusOptions })}
                sizeClass={{
                    large: ["id", "trackingNumber", "dateCreated"],
                    small: []
                }}
                searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                    "use server"
                    return await getPackages({ ...(activeFilters as tableFilterTypes<packageType>), userId: session.user.id }, { crud: "r" }, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                }}
                renameTableHeadings={{
                    id: "reggaeRushTrack"
                }}
            />
        </main>
    )
}