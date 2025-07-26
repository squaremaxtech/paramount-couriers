"use client"
import { ensureCanAccessTable } from '@/serverFunctions/handleAuth'
import { tableColumnAccessType, tableColumns, tableNames, wantedCrudObjType } from '@/types'
import { deepClone } from '@/utility/utility';
import { useEffect, useState } from 'react'

export default function useTableColumnAccess<T extends Object>({ tableName, tableRecordObject, wantedCrudObj }: { tableName: tableNames, tableRecordObject?: T, wantedCrudObj: wantedCrudObjType, }) {
    const [tableColumnAccess, tableColumnAccessSet] = useState<tableColumnAccessType>({})

    useEffect(() => {
        const search = async () => {
            //only run on updates
            if (tableRecordObject === undefined) return

            const tableRecordObjectKeys = Object.keys(tableRecordObject) as tableColumns[tableNames][]
            console.log(`$tableRecordObjectKeys`, tableRecordObjectKeys);

            const columnNameAccess = await ensureCanAccessTable(tableName, wantedCrudObj, tableRecordObjectKeys)
            tableColumnAccessSet(columnNameAccess.tableColumnAccess)
            console.log(`$columnNameAccess`, columnNameAccess);
        }
        search()

    }, [])

    //filter not true records - make partial obj
    function filterTableObjectByColumnAccess<T extends Object>(sentTableRecordObject: T): T {
        const newTableRecordObject = deepClone(sentTableRecordObject)

        //get object
        Object.entries(tableColumnAccess).map(eachEntry => {
            const eachKey = eachEntry[0] as keyof Object
            const eachValue = eachEntry[1]

            //delete values going up to server that are not authorised
            if (eachValue !== true) {
                delete newTableRecordObject[eachKey]
            }
        })

        return newTableRecordObject
    }

    return { tableColumnAccess, filterTableObjectByColumnAccess }
}