"use server";
import { auth } from "@/auth/auth";
import { crudType, ensureCanAccessTableReturnType, tableColumnAccessType, tableColumns, tableNames, userCrudType, userCrudTypeKeys, userType, wantedCrudObjType } from "@/types";
import { getSpecificPackage } from "./handlePackages";
import { getSpecificPreAlert } from "./handlePreAlerts";
import { errorZodErrorAsString } from "@/useful/consoleErrorWithToast";

const fullAccess: crudType[] = ["c", "r", "u", "d"];
const read: crudType[] = ["r"];
const readOwn: crudType[] = ["ro"];
const readUpdate: crudType[] = ["r", "u"];
const createReadUpdateOwn: crudType[] = ["c", "r", "uo", "do"];
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
const starterUserCrud: userCrudType = {
    admin: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
    employee_regular: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
    employee_warehouse: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
    employee_elevated: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
    employee_supervisor: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
    customer: ["c", "r", "u", "d", "co", "ro", "uo", "do"],
}

type tableAccessType = {
    [T in tableNames]: {
        tableCrud: userCrudType;
        columnDefaultCrud: userCrudType;
        columns?: {
            [C in tableColumns[T]]?: userCrudType;
        };
    } | undefined
};

const tableAccess: tableAccessType = {
    users: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: read,
            employee_warehouse: read,
            employee_elevated: read,
            employee_supervisor: ["c", "r"],
            customer: readOwn,
        },
        columnDefaultCrud: {
            admin: fullAccess,
            employee_regular: read,
            employee_warehouse: read,
            employee_elevated: read,
            employee_supervisor: read,
            customer: readOwn,
        },
        columns: {
            id: fixedUserCrud,
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
        tableCrud: {
            admin: fullAccess,
            employee_regular: read,
            employee_warehouse: fullAccess,
            employee_elevated: fullAccess,
            employee_supervisor: fullAccess,
            customer: readOwn,
        },
        columnDefaultCrud: {
            admin: fullAccess,
            employee_regular: read,
            employee_warehouse: readUpdate,
            employee_elevated: readUpdate,
            employee_supervisor: readUpdate,
            customer: readOwn,
        },
        columns: {
            id: fixedUserCrud,
            dateCreated: fixedUserCrud,
            comments: {
                admin: fullAccess,
                employee_regular: createReadUpdateOwn,
                employee_warehouse: createReadUpdateOwn,
                employee_elevated: createReadUpdateOwn,
                employee_supervisor: fullAccess,
                customer: [],
            },
        },
    },
    preAlerts: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: fullAccess,
            employee_warehouse: read,
            employee_elevated: fullAccess,
            employee_supervisor: fullAccess,
            customer: createReadUpdateDeleteOwn,
        },
        columnDefaultCrud: {
            admin: fullAccess,
            employee_regular: ["c", "r"],
            employee_warehouse: createReadUpdate,
            employee_elevated: createReadUpdate,
            employee_supervisor: createReadUpdate,
            customer: createReadUpdateDeleteOwn,
        },
        columns: {
            id: fixedUserCrud,
            dateCreated: fixedUserCrud,
            acknowledged: {
                admin: createReadUpdate,
                employee_regular: createReadUpdate,
                employee_warehouse: createReadUpdate,
                employee_elevated: createReadUpdate,
                employee_supervisor: createReadUpdate,
                customer: readOwn,
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

    userRelations: undefined,
    packageRelations: undefined,
    preAlertRelations: undefined,
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

export async function ensureCanAccessTable<T extends tableNames>(tableName: T, wantedCrudObj: wantedCrudObjType, columnNames?: tableColumns[T][]): Promise<ensureCanAccessTableReturnType> {
    const tableErrors: string[] = []
    const columnErrors: string[] = []
    const tableColumnAccess: tableColumnAccessType = {}

    try {
        const session = await sessionCheck();

        const table = tableAccess[tableName];
        if (table === undefined) throw new Error(`No access rules for table '${tableName}'`)

        const userType = getUserType(session.user);
        let userCrud: crudType[] | null = null;

        let doesOwn: undefined | boolean = undefined

        //column access list
        if (columnNames !== undefined) {
            if (table.columns === undefined) throw new Error(`not seeing columns on table`)

            for (let index = 0; index < columnNames.length; index++) {
                const eachColumnName = columnNames[index]

                const column = table.columns[eachColumnName];
                userCrud = column === undefined ? table.columnDefaultCrud[userType] : column[userType]

                //verify with column names
                await validateUserCrud(userCrud, eachColumnName)
            }

        } else {
            //table access list
            userCrud = table.tableCrud[userType];

            await validateUserCrud(userCrud)
        }

        async function validateUserCrud(userCrud: crudType[], columnName?: tableColumns[T]) {
            //if can't access crud type
            if (!userCrud.includes(wantedCrudObj.crud)) {
                //update tableColumnAccess

                //table
                if (columnName === undefined) {
                    throw new Error(`Not able to authorize "${wantedCrudObj.crud}" on table`)

                } else {
                    //column

                    //dont throw error for column fail
                    tableColumnAccess[columnName] = false
                    columnErrors.push(`Not able to authorize "${wantedCrudObj.crud}" task on column ${columnName}`);
                }

            } else {
                //can access crud type

                //own check
                const checkForOwn = wantedCrudObj.crud.includes("o") && wantedCrudObj.skipResourceIdCheck !== true
                if (checkForOwn) {
                    //prevent repeat column name checks 
                    doesOwn = columnName === undefined ? await checkOwnership() : doesOwn === undefined ? await checkOwnership() : doesOwn

                    //can access table/column
                    if (doesOwn) {
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
            if (wantedCrudObj.resourceId === undefined) throw new Error(`Not seeing resource ID for ownership check`)

            let ownershipId = "";

            //owenrship check on packages table e.g
            if (tableName === "packages") {
                const seenPackage = await getSpecificPackage(parseInt(wantedCrudObj.resourceId), { crud: "r" }, false);
                if (seenPackage === undefined) throw new Error(`Resource id not found for ${tableName}`)
                ownershipId = seenPackage.userId;

            } else if (tableName === "preAlerts") {
                //more tables
                const seenPreAlert = await getSpecificPreAlert(wantedCrudObj.resourceId, { crud: "r" }, false);
                if (seenPreAlert === undefined) throw new Error(`Resource id not found for ${tableName}`)
                ownershipId = seenPreAlert.userId;

            } else throw new Error(`Ownership check not implemented for this table`)

            //validation
            if (session.user.id !== ownershipId) throw new Error(`Not authorized as owner`)

            return true
        }

    } catch (error) {
        tableErrors.push(errorZodErrorAsString(error))
    }

    return {
        tableErrors: tableErrors.length > 0 ? tableErrors.join(", ") : undefined,
        columnErrors: columnErrors.length > 0 ? columnErrors.join(", ") : undefined,
        tableColumnAccess: tableColumnAccess
    }
}

function getUserType(user: userType): userCrudTypeKeys {
    return user.role === "employee"
        ? `${user.role}_${user.accessLevel}` as userCrudTypeKeys
        : user.role;
}

// export async function ensureCanAccessTableOld<T extends tableNames>(tableName: T, wantedCrudObj: wantedCrudObjType, columnName?: tableColumns[T]
// ) {
//     const session = await sessionCheck();

//     const table = tableAccess[tableName];
//     if (table === undefined) throw new Error(`No access rules for table '${tableName}'`);

//     const userType = getUserType(session.user);
//     let userCrud: crudType[] | null = null;

//     //column access list
//     if (columnName !== undefined) {
//         if (table.columns === undefined) throw new Error("not seeing columns on table")

//         const column = table.columns[columnName];
//         userCrud = column === undefined ? table.columnDefaultCrud[userType] : column[userType]

//     } else {
//         //table access list
//         userCrud = table.tableCrud[userType];
//     }

//     //if can't access crud type
//     if (!userCrud.includes(wantedCrudObj.crud)) {
//         throw new Error("Not able to authorize task");
//     }

//     //check for ownership - co, ro, uo, do
//     if (wantedCrudObj.crud.includes("o")) {
//         if (wantedCrudObj.resourceId === undefined) throw new Error("Not seeing resource ID for ownership check");

//         let ownershipId = "";

//         //owenrship check on packages table e.g
//         if (tableName === "packages") {
//             const seenPackage = await getSpecificPackage(parseInt(wantedCrudObj.resourceId));
//             if (seenPackage === undefined) throw new Error(`Resource id not found for ${tableName}`);

//             ownershipId = seenPackage.userId;

//         } else if (tableName === "preAlerts") {
//             //more tables
//             const seenPreAlert = await getSpecificPreAlert(wantedCrudObj.resourceId, { crud: "r" }, false);
//             if (seenPreAlert === undefined) throw new Error(`Resource id not found for ${tableName}`);

//             ownershipId = seenPreAlert.userId;

//         } else {
//             throw new Error("Ownership check not implemented for this table");
//         }

//         if (session.user.id !== ownershipId) throw new Error("Not authorized as owner");
//     }
// }