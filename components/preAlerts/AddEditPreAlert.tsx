"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { deepClone } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../textInput/TextInput'
import { dbInvoiceType, newPreAlertSchema, newPreAlertType, preAlertSchema, preAlertType, updatePreAlertSchema } from '@/types'
import { addPreAlert, deleteInvoiceOnPreAlert, updatePreAlert } from '@/serverFunctions/handlePreAlerts'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { useSession } from 'next-auth/react'
import FormToggleButton from '../formToggleButton/FormToggleButton'
import { allowedInvoiceFileTypes } from '@/types/uploadTypes'
import UploadFiles from '../uploadFiles/UploadFiles'

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

    const [formErrors, formErrorsSet] = useState<Partial<{ [key in keyof preAlertType]: string }>>({})

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

    async function handleDbInvoicesUpload(dbInvoices: dbInvoiceType[]) {
        //handle files 
        const dbInvoicesToUpload = dbInvoices.filter(eachDbInvoice => eachDbInvoice.file.status === "to-upload")
        if (dbInvoicesToUpload.length > 0 && invoiceFormData !== null) {
            //set upload type
            invoiceFormData.append("type", "invoices")

            const response = await fetch(`/api/files/upload`, {
                method: 'POST',
                body: invoiceFormData,
            })
            const seenNamesObj = await response.json()
            const seenUploadedFiles = seenNamesObj.names

            toast.success("invoices uploaded")

            dbInvoices = dbInvoices.map(eachDbInvoice => {
                if (seenUploadedFiles.includes(eachDbInvoice.file.src)) {
                    //react obj refresher
                    eachDbInvoice.file = { ...eachDbInvoice.file }

                    eachDbInvoice.file.uploaded = true
                }

                return eachDbInvoice
            })
        }

        const dbInvoicesToDelete = dbInvoices.filter(eachDbInvoice => eachDbInvoice.file.status === "to-delete")
        if (dbInvoicesToDelete.length > 0) {
            if (sentPreAlert !== undefined) {
                const deleteOnServer = dbInvoicesToDelete.filter(eachDbInvoice => eachDbInvoice.file.uploaded)

                //delete on server
                await deleteInvoiceOnPreAlert(sentPreAlert.id, deleteOnServer)
            }

            //delete locally
            dbInvoices = dbInvoices.filter(eachDbInvoice => dbInvoicesToDelete.find(eachDbInvoiceToDelete => eachDbInvoiceToDelete.file.src === eachDbInvoice.file.src) === undefined)
        }

        return [...dbInvoices]
    }

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //new preAlert
            if (sentPreAlert === undefined) {
                const validatedNewPreAlert = newPreAlertSchema.parse(formObj)

                //files
                validatedNewPreAlert.invoices = await handleDbInvoicesUpload(validatedNewPreAlert.invoices)

                //send up to server
                await addPreAlert(validatedNewPreAlert)

                toast.success("submitted")

                //reset
                invoiceFormDataSet(null)
                formObjSet(deepClone(initialFormObj))

            } else {
                //validate
                const validatedUpdatedPreAlert = updatePreAlertSchema.parse(formObj)

                //files
                validatedUpdatedPreAlert.invoices = await handleDbInvoicesUpload(validatedUpdatedPreAlert.invoices)

                //update
                await updatePreAlert(sentPreAlert.id, validatedUpdatedPreAlert)

                toast.success("pre alert updated")
            }

            if (submissionAction !== undefined) {
                submissionAction()
            }

        } catch (error) {
            consoleAndToastError(error)
        }
    }

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
                <UploadFiles
                    accept='.pdf,.doc,.docx,.txt'
                    allowedFileTypes={allowedInvoiceFileTypes}
                    formDataSet={invoiceFormDataSet}
                    newDbRecordSetter={(dbFile) => {
                        //make new dbInvoice
                        const newDbInvoice: dbInvoiceType = {
                            type: "shipping",
                            file: dbFile
                        }

                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.invoices === undefined) return prevFormObj

                            newFormObj.invoices = [...newFormObj.invoices, newDbInvoice]

                            return newFormObj
                        })
                    }}
                    dbUploadedFiles={formObj.invoices.map(eachDbInvoice => eachDbInvoice.file)}
                    dbUploadedFilesSetter={(dbUpdatedFile, index) => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.invoices === undefined) return prevFormObj

                            newFormObj.invoices[index].file = { ...dbUpdatedFile }

                            return newFormObj
                        })
                    }}
                />
            )}

            <button className='button1' style={{ justifySelf: "center" }}
                onClick={handleSubmit}
            >{sentPreAlert !== undefined ? "update" : "submit"}</button>
        </form>
    )
}