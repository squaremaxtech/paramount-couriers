"use client"
import ViewTable from '@/components/viewTable/ViewTable'
import { preAlerts } from '@/db/schema'
import { getPreAlerts } from '@/serverFunctions/handlePreAlerts'
import { preAlertType, tableFilterTypes } from '@/types'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { provideFilterAndColumnForTable } from '@/utility/utility'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [seenPreAlerts, seenPreAlertsSet] = useState<preAlertType[] | undefined>(undefined)

    //search packages
    useEffect(() => {
        try {
            const search = async () => {
                seenPreAlertsSet(await getPreAlerts({}, { crud: "ro" }))
            }
            search()

        } catch (error) {
            consoleAndToastError(error)
        }
    }, [])

    return (
        <main className='container'>
            <Link href={`/customer/preAlerts/add`} style={{ justifySelf: "flex-end" }}>
                <button className='button1'>add</button>
            </Link>

            {seenPreAlerts !== undefined && (
                <>
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
                                return await getPreAlerts(activeFilters as tableFilterTypes<preAlertType>, { crud: "ro" }, {}, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                            }}
                            hideColumns={["userId"]}
                            replaceData={{
                                id: (wantedItem) => {
                                    return (
                                        <Link href={`/customer/preAlerts/edit/${wantedItem.id}`}>
                                            <button className='button3'>
                                                view

                                                <span className="material-symbols-outlined">
                                                    link
                                                </span>
                                            </button>
                                        </Link>
                                    )
                                }
                            }}
                        />
                    ) : (
                        <p>customer pre alerts will show here</p>
                    )}
                </>
            )}
        </main>
    )
}