import { newPackageType, newPreAlertType, newUserType } from "@/types";

export const initialNewPreAlertObj: newPreAlertType = {
    userId: "",
    trackingNumber: "",
    store: "",
    consignee: "",
    description: "",
    packageValue: "0.00",
    invoices: [],
    acknowledged: false
}

export const initialNewPackageObj: newPackageType = {
    userId: "",//
    location: "on way to warehouse",//
    status: "in progress",//
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
    image: null,
    accessLevel: "regular",
    authorizedUsers: [],
    name: null,
    email: "",
    emailVerified: null,
}