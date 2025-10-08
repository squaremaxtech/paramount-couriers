"use server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { newUserSchema, newUserType, userSchema, userType, tableColumns, tableFilterTypes, crudActionObjType } from "@/types"
import { and, eq, SQLWrapper } from "drizzle-orm"
import { ensureCanAccessTable } from "./handleAuth"
import { handleEnsureCanAccessTableResults, makeWhereClauses } from "@/utility/utility"
import { filterTableObjectByColumnAccess } from "@/useful/usefulFunctions"
import { initialNewUserObj } from "@/lib/initialFormData"

export async function addUser(newUserObj: newUserType) {
    const accessTableResults = await ensureCanAccessTable("users", Object.keys(newUserObj) as tableColumns["users"][], { action: "c" },)
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

export async function updateUser(userId: userType["id"], updatedUserObj: Partial<userType>, crudActionObj: crudActionObjType) {
    //validation
    userSchema.partial().parse(updatedUserObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("users", Object.keys(updatedUserObj) as tableColumns["users"][], crudActionObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    await db.update(users)
        .set({
            ...updatedUserObj
        })
        .where(eq(users.id, userId));
}

export async function deleteUser(userId: userType["id"], crudActionObj: crudActionObjType) {
    //auth check
    const accessTableResults = await ensureCanAccessTable("users", undefined, crudActionObj);
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //validation
    userSchema.shape.id.parse(userId)

    await db.delete(users).where(eq(users.id, userId));
}

export async function getSpecificUser(userId: userType["id"], crudActionObj: crudActionObjType, runAuth = true): Promise<userType | undefined> {
    if (runAuth) {
        //auth check
        const accessTableResults = await ensureCanAccessTable("users", undefined, crudActionObj);
        handleEnsureCanAccessTableResults(accessTableResults, "both")
    }

    userSchema.shape.id.parse(userId)

    const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return result
}

export async function getUsers(filter: tableFilterTypes<userType>, crudActionObj: crudActionObjType, getWith?: { [key in keyof userType]?: true }, limit = 50, offset = 0,): Promise<userType[]> {
    // Auth check
    const accessTableResults = await ensureCanAccessTable("users", undefined, crudActionObj);
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