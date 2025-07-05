"use server"
import { db } from "@/db";
import { users } from "@/db/schema";
import { userSchema, userType } from "@/types";
import { sessionCheck } from "./handleAuth";
import { eq } from "drizzle-orm";

export async function getSpecificUser(userId: userType["id"]): Promise<userType | undefined> {
    await sessionCheck()

    userSchema.shape.id.parse(userId)

    const result = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return result
}