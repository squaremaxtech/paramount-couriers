import { newPreAlertType } from "@/types";

export const initialNewPreAlertFormObj: newPreAlertType = {
    userId: "",
    trackingNumber: "",
    store: "",
    consignee: "",
    description: "",
    price: "0.00",
    invoices: [],
    acknowledged: false
}