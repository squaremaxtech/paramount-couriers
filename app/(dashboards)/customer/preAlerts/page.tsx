import ViewTable from '@/components/viewTable/ViewTable'
import { preAlerts } from '@/db/schema'
import { getPreAlerts } from '@/serverFunctions/handlePreAlerts'
import { preAlertType, tableFilterTypes } from '@/types'
import { provideFilterAndColumnForTable } from '@/utility/utility'
import Link from 'next/link'
import React from 'react'

export default async function Page() {
    const seenPreAlerts = await getPreAlerts({}, { crud: "ro" })

    return (
        <main className='container'>
            <Link href={`/customer/preAlerts/add`} style={{ justifySelf: "flex-end" }}>
                <button className='button1'>add</button>
            </Link>

            {seenPreAlerts.length > 0 ? (
                <ViewTable
                    wantedItems={seenPreAlerts}
                    tableProvider={provideFilterAndColumnForTable(preAlerts)}
                    sizeClass={{
                        large: [],
                        small: []
                    }}
                    headingOrder={["dateCreated", "fromUser"]}
                    searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                        "use server"
                        return await getPreAlerts(activeFilters as tableFilterTypes<preAlertType>, { crud: "ro" }, {}, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                    }}
                    hideColumns={["userId"]}
                    replaceData={{
                        id: {
                            text: "edit",
                            link: `/customer/preAlerts/edit`,
                            materialIconClass: "link",
                            hideTableData: true,
                        }
                    }}
                />
            ) : (
                <p>customer pre alerts will show here</p>
            )}
        </main>
    )
}