"use server"

import { crudBaseType, packageType, userType } from "@/types"
import { getSpecificUser } from "./handleUsers"
import { getSpecificPackage } from "./handlePackages"
import { sendNodeEmail } from "./handleNodeEmails"
import dotenv from 'dotenv';

dotenv.config({ path: ".env.local" });

const ourEmail = process.env.EMAIL

const notificationsHtmlObj = {
    users: {
        "signup": "",
        "emailVerified": "",
        "profileUpdated": "",
        "addressUpdated": "",
    },
    packages: {
        "created": "package created",//
        "statusChanged": "status changed",//
        "locationUpdated": "location got updated chief",
        "readyForPickup": "ready!",
        "outForDelivery": "out for delivery",
        "delivered": "deleivered",
        "needsAttention": "needs your attention",
        "paymentMade": "payment made!",
    },
} as const

type sendNotificationEmailObjType = {
    table: {
        name: "users",
        oldUser?: userType,
        updatedUser: userType,
    } | {
        name: "packages",
        oldPackage?: packageType,
        updatedPackage: packageType,
    },
    action: crudBaseType,
    sendTo: {
        type: "id",
        userId: userType["id"]
    } | {
        type: "email",
        email: string
    },
}

export async function sendNotificationEmail(sendNotificationEmailObj: sendNotificationEmailObjType) {
    //sort by table name
    //sort by action
    //grab html from notificationsHtmlObj - replace message with right variables
    //customize html based on table - same style, but title...etc customized
    //send email

    let userEmail = null
    let seenUser: userType | null = null

    if (sendNotificationEmailObj.sendTo.type === "email") {
        userEmail = sendNotificationEmailObj.sendTo.email

    } else if (sendNotificationEmailObj.sendTo.type === "id") {
        const resultUser = await getSpecificUser(sendNotificationEmailObj.sendTo.userId, { action: "r" }, false)
        if (resultUser === undefined) throw new Error(`not seeing user id: ${sendNotificationEmailObj.sendTo.userId}`)

        seenUser = resultUser
        userEmail = resultUser.email
    } else {
        throw new Error("Invalid sendTo type")
    }

    if (userEmail === null) throw new Error("not seeing user email")

    let message: string | null = null
    let subject = "new email notif"

    if (sendNotificationEmailObj.table.name === "packages") {
        const tableMessageObj = notificationsHtmlObj[sendNotificationEmailObj.table.name]

        if (sendNotificationEmailObj.action === "c") {
            message = tableMessageObj["created"]

        } else if (sendNotificationEmailObj.action === "u") {
            if (sendNotificationEmailObj.table.oldPackage === undefined) throw new Error("need to send old package to compare updates")
            const oldPackage: packageType = sendNotificationEmailObj.table.oldPackage
            const updatedPackage: packageType = sendNotificationEmailObj.table.updatedPackage

            //check for status change
            if (updatedPackage.status !== oldPackage.status) {
                message = tableMessageObj["statusChanged"]
            }
        }

    } else if (sendNotificationEmailObj.table.name === "users") {

    } else {
        throw new Error("Invalid table name")
    }

    if (message === null) {
        console.log(`$message null`);

        return
    }

    if (ourEmail === undefined) throw new Error("not seeing company email")

    //send email
    await sendNodeEmail({
        sendTo: userEmail,
        replyTo: ourEmail,
        subject: subject,
        html: message
    })
}