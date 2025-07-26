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

    return { tableColumnAccess }
}