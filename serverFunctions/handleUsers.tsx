"use server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { newUserSchema, newUserType, tableFilterTypes, updateUserSchema, userSchema, userType } from "@/types"
import { and, desc, eq, SQLWrapper } from "drizzle-orm"

export async function addUser(newUserObj: newUserType) {
    //security check 

    //validation
    newUserSchema.parse(newUserObj)

    //add new request
    await db.insert(users).values({
        ...newUserObj
    })
}

export async function updateUser(userId: userType["id"], updatedUserObj: Partial<userType>) {
    //security check  

    updateUserSchema.partial().parse(updatedUserObj)

    await db.update(users)
        .set({
            ...updatedUserObj
        })
        .where(eq(users.id, userId));
}

export async function deleteUser(userId: userType["id"]) {
    //validation
    userSchema.shape.id.parse(userId)

    await db.delete(users).where(eq(users.id, userId));
}

export async function getSpecificUser(userId: userType["id"]): Promise<userType | undefined> {
    //security check

    userSchema.shape.id.parse(userId)

    const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return result
}

export async function getUsers(filter: tableFilterTypes<userType>, limit = 50, offset = 0): Promise<userType[]> {
    // Collect conditions dynamically
    const whereClauses: SQLWrapper[] = []

    //validate filter
    // userSchema.partial().parse(filter)

    if (filter.id !== undefined) {
        whereClauses.push(eq(users.id, filter.id))
    }

    if (filter.name !== undefined) {
        const seenName = filter.name === null ? "" : filter.name
        whereClauses.push(eq(users.name, seenName))
    }

    if (filter.role !== undefined) {
        whereClauses.push(eq(users.role, filter.role))
    }

    if (filter.accessLevel !== undefined) {
        whereClauses.push(eq(users.accessLevel, filter.accessLevel))
    }

    const results = await db.query.users.findMany({
        where: and(...whereClauses),
        limit: limit,
        offset: offset,
    });

    return results
}