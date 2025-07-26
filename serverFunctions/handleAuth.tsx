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
            employee_regular: ["r"],
            employee_warehouse: fullAccess,
            employee_elevated: fullAccess,
            employee_supervisor: fullAccess,
            customer: ["ro"],
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
            customer: ["c", "ro", "uo", "do"],
        },
        columnDefaultCrud: {
            admin: fullAccess,
            employee_regular: ["c", "r"],
            employee_warehouse: ["c", "r", "u"],
            employee_elevated: ["c", "r", "u"],
            employee_supervisor: ["c", "r", "u"],
            customer: ["c", "ro", "uo", "do"],
        },
        columns: {
            id: fixedUserCrud,
            dateCreated: fixedUserCrud,
            acknowledged: {
                admin: ["c", "r", "u"],
                employee_regular: ["c", "r", "u"],
                employee_warehouse: ["c", "r", "u"],
                employee_elevated: ["c", "r", "u"],
                employee_supervisor: ["c", "r", "u"],
                customer: ["ro"],
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
        if (table === undefined) {
            tableErrors.push(`No access rules for table '${tableName}'`);

        } else {
            const userType = getUserType(session.user);
            let userCrud: crudType[] | null = null;

            //validate user crud found for table alone
            //if column names passed - go over each of them and ensure we can access - return a list of yes no for column names

            //column access list
            if (columnNames !== undefined) {
                columnNames.forEach(eachColumnName => {
                    if (table.columns === undefined) {
                        columnErrors.push("not seeing columns on table")

                    } else {
                        const column = table.columns[eachColumnName];
                        userCrud = column === undefined ? table.columnDefaultCrud[userType] : column[userType]

                        //verify with column names
                        validateUserCrud(userCrud, eachColumnName)
                    }
                })

            } else {
                //table access list
                userCrud = table.tableCrud[userType];

                validateUserCrud(userCrud)
            }

            function validateUserCrud(userCrud: crudType[], columnName?: tableColumns[T]) {
                //if can't access crud type
                if (!userCrud.includes(wantedCrudObj.crud)) {
                    if (columnName !== undefined) {
                        //update tableColumnAccess
                        tableColumnAccess[columnName] = false
                        columnErrors.push(`Not able to authorize task on column ${columnName}`);

                    } else {
                        tableErrors.push("Not able to authorize task on table");
                    }

                } else {
                    //can access
                    if (columnName !== undefined) {
                        //update tableColumnAccess
                        tableColumnAccess[columnName] = true
                    }
                }
            }

            //check for ownership - co, ro, uo, do
            if (wantedCrudObj.crud.includes("o")) {
                if (wantedCrudObj.resourceId === undefined) {
                    tableErrors.push("Not seeing resource ID for ownership check");

                } else {
                    let ownershipId = "";

                    //owenrship check on packages table e.g
                    if (tableName === "packages") {
                        const seenPackage = await getSpecificPackage(parseInt(wantedCrudObj.resourceId));
                        if (seenPackage === undefined) {
                            tableErrors.push(`Resource id not found for ${tableName}`);

                        } else {
                            ownershipId = seenPackage.userId;
                        }

                    } else if (tableName === "preAlerts") {
                        //more tables
                        const seenPreAlert = await getSpecificPreAlert(wantedCrudObj.resourceId, { crud: "r" }, false);
                        if (seenPreAlert === undefined) {
                            tableErrors.push(`Resource id not found for ${tableName}`);

                        } else {
                            ownershipId = seenPreAlert.userId;
                        }

                    } else {
                        tableErrors.push("Ownership check not implemented for this table");
                    }

                    if (session.user.id !== ownershipId) tableErrors.push("Not authorized as owner");
                }
            }
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