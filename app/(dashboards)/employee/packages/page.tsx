"use client"
import ViewTable from '@/components/viewTable/ViewTable'
import { packages } from '@/db/schema'
import { getPackages } from '@/serverFunctions/handlePackages'
import { packageType, tableFilterTypes } from '@/types'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { generateTrackingNumber, provideFilterAndColumnForTable } from '@/utility/utility'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const [seenPackages, seenPackagesSet] = useState<packageType[] | undefined>(undefined)

    //search packages
    useEffect(() => {
        try {
            const search = async () => {
                seenPackagesSet(await getPackages({}, { crud: "r" }, { fromUser: true }))
            }
            search()

        } catch (error) {
            consoleAndToastError(error)
        }
    }, [])

    return (
        <main className='container'>
            <Link href={`/employee/packages/add`} style={{ justifySelf: "flex-end" }}>
                <button className='button1'>add</button>
            </Link>

            {seenPackages !== undefined && (
                <>
                    {seenPackages.length > 0 ? (
                        <ViewTable
                            wantedItems={seenPackages}
                            tableProvider={provideFilterAndColumnForTable(packages)}
                            sizeClass={{
                                large: ["id", "trackingNumber", "location", "dateCreated"],
                                small: []
                            }}
                            searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                                return await getPackages(activeFilters as tableFilterTypes<packageType>, { crud: "r" }, { fromUser: true }, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                            }}
                            headingOrder={["id", "dateCreated", "fromUser"]}
                            renameTableHeadings={{
                                id: "reggaeRushTrack"
                            }}
                            replaceData={{
                                id: (wantedItem) => {
                                    return (
                                        <Link href={`/employee/packages/edit/${wantedItem.id}`}>
                                            <button className='button3'>
                                                {generateTrackingNumber(wantedItem.id)}

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
                        <p>customer packages will show here</p>
                    )}
                </>
            )}
        </main>
    )
}