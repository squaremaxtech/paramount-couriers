import { newPackageType, newUserType } from "@/types";

export const initialNewPackageObj: newPackageType = {
    userId: "",//
    location: "on way to warehouse",//
    status: "pre-alerted",//
    trackingNumber: "",//
    images: [],//
    weight: "0.00",
    payment: "0.00",
    store: "",
    consignee: "",
    description: "",
    packageValue: "0.00",
    cifValue: "0.00",
    charges: {
        freight: "0.00",
        fuel: "0.00",
        insurance: "0.00",
    },
    invoices: [],//
    comments: "",
    needAttention: false
}

export const initialNewUserObj: newUserType = {
    role: "employee",
    accessLevel: "regular",
    authorizedUsers: [],
    address: null,
    packageDeliveryMethod: "Kingston",

    name: "",
    email: "",
    emailVerified: null,
    image: "",
}