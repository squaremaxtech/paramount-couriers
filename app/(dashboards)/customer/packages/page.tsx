import ViewTable from '@/components/viewTable/ViewTable'
import { packages } from '@/db/schema'
import { getPackages } from '@/serverFunctions/handlePackages'
import { packageType, tableFilterTypes } from '@/types'
import { provideFilterAndColumnForTable } from '@/utility/utility'
import React from 'react'

export default async function Page() {
    const seenPackages = await getPackages({}, { crud: "ro", skipResourceIdCheck: true })

    return (
        <main>
            {seenPackages.length > 0 ?
                (
                    <ViewTable
                        wantedItems={seenPackages}
                        headingOrder={["id", "trackingNumber", "store", "description", "dateCreated", "location", "status", "invoices", "dateCreated", "price", "payment", "needAttention"]}
                        hideColumns={["userId", "comments", ("enableRLS") as (keyof packageType)]}
                        tableProvider={provideFilterAndColumnForTable(packages)}
                        sizeClass={{
                            large: ["id", "trackingNumber", "location", "dateCreated"],
                            small: []
                        }}
                        searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                            "use server"
                            return await getPackages(activeFilters as tableFilterTypes<packageType>, { crud: "ro", skipResourceIdCheck: true }, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                        }}
                        renameTableHeadings={{
                            id: "reggaeRushTrack"
                        }}
                    />

                ) : (
                    <p>Your packages will show up here</p>
                )}
        </main>
    )
}