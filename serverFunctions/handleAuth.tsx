"use server";
import { auth } from "@/auth/auth";
import { crudActionObjType, crudBaseType, crudType, ensureCanAccessTableReturnType, tableColumnAccessType, tableColumns, tableNames, userCrudType, userCrudTypeKeys, userType } from "@/types";
import { getSpecificPackage } from "./handlePackages";
import { errorZodErrorAsString } from "@/useful/consoleErrorWithToast";
import { getSpecificUser } from "./handleUsers";

const fullAccess: crudType[] = ["c", "r", "u", "d"];
const read: crudType[] = ["r"];
const readOwn: crudType[] = ["ro"];
const readUpdate: crudType[] = ["r", "u"];
const createReadUpdate: crudType[] = ["c", "r", "u"];
const createReadUpdateDeleteOwn: crudType[] = ["c", "ro", "uo", "do"];
const fixedUserCrud: userCrudType = {
    admin: read,
    employee_regular: read,
    employee_warehouse: read,
    employee_elevated: read,
    employee_supervisor: read,
    customer: read,
}
// const starterUserCrud: userCrudType = {
//     admin: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
//     employee_regular: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
//     employee_warehouse: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
//     employee_elevated: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
//     employee_supervisor: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
//     customer: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
// }

type tableAccessType = {
    [T in tableNames]: {
        table: userCrudType;
        columnDefault: userCrudType;
        columns?: {
            [C in tableColumns[T]]?: userCrudType;
        };
    } | undefined
};

const tableAccess: tableAccessType = {
    users: {
        table: {
            admin: fullAccess,
            employee_regular: readUpdate,
            employee_warehouse: read,
            employee_elevated: readUpdate,
            employee_supervisor: ["c", "r", "u"],
            customer: ["ro", "uo"],
        },
        columnDefault: {
            admin: fullAccess,
            employee_regular: read,
            employee_warehouse: read,
            employee_elevated: read,
            employee_supervisor: read,
            customer: readOwn,
        },
        columns: {
            id: {
                admin: fullAccess,
                employee_regular: read,
                employee_warehouse: read,
                employee_elevated: read,
                employee_supervisor: read,
                customer: read,
            },
            role: {
                admin: readUpdate,
                employee_regular: read,
                employee_warehouse: read,
                employee_elevated: read,
                employee_supervisor: read,
                customer: readOwn,
            },
            accessLevel: {
                admin: readUpdate,
                employee_regular: read,
                employee_warehouse: read,
                employee_elevated: read,
                employee_supervisor: readUpdate,
                customer: readOwn,
            },
            name: {
                admin: fullAccess,
                employee_regular: read,
                employee_warehouse: read,
                employee_elevated: readUpdate,
                employee_supervisor: readUpdate,
                customer: ["r", "uo"],
            },
            email: {
                admin: fullAccess,
                employee_regular: read,
                employee_warehouse: read,
                employee_elevated: readUpdate,
                employee_supervisor: readUpdate,
                customer: ["ro"],
            },
            address: {
                admin: fullAccess,
                employee_regular: readUpdate,
                employee_warehouse: read,
                employee_elevated: readUpdate,
                employee_supervisor: readUpdate,
                customer: ["ro", "uo"],
            },
            packageDeliveryMethod: {
                admin: fullAccess,
                employee_regular: readUpdate,
                employee_warehouse: read,
                employee_elevated: readUpdate,
                employee_supervisor: readUpdate,
                customer: ["ro", "uo"],
            },
            authorizedUsers: {
                admin: fullAccess,
                employee_regular: read,
                employee_warehouse: read,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["co", "ro", "uo", "do"],
            },
        },
    },
    packages: {
        //who can add to the packages table
        table: {
            admin: fullAccess,
            employee_regular: createReadUpdate,
            employee_warehouse: fullAccess,
            employee_elevated: fullAccess,
            employee_supervisor: fullAccess,
            customer: ["c", "ro"],
        },
        columnDefault: {
            admin: fullAccess,
            employee_regular: createReadUpdate,
            employee_warehouse: fullAccess,
            employee_elevated: fullAccess,
            employee_supervisor: fullAccess,
            customer: ["ro"],
        },
        columns: {
            id: fixedUserCrud,
            dateCreated: fixedUserCrud,
            comments: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: [],
            },
            userId: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            trackingNumber: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            store: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            consignee: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            description: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            packageValue: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            cifValue: {
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: ["c", "ro"],
            },
            invoices: {//customer can update freely
                admin: fullAccess,
                employee_regular: fullAccess,
                employee_warehouse: fullAccess,
                employee_elevated: fullAccess,
                employee_supervisor: fullAccess,
                customer: createReadUpdateDeleteOwn,
            },
        },
    },

    // not used
    accounts: undefined,
    sessions: undefined,
    authenticators: undefined,
    verificationTokens: undefined,

    roleEnum: undefined,
    accessLevelEnum: undefined,
    statusEnum: undefined,
    locationEnum: undefined,
    packageDeliveryMethodEnum: undefined,

    userRelations: undefined,
    packageRelations: undefined,
};

export async function sessionCheck() {
    const session = await auth();
    if (!session) throw new Error("No session found");
    return session;
}

