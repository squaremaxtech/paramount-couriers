"use client"
import { ensureCanAccessTable } from '@/serverFunctions/handleAuth'
import { tableAuthViewType, tableColumns, tableNames, wantedCrudObjType } from '@/types'
import { deepClone } from '@/utility/utility';
import { useEffect, useState } from 'react'

export default function useTableAuthView<T extends Object>({ tableName, tableRecordObject, wantedCrudObj }: { tableName: tableNames, tableRecordObject?: T, wantedCrudObj: wantedCrudObjType, }) {
    const [tableAuthView, tableAuthViewSet] = useState<tableAuthViewType<T>>({})

    useEffect(() => {
        const search = async () => {
            //do nothing on adds / only run on updates
            if (tableRecordObject === undefined) return

            //go over each key and ask the server function if authenticated
            const tableRecordObjectEntries = Object.entries(tableRecordObject)

            await Promise.all(tableRecordObjectEntries.map(async eachEntry => {
                const eachKey = eachEntry[0] as keyof Object

                try {
                    //check auth for column name in table
                    await ensureCanAccessTable(tableName, wantedCrudObj, eachKey as tableColumns[tableNames])

                    //success mark eachkey as true
                    tableAuthViewSet(prevAuthTableView => {
                        const newAuthTableView = { ...prevAuthTableView }

                        newAuthTableView[eachKey] = true

                        return newAuthTableView
                    })

                } catch (error) {
                    tableAuthViewSet(prevAuthTableView => {
                        const newAuthTableView = { ...prevAuthTableView }
                        newAuthTableView[eachKey] = false

                        return newAuthTableView
                    })

                    console.log(`$user not authorised to ${wantedCrudObj.crud} ${eachKey} on ${tableName} table`, error);
                }
            }))
        }
        search()

    }, [])

    //filter not true records - make partial obj
    function filterTableObjectByAuth<T extends Object>(sentTableRecordObject: T): T {
        const newTableRecordObject = deepClone(sentTableRecordObject)

        //get object
        Object.entries(tableAuthView).map(eachEntry => {
            const eachKey = eachEntry[0] as keyof Object
            const eachValue = eachEntry[1]

            //delete values going up to server that are not authorised
            if (eachValue !== true) {
                delete newTableRecordObject[eachKey]
            }
        })

        return newTableRecordObject
    }

    return { tableAuthView, filterTableObjectByAuth }
}