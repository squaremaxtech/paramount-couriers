"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { deepClone } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../textInput/TextInput'
import { dbInvoiceType, newPreAlertSchema, newPreAlertType, preAlertSchema, preAlertType, wantedCrudObjType } from '@/types'
import { addPreAlert, deleteInvoiceOnPreAlert, updatePreAlert } from '@/serverFunctions/handlePreAlerts'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { useSession } from 'next-auth/react'
import FormToggleButton from '../formToggleButton/FormToggleButton'
import { allowedInvoiceFileTypes } from '@/types/uploadTypes'
import UploadFiles from '../uploadFiles/UploadFiles'
import { handleWithFiles } from '@/utility/handleWithFiles'
import useTableColumnAccess from '../useTableColumnAccess/UseTableColumnAccess'
import { filterTableObjectByColumnAccess } from '@/useful/usefulFunctions'
import { initialNewPreAlertFormObj } from '@/lib/initialFormData'

export default function AddEditPreAlert({ sentPreAlert, wantedCrudObj, submissionAction }: { sentPreAlert?: preAlertType, wantedCrudObj: wantedCrudObjType, submissionAction?: () => void }) {
    //make validation function that uses inital formObj replace if not allowed
    //maybe just check on server

    const [formObj, formObjSet] = useState<Partial<preAlertType>>(deepClone(sentPreAlert === undefined ? initialNewPreAlertFormObj : preAlertSchema.partial().parse(sentPreAlert)))

    const { data: session } = useSession()
    const { tableColumnAccess } = useTableColumnAccess({ tableName: "preAlerts", tableRecordObject: formObj, wantedCrudObj: wantedCrudObj })

    const [invoiceFormData, invoiceFormDataSet] = useState<FormData | null>(null)

    const [formErrors, formErrorsSet] = useState<Partial<{ [key in keyof preAlertType]: string }>>({})

    //handle changes from above
    useEffect(() => {
        if (sentPreAlert === undefined) return

        formObjSet(deepClone(preAlertSchema.partial().parse(sentPreAlert)))

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

            //new preAlert
            if (sentPreAlert === undefined) {
                //validate - replace with initial defaults if no access to "c"
                const filteredPreAlert = filterTableObjectByColumnAccess(tableColumnAccess, formObj, initialNewPreAlertFormObj)

                //files
                if (filteredPreAlert.invoices !== undefined) {
                    filteredPreAlert.invoices = await handleWithFiles(filteredPreAlert.invoices, invoiceFormData, "invoice")
                }

                const validatedNewPreAlert = newPreAlertSchema.parse(filteredPreAlert)

                //send up to server
                await addPreAlert(validatedNewPreAlert)

                toast.success("submitted")

                //reset
                invoiceFormDataSet(null)
                formObjSet(deepClone(initialNewPreAlertFormObj))

            } else {
                //validate
                const validatedPreAlert = preAlertSchema.parse(formObj)

                //auth
                const filteredPreAlert = filterTableObjectByColumnAccess(tableColumnAccess, validatedPreAlert)

                //files
                if (filteredPreAlert.invoices !== undefined) {
                    filteredPreAlert.invoices = await handleWithFiles(filteredPreAlert.invoices, invoiceFormData, "invoice", {
                        delete: async (dbWithFilesObjs) => {
                            if (sentPreAlert !== undefined) {
                                await deleteInvoiceOnPreAlert(sentPreAlert.id, dbWithFilesObjs, { crud: "d" })
                            }
                        }
                    })
                }

                //update
                await updatePreAlert(sentPreAlert.id, filteredPreAlert, wantedCrudObj)

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
            {formObj.userId !== undefined && tableColumnAccess["userId"] && session !== null && session.user.role !== "customer" && (//+ special rule for userId
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

                </>
            )}

            {formObj.acknowledged !== undefined && tableColumnAccess["acknowledged"] && (
                <>
                    <FormToggleButton
                        label='pre alert acknowledged?'
                        onClick={() => {
                            if (!tableColumnAccess["acknowledged"]) return

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

            {formObj.trackingNumber !== undefined && tableColumnAccess["trackingNumber"] && (
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

            {formObj.store !== undefined && tableColumnAccess["store"] && (
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

            {formObj.consignee !== undefined && tableColumnAccess["consignee"] && (
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

            {formObj.description !== undefined && tableColumnAccess["description"] && (
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

            {formObj.invoices !== undefined && tableColumnAccess["invoices"] && (
                <UploadFiles
                    accept='.pdf,.doc,.docx,.txt'
                    allowedFileTypes={allowedInvoiceFileTypes}
                    formDataSet={invoiceFormDataSet}
                    newDbRecordSetter={(dbFile) => {
                        //make new dbInvoice
                        const newDbInvoice: dbInvoiceType = {
                            dbFileType: "invoice",
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
                    dbWithFileObjs={formObj.invoices}
                    dbWithFileObjsSetter={dbWithFileObjs => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.invoices === undefined) return prevFormObj

                            newFormObj.invoices = [...dbWithFileObjs]

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