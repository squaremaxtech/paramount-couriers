"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { deepClone } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../textInput/TextInput'
import { z } from "zod"
import { dbInvoiceType, newPreAlertSchema, newPreAlertType, preAlertSchema, preAlertType, updatePreAlertSchema, uploadNamesResponseSchema } from '@/types'
import { addPreAlerts, deletePreAlertInvoices, updatePreAlerts } from '@/serverFunctions/handlePreAlerts'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { useSession } from 'next-auth/react'
import FormToggleButton from '../formToggleButton/FormToggleButton'
import { allowedInvoiceFileTypes, maxBodyToServerSize, maxDocumentUploadSize } from '@/types/uploadTypes'
import { convertBtyes } from '@/useful/usefulFunctions'

export default function AddEditPreAlert({ sentPreAlert, submissionAction }: { sentPreAlert?: preAlertType, submissionAction?: () => void }) {
    //on success submit upload files
    //on edit check sucess - identify differences, delete from server/upload

    const initialFormObj: newPreAlertType = {
        userId: "",
        trackingNumber: "",
        store: "",
        consignee: "",
        description: "",
        price: "0.00",
        invoices: [],
        acknowledged: false
    }

    //assign either a new form, or the safe values on an update form
    const [formObj, formObjSet] = useState<Partial<newPreAlertType>>(deepClone(sentPreAlert === undefined ? initialFormObj : updatePreAlertSchema.parse(sentPreAlert)))

    const [invoiceFormData, invoiceFormDataSet] = useState<FormData | null>(null)
    const [deleteFromServerInvoiceList, deleteFromServerInvoiceListSet] = useState<dbInvoiceType["src"][]>([])

    type preAlertKeys = keyof preAlertType
    const [formErrors, formErrorsSet] = useState<Partial<{ [key in preAlertKeys]: string }>>({})

    const { data: session } = useSession()

    //handle changes from above
    useEffect(() => {
        if (sentPreAlert === undefined) return

        formObjSet(deepClone(updatePreAlertSchema.parse(sentPreAlert)))

    }, [sentPreAlert])

    //add customer user id to form Obj
    useEffect(() => {
        if (session === null) return

        if (session.user.role === "customer") {

            formObjSet(prevFormObj => {
                const newFormObj = { ...prevFormObj }
                newFormObj.userId = session.user.id
                return newFormObj
            })
        }
    }, [session])

    function checkIfValid(seenFormObj: Partial<preAlertType>, seenName: keyof preAlertType) {
        // @ts-expect-error type
        const testSchema = preAlertSchema.pick({ [seenName]: true }).safeParse(seenFormObj);

        if (testSchema.success) {//worked
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }
                delete newObj[seenName]

                return newObj
            })

        } else {
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }

                let errorMessage = ""

                JSON.parse(testSchema.error.message).forEach((eachErrorObj: Error) => {
                    errorMessage += ` ${eachErrorObj.message}`
                })

                newObj[seenName] = errorMessage

                return newObj
            })
        }
    }

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //handle files
            //delete from server
            if (deleteFromServerInvoiceList.length > 0 && sentPreAlert !== undefined) {
                //reset on server
                await deletePreAlertInvoices(sentPreAlert.id)
            }

            //add to server
            if (invoiceFormData !== null) {
                const response = await fetch(`/api/documents/upload`, {
                    method: 'POST',
                    body: invoiceFormData,
                })

                toast.success("invoices uploaded")

                //array of file names
                const seenNames = uploadNamesResponseSchema.parse(await response.json());

                const newFormInvoices: preAlertType["invoices"] = seenNames.names.map(eachName => {
                    return {
                        createdAt: new Date(),
                        src: eachName
                    }
                })

                formObj.invoices = [...newFormInvoices]
            }

            //new preAlert
            if (sentPreAlert === undefined) {
                const validatedNewPreAlert = newPreAlertSchema.parse(formObj)

                //send up to server
                await addPreAlerts(validatedNewPreAlert)

                toast.success("submitted")

                //reset
                invoiceFormDataSet(null)
                formObjSet(deepClone(initialFormObj))

            } else {
                //validate
                const validatedUpdatedPreAlert = updatePreAlertSchema.parse(formObj)

                //update
                await updatePreAlerts(sentPreAlert.id, validatedUpdatedPreAlert)

                toast.success("pre alert updated")
            }

            if (submissionAction !== undefined) {
                submissionAction()
            }

        } catch (error) {
            consoleAndToastError(error)
        }
    }

    console.log(`$invoiceFormData`, invoiceFormData);

    return (
        <form className={styles.form} action={() => { }}>
            {session !== null && session.user.role !== "customer" && formObj.userId !== undefined && (
                <>
                    <TextInput
                        name={"userId"}
                        value={formObj.userId}
                        type={"text"}
                        label={"user id"}
                        placeHolder={"enter user id"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.userId === undefined) return prevFormObj

                                newFormObj.userId = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "userId") }}
                        errors={formErrors["userId"]}
                    />

                    {formObj.acknowledged !== undefined && (
                        <>
                            <FormToggleButton
                                label='pre alert acknowledged?'
                                onClick={() => {
                                    formObjSet(prevFormObj => {
                                        const newFormObj = { ...prevFormObj }
                                        if (newFormObj.acknowledged === undefined) return prevFormObj

                                        newFormObj.acknowledged = !newFormObj.acknowledged

                                        return newFormObj
                                    })
                                }}
                                value={formObj.acknowledged}
                                errors={formErrors["acknowledged"]}
                            />
                        </>
                    )}
                </>
            )}

            {formObj.trackingNumber !== undefined && (
                <>
                    <TextInput
                        name={"trackingNumber"}
                        value={formObj.trackingNumber}
                        type={"text"}
                        label={"tracking number"}
                        placeHolder={"enter tracking number"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.trackingNumber === undefined) return prevFormObj

                                newFormObj.trackingNumber = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "trackingNumber") }}
                        errors={formErrors["trackingNumber"]}
                    />
                </>
            )}

            {formObj.store !== undefined && (
                <>
                    <TextInput
                        name={"store"}
                        value={formObj.store}
                        type={"text"}
                        label={"store"}
                        placeHolder={"enter store"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.store === undefined) return prevFormObj

                                newFormObj.store = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "store") }}
                        errors={formErrors["store"]}
                    />
                </>
            )}

            {formObj.consignee !== undefined && (
                <>
                    <TextInput
                        name={"consignee"}
                        value={formObj.consignee}
                        type={"text"}
                        label={"consignee"}
                        placeHolder={"consignee"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.consignee === undefined) return prevFormObj

                                newFormObj.consignee = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "consignee") }}
                        errors={formErrors["consignee"]}
                    />
                </>
            )}

            {formObj.description !== undefined && (
                <>
                    <TextInput
                        name={"description"}
                        value={formObj.description}
                        type={"text"}
                        label={"description"}
                        placeHolder={"enter description"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.description === undefined) return prevFormObj

                                newFormObj.description = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "description") }}
                        errors={formErrors["description"]}
                    />
                </>
            )}

            {formObj.invoices !== undefined && (
                <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)" }}>
                    <button className='button1'>
                        <label htmlFor='invoiceUpload' style={{ cursor: "pointer" }}>
                            upload
                        </label>
                    </button>

                    <input id='invoiceUpload' type="file" placeholder='Upload invoices' multiple={true} accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }}
                        onChange={(e) => {
                            if (!e.target.files) return

                            let totalUploadSize = 0
                            const uploadedFiles = e.target.files
                            const formData = new FormData();

                            console.log(`$got here`);

                            for (let index = 0; index < uploadedFiles.length; index++) {
                                const file = uploadedFiles[index];

                                console.log(`$file`, file);

                                //validation
                                if (!allowedInvoiceFileTypes.includes(file.type)) {
                                    console.log(`$na type`);
                                    toast.error(`File ${file.name} is not a valid file type to upload.`);
                                    continue;
                                }

                                // Check the file size
                                if (file.size > maxDocumentUploadSize) {
                                    console.log(`$na size`);
                                    toast.error(`File ${file.name} is too large. Maximum size is ${convertBtyes(maxDocumentUploadSize, "mb")} MB`);
                                    continue;
                                }

                                //add file size to totalUploadSize
                                totalUploadSize += file.size

                                formData.append(`file${index}`, file);
                            }

                            if (totalUploadSize > maxBodyToServerSize) {
                                console.log(`$na body size`);
                                toast.error(`Please upload less than ${convertBtyes(maxBodyToServerSize, "mb")} MB at a time`);
                                return
                            }

                            console.log(`$formData sent`, formData);
                            invoiceFormDataSet(formData)
                        }}
                    />

                    <div style={{ display: "flex", alignItems: "center" }}>
                        {invoiceFormData !== null && (
                            <p>
                                {Array.from(invoiceFormData.entries())
                                    .map(([, value]) => {
                                        const file = value as File;
                                        return file.name;
                                    })
                                    .join(", ")}
                            </p>
                        )}

                        {(formObj.invoices !== undefined && formObj.invoices.length > 0) && (
                            <button
                                onClick={async () => {
                                    //reset local
                                    invoiceFormDataSet(null)

                                    if (formObj.invoices !== undefined) {
                                        deleteFromServerInvoiceListSet(formObj.invoices.map(eachInvoice => eachInvoice.src))
                                    }
                                }}
                            >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <button className='button1' style={{ justifySelf: "center" }}
                onClick={handleSubmit}
            >{sentPreAlert !== undefined ? "update" : "submit"}</button>
        </form>
    )
}