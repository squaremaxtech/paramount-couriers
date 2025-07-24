"use client"
import { ensureCanAccessTable } from '@/serverFunctions/handleAuth'
import { clientSideAuthTableViewType, tableColumns, tableNames, wantedCrudObjType } from '@/types'
import { deepClone } from '@/utility/utility';
import { useEffect, useState } from 'react'

export default function useAuthTableView<T>({ tableName, wantedCrudObj, tableRecordObject }: {
    tableName: tableNames, wantedCrudObj: wantedCrudObjType, tableRecordObject?: T
}) {
    const [authTableView, authTableViewSet] = useState<clientSideAuthTableViewType<T>>({})

    //this takes in an object from the tables - a table record: preAlert table - have a preAlert obj
    //returns and object that has valid columns set to yes no - returns that same type but with true false

    useEffect(() => {
        const search = async () => {
            //do nothing on adds / only run on updates
            if (tableRecordObject === undefined) return

            //go over each key and ask the server function if authenticated
            // @ts-expect-error type
            const tableRecordObjectEntries = Object.entries(tableRecordObject)

            await Promise.all(tableRecordObjectEntries.map(async eachEntry => {
                const eachKey = eachEntry[0] as tableColumns[tableNames]
                //this is a column name of the type passed - 
                //e.g preAlerts given - so each key is id, price...etc

                try {
                    //check auth for column name in table
                    await ensureCanAccessTable(tableName, wantedCrudObj, eachKey)

                    //success mark eachkey as true
                    authTableViewSet(prevAuthTableView => {
                        const newAuthTableView = { ...prevAuthTableView }
                        //@ts-expect-error type
                        newAuthTableView[eachKey] = true

                        return newAuthTableView
                    })

                } catch (error) {
                    authTableViewSet(prevAuthTableView => {
                        const newAuthTableView = { ...prevAuthTableView }
                        //@ts-expect-error type
                        newAuthTableView[eachKey] = false

                        return newAuthTableView
                    })
                }
            }))
        }
        search()

    }, [])

    //filter not true records - make partial obj
    function filterObjByAuth<T extends Object>(sentTableRecordObject: T): T {
        const newTableRecordObject = deepClone(sentTableRecordObject)

        //get object

        Object.entries(authTableView).map(eachEntry => {
            const eachKey = eachEntry[0]
            const eachValue = eachEntry[1]

            if (eachValue !== true) {
                //delete 
                //@ts-expect-error type
                delete newTableRecordObject[eachKey]
            }

        })

        return newTableRecordObject

        //compare auth table
        //if values true keep em
        // const newTableRecordObject: Object = Object.fromEntries(Object.entries(sentTableRecordObject).map(eachEntry => {
        //     const eachKey = eachEntry[0]
        //     const eachValue = eachEntry[1]

        //     if (authTableView[eachKey] !== true) {
        //         return null
        //     }


        //     return [eachKey, eachValue]
        // }).filter(eachEntryArr => eachEntryArr !== null))

        // console.log(`$newTableRecordObject`, newTableRecordObject);
        // return newTableRecordObject
    }

    return { authTableView, filterObjByAuth }
}