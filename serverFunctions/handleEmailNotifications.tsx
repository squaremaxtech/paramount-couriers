// "use server"

// import { crudBaseType, tableNames } from "@/types"

// const notificationsHtmlObj = {
//     users: {
//         "signup": "",
//         "emailVerified": "",
//         "profileUpdated": "",
//         "addressUpdated": "",
//     },
//     packages: {
//         "created": "",
//         "statusChanged": "",
//         "locationUpdated": "",
//         "readyForPickup": "",
//         "outForDelivery": "",
//         "delivered": "",
//         "needsAttention": "",
//         "paymentMade": "",
//     },
// } as const

// type sendNotificationEmailObjType = {
//     tableName: tableNames,
//     action: crudBaseType,
// }

// export async function sendNotificationEmail(sendNotificationEmailObj: sendNotificationEmailObjType) {
//     //sort by table name
//     //sort by action
//     //grab html from notificationsHtmlObj - replace message with right variables
//     //customize html based on table - same style, but title...etc customized
//     //send email

// }