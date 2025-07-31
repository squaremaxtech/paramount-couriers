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
                seenPackagesSet(await getPackages({}, { crud: "ro" }))
            }
            search()

        } catch (error) {
            consoleAndToastError(error)
        }
    }, [])

    return (
        <main>
            {seenPackages !== undefined && (
                <>
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
                                    return await getPackages(activeFilters as tableFilterTypes<packageType>, { crud: "ro" }, {}, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                                }}
                                renameTableHeadings={{
                                    id: "reggaeRushTrack"
                                }}
                                replaceData={{
                                    id: (wantedItem) => {
                                        return (
                                            <Link href={`/customer/packages/view/${generateTrackingNumber(wantedItem.id)}`}>
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
                            <p>Your packages will show up here</p>
                        )}
                </>
            )}
        </main>
    )
}