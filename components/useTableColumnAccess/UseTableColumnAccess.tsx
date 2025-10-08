"use client"
import { ensureCanAccessTable } from '@/serverFunctions/handleAuth'
import { tableColumnAccessType, tableColumns, tableNames, crudActionObjType } from '@/types'
import { useEffect, useState } from 'react'

export default function useTableColumnAccess<T extends Object>({ tableName, tableRecordObject, crudActionObj }: { tableName: tableNames, tableRecordObject: T, crudActionObj: crudActionObjType, }) {
    const [tableColumnAccess, tableColumnAccessSet] = useState<tableColumnAccessType>({})

    useEffect(() => {
        const search = async () => {
            //only run on updates
            const tableRecordObjectKeys = Object.keys(tableRecordObject) as tableColumns[tableNames][]

            const ensureCanAccessTableReturn = await ensureCanAccessTable(tableName, tableRecordObjectKeys, crudActionObj)
            tableColumnAccessSet(ensureCanAccessTableReturn.tableColumnAccess)
            console.log(`$ensureCanAccessTableReturn`, ensureCanAccessTableReturn);
        }
        search()

    }, [])

    return { tableColumnAccess }
}