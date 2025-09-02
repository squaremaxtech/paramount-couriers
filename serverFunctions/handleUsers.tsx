"use server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { newUserSchema, newUserType, userSchema, userType, tableColumns, tableFilterTypes, wantedCrudObjType } from "@/types"
import { and, eq, SQLWrapper } from "drizzle-orm"
import { ensureCanAccessTable } from "./handleAuth"
import { handleEnsureCanAccessTableResults, makeWhereClauses } from "@/utility/utility"
import { filterTableObjectByColumnAccess } from "@/useful/usefulFunctions"
import { initialNewUserObj } from "@/lib/initialFormData"

export async function addUser(newUserObj: newUserType) {
    const accessTableResults = await ensureCanAccessTable("users", { crud: "c" }, Object.keys(newUserObj) as tableColumns["users"][])
    handleEnsureCanAccessTableResults(accessTableResults, "table")

    //validate on server as well - if no rights then it'll replace
    const filteredUser = filterTableObjectByColumnAccess(accessTableResults.tableColumnAccess, newUserObj, initialNewUserObj)

    //validation
    const validatedUser = newUserSchema.parse(filteredUser)

    //add new request
    await db.insert(users).values({
        ...validatedUser
    })
}

export async function updateUser(userId: userType["id"], updatedUserObj: Partial<userType>, wantedCrudObj: wantedCrudObjType) {
    //validation
    userSchema.partial().parse(updatedUserObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("users", wantedCrudObj, Object.keys(updatedUserObj) as tableColumns["users"][])
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    await db.update(users)
        .set({
            ...updatedUserObj
        })
        .where(eq(users.id, userId));
}

export async function deleteUser(userId: userType["id"], wantedCrudObj: wantedCrudObjType) {
    //auth check
    const accessTableResults = await ensureCanAccessTable("users", wantedCrudObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //validation
    userSchema.shape.id.parse(userId)

    await db.delete(users).where(eq(users.id, userId));
}

export async function getSpecificUser(userId: userType["id"], wantedCrudObj: wantedCrudObjType, runAuth = true): Promise<userType | undefined> {
    if (runAuth) {
        //auth check
        const accessTableResults = await ensureCanAccessTable("users", wantedCrudObj)
        handleEnsureCanAccessTableResults(accessTableResults, "both")
    }

    userSchema.shape.id.parse(userId)

    const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return result
}

export async function getUsers(filter: tableFilterTypes<userType>, wantedCrudObj: wantedCrudObjType, getWith?: { [key in keyof userType]?: true }, limit = 50, offset = 0,): Promise<userType[]> {
    // Auth check
    const accessTableResults = await ensureCanAccessTable("users", wantedCrudObj);
    handleEnsureCanAccessTableResults(accessTableResults, "both");

    //compile filters into proper where clauses
    const whereClauses: SQLWrapper[] = makeWhereClauses(userSchema.partial(), filter, users)

    const results = await db.query.users.findMany({
        where: and(...whereClauses),
        limit,
        offset,
        with: getWith
    });

    return results;
}