import { tableColumnAccessType } from "@/types"
import { deepClone } from "@/utility/utility"

export function convertBtyes(bytes: number, option: "kb" | "mb" | "gb") {
    if (option === "kb") {
        return bytes / 1024
    } else if (option === "mb") {
        return (bytes / 1024) / 1024
    } else {
        return ((bytes / 1024) / 1024) / 1024
    }
}

//filter not true records - make partial obj
export function filterTableObjectByColumnAccess<T extends Object>(tableColumnAccess: tableColumnAccessType, sentTableRecordObject: T, sentInitialTableRecordObject?: T): Partial<T> {
    const newTableRecordObject = deepClone(sentTableRecordObject)

    //get object
    Object.entries(tableColumnAccess).map(eachEntry => {
        const eachKey = eachEntry[0] as keyof Object
        const eachValue = eachEntry[1]

        //delete values going up to server that are not authorised
        if (eachValue !== true) {
            //delete from og object the key value pair
            if (sentInitialTableRecordObject === undefined) {
                delete newTableRecordObject[eachKey]

            } else {
                //replace it with the original object - no user changes
                //@ts-expect-error type
                newTableRecordObject[eachKey] = sentInitialTableRecordObject[eachKey]
            }
        }
    })

    return newTableRecordObject
}