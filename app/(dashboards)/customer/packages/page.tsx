import { auth } from '@/auth/auth'
import ViewTable from '@/components/viewTable/ViewTable'
import { packages } from '@/db/schema'
import { getPackages } from '@/serverFunctions/handlePackages'
import { packageType, tableFilterTypes } from '@/types'
import { provideFilterAndColumnForTable } from '@/utility/utility'
import React from 'react'

export default async function Page() {
    const session = await auth()
    if (session === null) return <p>not seeing session</p>

    //ensures can only read own records
    const seenPackages = await getPackages({ userId: session.user.id }, { action: "r", skipOwnershipCheck: true }, {}, 50)

    return (
        <main className='container' style={{ overflow: "auto" }}>
            {seenPackages.length > 0 ?
                (
                    <ViewTable
                        wantedItems={seenPackages}
                        headingOrder={["id", "trackingNumber", "store", "description", "dateCreated", "location", "status", "invoices", "dateCreated", "packageValue", "charges", "payment", "needAttention"]}
                        hideColumns={["userId", "comments", ("enableRLS") as (keyof packageType)]}
                        tableProvider={provideFilterAndColumnForTable(packages)}
                        sizeClass={{
                            largest: [],
                            large: ["id", "trackingNumber", "location", "dateCreated"],
                            small: []
                        }}
                        searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                            "use server"
                            return await getPackages({ ...activeFilters, userId: session.user.id } as tableFilterTypes<packageType>, { action: "r", skipOwnershipCheck: true }, {}, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                        }}
                        replaceData={{
                            id: {
                                link: `/customer/packages/view`,
                                materialIconClass: "link",
                                transformLink: true,
                            }
                        }}
                    />

                ) : (
                    <p>Your packages will show up here</p>
                )}
        </main>
    )
}