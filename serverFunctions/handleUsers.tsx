"use server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { newUserSchema, newUserType, userSchema, userType, tableColumns, tableFilterTypes, crudActionObjType, userSchemaForFilter } from "@/types"
import { and, eq, SQLWrapper } from "drizzle-orm"
import { ensureCanAccessTable } from "./handleAuth"
import { handleEnsureCanAccessTableResults, makeWhereClauses } from "@/utility/utility"
import { filterTableObjectByColumnAccess } from "@/useful/usefulFunctions"
import { initialNewUserObj } from "@/lib/initialFormData"
import { sendNotificationEmail } from "./handleEmailNotifications"

export async function addUser(newUserObj: newUserType) {
    const accessTableResults = await ensureCanAccessTable("users", Object.keys(newUserObj) as tableColumns["users"][], { action: "c" },)
    handleEnsureCanAccessTableResults(accessTableResults, "table")

    //validate on server as well - if no rights then it'll replace
    const filteredUser = filterTableObjectByColumnAccess(accessTableResults.tableColumnAccess, newUserObj, initialNewUserObj)

    //validation
    const validatedUser = newUserSchema.parse(filteredUser)

    //add new request
    const [newUser] = await db.insert(users).values({
        ...validatedUser
    }).returning()

    //notifs
    sendNotificationEmail({
        table: { name: "users", updatedUser: newUser },
        action: "c",
        sendTo: newUser.email === null ? { type: "id", userId: newUser.id } : { type: "email", email: newUser.email }
    })
}

export async function updateUser(userId: userType["id"], updatedUserObj: Partial<userType>, crudActionObj: crudActionObjType) {
    //validation
    userSchema.partial().parse(updatedUserObj)

    //auth
    const accessTableResults = await ensureCanAccessTable("users", Object.keys(updatedUserObj) as tableColumns["users"][], crudActionObj)
    handleEnsureCanAccessTableResults(accessTableResults, "both")

    //get current user
    const currentUser = await getSpecificUser(userId, crudActionObj)
    if (currentUser === undefined) throw new Error(`not seeing user for id ${userId}`)

    const [updatedUser] = await db.update(users)
        .set({
            ...updatedUserObj
        })
        .where(eq(users.id, userId)).returning();

    //notifs
    const updatedEmail = updatedUser.email
    sendNotificationEmail({
        table: { name: "users", oldUser: currentUser, updatedUser: updatedUser },
        action: "u",
        sendTo: updatedEmail === null ? { type: "id", userId: updatedUser.id } : { type: "email", email: updatedEmail }
    })

    return updatedUser
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
    const whereClauses: SQLWrapper[] = makeWhereClauses(userSchemaForFilter.partial(), filter, users)

    const results = await db.query.users.findMany({
        where: and(...whereClauses),
        limit,
        offset,
        with: getWith
    });

    return results;
}