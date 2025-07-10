"use server";
import { auth } from "@/auth/auth";
import { getSpecificUser } from "./handleUser";
import { userType } from "@/types";
import * as schema from "@/db/schema"

type crudType = "c" | "r" | "u" | "d" | "co" | "ro" | "uo" | "do";

type userCrudType = {
    admin: crudType[];
    employee_regular: crudType[];
    employee_warehouse: crudType[];
    employee_elevated: crudType[];
    employee_supervisor: crudType[];
    customer: crudType[];
};
type userCrudKeysType = keyof userCrudType;

type tableNames = keyof typeof schema

// type tableNames = "users" | "packages" | "preAlerts";
type tableColumns = {
    users: "id" | "role" | "accessLevel" | "name" | "authorizedUsers";
    packages: "comments";
    preAlerts: "";
};

const fullAccess: crudType[] = ["c", "r", "u", "d"];
const readOnly: crudType[] = ["r"];
const readUpdate: crudType[] = ["r", "u"];
const creatUpdateOwn: crudType[] = ["c", "ro", "uo", "do"];

type tableAccessType = {
    [T in tableNames]?: {
        tableCrud: userCrudType;
        columnDefaultCrud: userCrudType;
        columns?: {
            [C in tableColumns[T]]?: userCrudType;
        };
    }
};

const tableAccess: tableAccessType = {
    users: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: readOnly,
            employee_warehouse: readOnly,
            employee_elevated: readOnly,
            employee_supervisor: ["c", "r", "d"],
            customer: ["ro"],
        },
        columnDefaultCrud: {
            admin: fullAccess,
            employee_regular: readOnly,
            employee_warehouse: readOnly,
            employee_elevated: readOnly,
            employee_supervisor: readOnly,
            customer: ["ro"],
        },
        columns: {
            id: {
                admin: readOnly,
                employee_regular: readOnly,
                employee_warehouse: readOnly,
                employee_elevated: readOnly,
                employee_supervisor: readOnly,
                customer: readOnly,
            },
            role: {
                admin: readUpdate,
                employee_regular: readOnly,
                employee_warehouse: readOnly,
                employee_elevated: readOnly,
                employee_supervisor: readOnly,
                customer: readOnly,
            },
            accessLevel: {
                admin: readUpdate,
                employee_regular: readOnly,
                employee_warehouse: readOnly,
                employee_elevated: readOnly,
                employee_supervisor: readUpdate,
                customer: readOnly,
            },
            name: {
                admin: fullAccess,
                employee_regular: readOnly,
                employee_warehouse: readOnly,
                employee_elevated: readUpdate,
                employee_supervisor: readUpdate,
                customer: ["r", "uo"],
            },
            authorizedUsers: {
                admin: fullAccess,
                employee_regular: readOnly,
                employee_warehouse: readOnly,
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
            employee_regular: ["r"],
            employee_warehouse: ["r", "u"],
            employee_elevated: ["r", "u"],
            employee_supervisor: ["r", "u"],
            customer: ["ro"],
        },
        columns: {
            comments: {
                admin: fullAccess,
                employee_regular: creatUpdateOwn,
                employee_warehouse: creatUpdateOwn,
                employee_elevated: creatUpdateOwn,
                employee_supervisor: ["c", "r", "d", "uo", "do"],
                customer: [],
            },
        },
    },
    preAlerts: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: ["r"],
            employee_warehouse: ["c", "r", "u"],
            employee_elevated: ["c", "r", "u"],
            employee_supervisor: ["c", "r", "u"],
            customer: creatUpdateOwn,
        },
        columnDefaultCrud: {
            admin: fullAccess,
            employee_regular: ["r"],
            employee_warehouse: ["r", "u"],
            employee_elevated: ["r", "u"],
            employee_supervisor: ["r", "u"],
            customer: creatUpdateOwn,
        },
        columns: {
        },
    },
};

export async function test() {
    const tablesInSchema = Object.entries(schema).map(eachEntry => {
        const eachKey = eachEntry[0]
        const eachValue = eachEntry[1]

        if (eachKey.includes("enum") || eachKey.includes("relations")) return null

        console.log(`$eachKey`, eachKey);
        console.log(`$eachValue`, eachValue);

        return eachKey
    })
}

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

function getUserType(user: userType): userCrudKeysType {
    return user.role === "employee"
        ? `employee_${user.accessLevel}` as userCrudKeysType
        : user.role;
}

export async function customerCheck() {
    const session = await sessionCheck();

    if (session.user.role !== "customer") throw new Error("Must be a customer");

    return session;
}

export async function ensureCanAccessTable<T extends tableNames>(
    tableInfo: { name: T; resourceId?: string },
    crudOption: crudType,
    columnName?: tableColumns[T]
) {
    const session = await sessionCheck();

    const table = tableAccess[tableInfo.name];
    if (table === undefined) throw new Error(`No access rules for table '${tableInfo.name}'`);

    const userType = getUserType(session.user);

    let accessList: crudType[] | null = null;

    //wants specific column access list
    if (columnName !== undefined) {
        if (table.columns === undefined) throw new Error("not seeing columns on table")

        const columnRules = table.columns[columnName];
        accessList = columnRules === undefined ? table.columnDefaultCrud[userType] : columnRules[userType]

    } else {
        //normal access list
        accessList = table.tableCrud[userType];
    }

    if (!accessList.includes(crudOption)) throw new Error(`User type "${userType} not allowed to (${crudOption}) on "${tableInfo.name}"${columnName !== undefined ? ` column "${columnName}"` : ""}`);

    //ensure user own's resource
    if (crudOption.includes("o")) {
        if (tableInfo.resourceId === undefined) throw new Error("Not seeing resource ID for ownership check");

        let ownershipId = "";

        if (tableInfo.name === "users") {
            const resourceUser = await getSpecificUser(tableInfo.resourceId);
            if (resourceUser === undefined) throw new Error("Resource user user not found");

            ownershipId = resourceUser.id;

        } else {
            throw new Error("Ownership check not implemented for this table");
        }

        if (session.user.id !== ownershipId) throw new Error("Not authorized as owner");
    }
}