import { newPackageType, newPreAlertType, newUserType } from "@/types";

export const initialNewPreAlertObj: newPreAlertType = {
    userId: "",
    trackingNumber: "",
    store: "",
    consignee: "",
    description: "",
    price: "0.00",
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
    price: "",
    invoices: [],//
    comments: "",
}

export const initialNewUserObj: newUserType = {
    image: null,
    accessLevel: "regular",
    authorizedUsers: [],
    name: null,
    email: "",
    emailVerified: null,
}