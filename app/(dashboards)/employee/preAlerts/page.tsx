import ViewTable from '@/components/viewTable/ViewTable'
import { preAlerts } from '@/db/schema'
import { getPreAlerts } from '@/serverFunctions/handlePreAlerts'
import { preAlertType, tableFilterTypes } from '@/types'
import { provideFilterAndColumnForTable } from '@/utility/utility'
import React from 'react'

export default async function Page() {
    const seenPreAlerts = await getPreAlerts({}, { crud: "r" }, { fromUser: true })

    return (
        <main className='container'>
            {seenPreAlerts.length > 0 ? (
                <ViewTable
                    wantedItems={seenPreAlerts}
                    tableProvider={provideFilterAndColumnForTable(preAlerts)}
                    sizeClass={{
                        large: ["dateCreated"],
                        small: []
                    }}
                    headingOrder={["id", "dateCreated", "fromUser"]}
                    searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                        "use server"
                        return await getPreAlerts(activeFilters as tableFilterTypes<preAlertType>, { crud: "r" }, { fromUser: true }, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                    }}
                />
            ) : (
                <p>customer pre alerts will show here</p>
            )}
        </main>
    )
}