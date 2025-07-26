"use client"
import { ensureCanAccessTable } from '@/serverFunctions/handleAuth'
import { tableColumnAccessType, tableColumns, tableNames, wantedCrudObjType } from '@/types'
import { deepClone } from '@/utility/utility';
import { useEffect, useState } from 'react'

export default function useTableColumnAccess<T extends Object>({ tableName, tableRecordObject, wantedCrudObj }: { tableName: tableNames, tableRecordObject: T, wantedCrudObj: wantedCrudObjType, }) {
    const [tableColumnAccess, tableColumnAccessSet] = useState<tableColumnAccessType>({})

    useEffect(() => {
        const search = async () => {
            //only run on updates
            const tableRecordObjectKeys = Object.keys(tableRecordObject) as tableColumns[tableNames][]

            const ensureCanAccessTableReturn = await ensureCanAccessTable(tableName, wantedCrudObj, tableRecordObjectKeys)
            tableColumnAccessSet(ensureCanAccessTableReturn.tableColumnAccess)
            console.log(`$ensureCanAccessTableReturn`, ensureCanAccessTableReturn);
        }
        search()

    }, [])

    //filter not true records - make partial obj
    function filterTableObjectByColumnAccess<T extends Object>(sentTableRecordObject: T): Partial<T> {
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