"use server"

import { crudBaseType, packageType, userType } from "@/types"
import { getSpecificUser } from "./handleUsers"
import { sendNodeEmail } from "./handleNodeEmails"
import dotenv from "dotenv"
import { emailTemplateGlobalStyle } from "@/lib/emailTemplates"

dotenv.config({ path: ".env.local" })

const companyEmail = process.env.EMAIL

const notificationsHtmlObj = {
    users: {
        signup: "Welcome aboard! Your Paramount Couriers account has been successfully created.",
        emailVerified: "Your email address has been verified successfully.",
        addressUpdated: "Your delivery address has been updated.",
        deliveryMethodUpdated: "Your package delivery method has been updated.",
        phoneNumberUpdated: "Your phone number has been updated.",
    },
    packages: {
        created: "A new package has been added to your account.",
        statusChanged: "Your package status has been updated.",
        locationUpdated: "The package location has been updated.",
        readyForPickup: "Your package is ready for pickup.",
        needsAttention: "Your package requires your attention — please review it.",
        paymentMade: "Your payment has been successfully recorded.",
    },
} as const

type sendNotificationEmailObjType = {
    table:
    | {
        name: "users"
        oldUser?: userType
        updatedUser: userType
    }
    | {
        name: "packages"
        oldPackage?: packageType
        updatedPackage: packageType
    }
    action: crudBaseType
    sendTo:
    | {
        type: "id"
        userId: userType["id"]
    }
    | {
        type: "email"
        email: string
    }
}

export async function sendNotificationEmail(sendNotificationEmailObj: sendNotificationEmailObjType) {
    let userEmail = null

    if (sendNotificationEmailObj.sendTo.type === "email") {
        userEmail = sendNotificationEmailObj.sendTo.email

    } else if (sendNotificationEmailObj.sendTo.type === "id") {
        const resultUser = await getSpecificUser(sendNotificationEmailObj.sendTo.userId, { action: "r" }, false)
        if (resultUser === undefined) throw new Error(`not seeing user id: ${sendNotificationEmailObj.sendTo.userId}`)

        userEmail = resultUser.email

    } else {
        throw new Error("Invalid sendTo type")
    }

    //ensure email there
    if (userEmail === null) throw new Error("not seeing user email")

    let subject = "Paramount Couriers Notification"
    let messages: string[] = []
    let headerInfo = ""

    if (sendNotificationEmailObj.table.name === "packages") {
        const pkg = sendNotificationEmailObj.table.updatedPackage

        headerInfo = `
<h2 style="margin-bottom:10px;">📦 Package Details</h2>
<p><span class="label">Description:</span> ${pkg.description}</p>
<p><span class="label">Payment:</span> ${pkg.payment}</p>
<p><span class="label">Tracking Number:</span> ${pkg.trackingNumber}</p>
<p><span class="label">Weight:</span> ${pkg.weight} lbs</p>
`
        const tableMessageObj = notificationsHtmlObj[sendNotificationEmailObj.table.name]

        if (sendNotificationEmailObj.action === "c") {
            messages.push(tableMessageObj["created"])

        } else if (sendNotificationEmailObj.action === "u") {
            if (sendNotificationEmailObj.table.oldPackage === undefined) throw new Error("need to send old package to compare updates")

            const oldPackage: packageType = sendNotificationEmailObj.table.oldPackage
            const updatedPackage: packageType = sendNotificationEmailObj.table.updatedPackage

            if (updatedPackage.needAttention) messages.push(tableMessageObj["needsAttention"])

            if (updatedPackage.status !== oldPackage.status) messages.push(tableMessageObj["statusChanged"])

            if (updatedPackage.location !== oldPackage.location) {
                messages.push(tableMessageObj["locationUpdated"])

                if (updatedPackage.location === "ready for pickup") {
                    messages.push(tableMessageObj["readyForPickup"])
                }
            }

            if (parseFloat(updatedPackage.payment) > parseFloat(oldPackage.payment)) {
                messages.push(tableMessageObj["paymentMade"])
            }
        }

        subject = "Package Update from Paramount Couriers"

    } else if (sendNotificationEmailObj.table.name === "users") {
        const userMsg = notificationsHtmlObj.users

        if (sendNotificationEmailObj.action === "c") {
            messages.push(userMsg.signup)

        } else if (sendNotificationEmailObj.action === "u") {
            if (sendNotificationEmailObj.table.oldUser === undefined) throw new Error("need to send old user to compare updates")

            const oldUser = sendNotificationEmailObj.table.oldUser
            const updatedUser = sendNotificationEmailObj.table.updatedUser

            if (updatedUser.emailVerified && !oldUser.emailVerified) {
                messages.push(userMsg.emailVerified)
            }

            if (JSON.stringify(updatedUser.address) !== JSON.stringify(oldUser.address)) {
                messages.push(userMsg.addressUpdated)
            }

            if (updatedUser.packageDeliveryMethod !== oldUser.packageDeliveryMethod) {
                messages.push(userMsg.deliveryMethodUpdated)
            }

            if (updatedUser.phoneNumber !== oldUser.phoneNumber) {
                messages.push(userMsg.phoneNumberUpdated)
            }
        }

        subject = "Account Update from Paramount Couriers"

    } else {
        throw new Error("Invalid table name")
    }

    if (messages.length === 0) return

    if (companyEmail === undefined) throw new Error("not seeing company email")

    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${subject}</title>
<style>${emailTemplateGlobalStyle}</style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Paramount Couriers</h1>
    </div>

    <div class="content">
      ${headerInfo}

      <h3 style="margin-top:20px;">Notifications</h3>

      <div class="message-container">
        ${messages
            .map(
                (eachMessage) => `
          <div class="message-card">
            <div class="message-card-bubble"></div>

            <div class="message-card-content">
              <p>${eachMessage}</p>
              
              <p class="timestamp">${new Date().toLocaleString()}</p>
            </div>
          </div>`
            )
            .join("\n")}
      </div>
    </div>

    <div class="footer">
      <p>This message was sent by Paramount Couriers.</p>
      <p>Thank you for choosing us for your delivery needs.</p>
    </div>
  </div>
</body>
</html>
`

    // Send email
    await sendNodeEmail({
        sendTo: userEmail,
        replyTo: companyEmail,
        subject,
        html: htmlEmail,
    })
}