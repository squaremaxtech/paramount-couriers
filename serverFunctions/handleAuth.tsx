"use server"
import { auth } from "@/auth/auth"
import { getSpecificUser } from "./handleUser"
import { userType } from "@/types"

export async function sessionCheck() {
    const session = await auth()

    if (session === null) {
        throw new Error("no session seen")

    } else {
        return session
    }
}

export async function adminCheck() {
    //logged in check
    const session = await sessionCheck()

    //security
    if (session.user.role !== "admin") throw new Error("need to be admin")

    return session
}

export async function employeeOrAdminCheck() {
    //logged in check
    const session = await sessionCheck()

    //security
    if (session.user.role !== "employee" && session.user.role !== "admin") throw new Error("need to be admin or employee")

    return session
}

type crudType = "c" | "r" | "u" | "d" | "ro" | "uo" | "do" //update own
type rulesObjType = {
    "admin": crudType[],
    "employee_regular": crudType[],
    "employee_elevated": crudType[],
    "employee_head": crudType[],
    "customer": crudType[],
}
type rulesObjKeysType = keyof rulesObjType

type tableNames = "users" | "packages";

type tableColumns = {
    users: "name" | "image";
    packages: "comments";
};

type tableUpdateRulesType = {
    [T in tableNames]: {
        columnNames?: {
            [C in tableColumns[T]]?: {
                rules: rulesObjType;
            };
        };
        rules: rulesObjType;
    };
};

const tableUpdateRules: tableUpdateRulesType = {
    "users": {
        columnNames: {
            "name": {
                rules: {
                    admin: ["r", "u", "ro", "uo"],
                    employee_regular: ["r", "ro", "uo"],
                    employee_elevated: ["r", "ro", "uo"],
                    employee_head: ["r", "ro", "uo"],
                    customer: ["r", "ro", "uo"],
                }
            }
        },
        rules: {
            admin: ["c", "r", "u", "d", "ro", "uo", "do"],
            employee_regular: ["r", "ro"],
            employee_elevated: ["r", "ro"],
            employee_head: ["r", "ro"],
            customer: ["ro"],
        }
    },
    "packages": {
        columnNames: {
            "comments": {
                rules: {
                    admin: ["r", "u", "ro", "uo"],
                    employee_regular: ["r", "ro", "uo"],
                    employee_elevated: ["r", "ro", "uo"],
                    employee_head: ["r", "ro", "uo"],
                    customer: ["r", "ro", "uo"],
                }
            }
        },
        rules: {
            admin: ["c", "r", "u", "d"],
            employee_regular: ["c", "r"],
            employee_elevated: ["c", "r"],
            employee_head: ["c", "r"],
            customer: ["ro"],
        }
    },
}


function getUserType(seenUser: userType) {
    let seenUserType: string = ""

    if (seenUser.role !== "employee") {
        //handle admin, customer
        seenUserType = seenUser.role

    } else if (seenUser.role === "employee") {
        seenUserType = `${seenUser.role}_${seenUser.accessLevel}`

    } else {
        throw new Error("user type not handled")
    }

    return seenUserType as rulesObjKeysType
}

export async function ensureCanAccessTable<T extends tableNames>(tableInfo: { name: T, resourceId?: string }, crudOption: crudType, columnName?: tableColumns[T]) {
    //security check - ensures all changes are authorised
    const session = await sessionCheck()

    const seenUser = await getSpecificUser(session.user.id)
    if (seenUser === undefined) throw new Error("not seeing user")

    const seenUpdateObjForTable = tableUpdateRules[tableInfo.name]
    if (seenUpdateObjForTable === undefined) throw new Error("not seeing update obj for table")

    //table coloumn rules override
    if (columnName !== undefined && seenUpdateObjForTable.columnNames !== undefined) {
        const seenColumnRules = seenUpdateObjForTable.columnNames[columnName]
        if (seenColumnRules === undefined) throw new Error(`not seeing rules for columnName ${columnName}`)

        return await handleRules(seenColumnRules.rules)
    }

    //base table rules
    return await handleRules(seenUpdateObjForTable.rules)









    async function handleRules(seenRulesObj: rulesObjType) {
        if (seenUser === undefined) throw new Error("not seeing user")

        //get user Type e.g admin, employee_regular
        const seenUserType = getUserType(seenUser)

        //take in the rules for the specific user type: e.g admin
        const allowedCrudOptions: crudType[] = seenRulesObj[seenUserType]
        if (allowedCrudOptions === undefined) throw new Error(`not seeing allowed crud options for this user type ${seenUserType}`)

        //ensure user has existing rules for action wanted
        if (!allowedCrudOptions.includes(crudOption)) throw new Error("not authorized for action")

        // ensure actually owns resource
        if (crudOption === "ro" || crudOption === "uo" || crudOption === "do") {
            if (tableInfo.resourceId === undefined) throw new Error("need to provide resource id")

            let ownershipId = ""

            //handle table names here
            if (tableInfo.name === "users") {
                const seenUser = await getSpecificUser(tableInfo.resourceId)
                if (seenUser === undefined) throw new Error("not seeing user")

                //e.g please remove
                ownershipId = seenUser.id

            } else {
                throw new Error("invalid table name")
            }

            if (session.user.id !== ownershipId) throw new Error("not authorized to update resource as own")
        }
    }
}