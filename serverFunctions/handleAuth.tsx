"use server";
import { auth } from "@/auth/auth";
import { getSpecificUser } from "./handleUser";
import { userType } from "@/types";

type crudType = "c" | "r" | "u" | "d" | "ro" | "uo" | "do";

type accessListType = {
    admin: crudType[];
    employee_regular: crudType[];
    employee_elevated: crudType[];
    employee_head: crudType[];
    customer: crudType[];
};
type accessListKeysType = keyof accessListType;

type tableNames = "users" | "packages" | "preAlerts";
type tableColumns = {
    users: "name" | "authorizedUsers";
    packages: "comments";
    preAlerts: "";
};

type TableAccessType<T extends tableNames = tableNames> = {
    tableCrud: accessListType;
    defaultColumnCrud: accessListType;
    columns?: {
        [C in tableColumns[T]]?: accessListType;
    };
};

const fullAccess: crudType[] = ["c", "r", "u", "d"];
const readOnly: crudType[] = ["r", "ro"];
const readUpdateOwn: crudType[] = ["r", "ro", "uo"];
const creatUpdateOwn: crudType[] = ["c", "ro", "uo", "do"];

const tableAccessList: { [T in tableNames]: TableAccessType<T> } = {
    users: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: ["r", "ro"],
            employee_elevated: readOnly,
            employee_head: readOnly,
            customer: ["ro"],
        },
        defaultColumnCrud: {
            admin: fullAccess,
            employee_regular: readOnly,
            employee_elevated: readOnly,
            employee_head: readOnly,
            customer: readOnly,
        },
        columns: {
            name: {
                admin: fullAccess,
                employee_regular: readUpdateOwn,
                employee_elevated: readUpdateOwn,
                employee_head: readUpdateOwn,
                customer: readUpdateOwn,
            },
            authorizedUsers: {
                admin: fullAccess,
                employee_regular: ["r"],
                employee_elevated: fullAccess,
                employee_head: fullAccess,
                customer: creatUpdateOwn,
            },
        },
    },
    packages: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: ["r"],
            employee_elevated: fullAccess,
            employee_head: fullAccess,
            customer: ["ro"],
        },
        defaultColumnCrud: {
            admin: fullAccess,
            employee_regular: ["r"],
            employee_elevated: ["r", "u"],
            employee_head: ["r", "u"],
            customer: ["ro"],
        },
        columns: {
            comments: {
                admin: fullAccess,
                employee_regular: creatUpdateOwn,
                employee_elevated: creatUpdateOwn,
                employee_head: ["c", "r", "d", "uo", "do"],
                customer: [],
            },
        },
    },
    preAlerts: {
        tableCrud: {
            admin: fullAccess,
            employee_regular: ["r"],
            employee_elevated: ["c", "r", "u"],
            employee_head: ["c", "r", "u"],
            customer: creatUpdateOwn,
        },
        defaultColumnCrud: {
            admin: fullAccess,
            employee_regular: ["r"],
            employee_elevated: ["r", "u"],
            employee_head: ["r", "u"],
            customer: creatUpdateOwn,
        },
        columns: {
        },
    },
};

function getUserType(user: userType): accessListKeysType {
    return user.role === "employee"
        ? `employee_${user.accessLevel}` as accessListKeysType
        : user.role;
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
    const seenUser = await getSpecificUser(session.user.id);
    if (seenUser === undefined) throw new Error("User not found");

    const table = tableAccessList[tableInfo.name];
    if (table === undefined) throw new Error(`No access rules for table '${tableInfo.name}'`);

    const userType = getUserType(seenUser);

    let accessList: crudType[] | null = null;

    //wants specific column access list
    if (columnName !== undefined) {
        if (table.columns === undefined) throw new Error("not seeing columns on table")

        const columnRules = table.columns[columnName];
        accessList = columnRules === undefined ? table.defaultColumnCrud[userType] : columnRules[userType]

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