export async function adminCheck() {
    const session = await sessionCheck();
    if (session.user.role !== "admin") throw new Error("Admin access required");

    return session;
}

export async function employeeOrAdminCheck() {
    const session = await sessionCheck();

    const role = session.user.role;
    if (role !== "admin" && role !== "employee") throw new Error("Must be admin or employee");

    return session;
}

export async function customerCheck() {
    const session = await sessionCheck();

    if (session.user.role !== "customer") throw new Error("Must be a customer");

    return session;
}

function getUserType(user: userType): userCrudTypeKeys {
    return user.role === "employee"
        ? `${user.role}_${user.accessLevel}` as userCrudTypeKeys
        : user.role;
}

export async function ensureCanAccessTable<T extends tableNames>(tableName: T, columnNames: tableColumns[T][] = [], crudActionObj: crudActionObjType): Promise<ensureCanAccessTableReturnType> {
    const tableColumnAccess: tableColumnAccessType = {}

    const tableErrors: string[] = []
    const columnErrors: string[] = []

    try {
        const session = await sessionCheck();

        const table = tableAccess[tableName];
        if (table === undefined) throw new Error(`No access rules for table '${tableName}'`)

        const userType = getUserType(session.user);

        let userPermissionsCrud: crudType[] | null = null;
        let userDoesOwn: undefined | boolean = undefined

        //column access list
        if (columnNames.length > 0) {
            if (table.columns === undefined) throw new Error(`not seeing columns on table`)

            for (let index = 0; index < columnNames.length; index++) {
                const eachColumnName = columnNames[index]

                const column = table.columns[eachColumnName];
                userPermissionsCrud = column === undefined ? table.columnDefault[userType] : column[userType]

                //verify with column names
                await validateUserCrud(userPermissionsCrud, eachColumnName)
            }

        } else {
            //table access list
            userPermissionsCrud = table.table[userType];

            await validateUserCrud(userPermissionsCrud)
        }

        async function validateUserCrud(seenUserPermissionsCrud: crudType[], columnName?: tableColumns[T]) {
            //action is CRUD
            //r and ro must match with r

            //r, ro includes r
            const foundUserPermissionCrud = seenUserPermissionsCrud.find(eachSeenUserPermissionCrud => eachSeenUserPermissionCrud.includes(crudActionObj.action))

            //if can't do wanted action
            if (foundUserPermissionCrud === undefined) {
                //update tableColumnAccess

                //table
                if (columnName === undefined) {
                    throw new Error(`Not able to authorize "${crudActionObj.action}" on table`)

                } else {
                    //column

                    //dont throw error for column fail
                    tableColumnAccess[columnName] = false
                    columnErrors.push(`Not able to authorize "${crudActionObj.action}" on column ${columnName}`);
                }

            } else {
                //can do wanted action

                //own check
                const checkForOwnership = foundUserPermissionCrud.includes("o") && !crudActionObj.skipOwnershipCheck
                if (checkForOwnership) {
                    //prevent repeat column name checks 
                    userDoesOwn = columnName === undefined ? await checkOwnership() : userDoesOwn === undefined ? await checkOwnership() : userDoesOwn

                    //can access table/column
                    if (userDoesOwn) {
                        //table - do nothing

                        //column - update tableColumnAccess
                        if (columnName !== undefined) {
                            tableColumnAccess[columnName] = true
                        }

                    } else {
                        //cannot access table/column

                        //table
                        if (columnName === undefined) {
                            throw new Error("ownership check failed on table")

                        } else {
                            //column - update tableColumnAccess
                            tableColumnAccess[columnName] = false
                        }
                    }

                } else {
                    //table - do nothing

                    //column - update tableColumnAccess
                    if (columnName !== undefined) {
                        tableColumnAccess[columnName] = true
                    }
                }
            }
        }

        async function checkOwnership() {
            //check for ownership - co, ro, uo, do
            if (crudActionObj.resourceId === undefined) throw new Error(`Not seeing resource ID for ownership check`)

            let ownershipId = "";

            //owenrship check on packages table e.g
            if (tableName === "packages") {
                const seenPackage = await getSpecificPackage(parseInt(crudActionObj.resourceId), { action: "r" }, false);
                if (seenPackage === undefined) throw new Error(`Resource id not found for ${tableName}`)
                ownershipId = seenPackage.userId;

            } else if (tableName === "users") {
                const seenUser = await getSpecificUser(crudActionObj.resourceId, { action: "r" }, false);
                if (seenUser === undefined) throw new Error(`Resource id not found for ${tableName}`)
                ownershipId = seenUser.id;

            } else throw new Error(`Ownership check not implemented for this table`)

            //validation
            if (session.user.id !== ownershipId) throw new Error(`Not authorized as owner`)

            return true
        }

    } catch (error) {
        tableErrors.push(errorZodErrorAsString(error))
    }

    return {
        tableColumnAccess: tableColumnAccess,
        tableErrors: tableErrors.length > 0 ? tableErrors.join(", ") : undefined,
        columnErrors: columnErrors.length > 0 ? columnErrors.join(", ") : undefined
    }
}