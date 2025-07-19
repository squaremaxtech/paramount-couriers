"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { deepClone, formatLocalDateTime } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../textInput/TextInput'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { allowedImageFileTypes, allowedInvoiceFileTypes } from '@/types/uploadTypes'
import { dbImageType, dbInvoiceType, locationOptions, locationType, newPackageSchema, newPackageType, packageSchema, packageType, preAlertType, searchObjType, statusOptions, statusType, updatePackageSchema, userType } from '@/types'
import { addPackage, deleteImageOnPackage, deleteInvoiceOnPackage, updatePackage } from '@/serverFunctions/handlePackages'
import ShowMore from '../showMore/ShowMore'
import Search from '../search/Search'
import { getUsers } from '@/serverFunctions/handleUsers'
import ViewUser from '../users/ViewUser'
import { getPreAlerts, updatePreAlert } from '@/serverFunctions/handlePreAlerts'
import UploadFiles from '../uploadFiles/UploadFiles'

export default function AddEditPackage({ sentPackage, submissionAction }: { sentPackage?: packageType, submissionAction?: () => void }) {
    const initialFormObj: newPackageType = {
        userId: "",//
        location: "on way to warehouse",//
        status: "in progress",//
        trackingNumber: "",//
        images: [],//
        weight: "",
        payment: "",
        store: "",
        consignee: "",
        description: "",
        price: "",
        invoices: [],//
        comments: "",
    }

    const [formObj, formObjSet] = useState<Partial<newPackageType>>(deepClone(sentPackage === undefined ? initialFormObj : updatePackageSchema.parse(sentPackage)))

    const [formErrors, formErrorsSet] = useState<Partial<{ [key in keyof packageType]: string }>>({})

    const [invoiceFormData, invoiceFormDataSet] = useState<FormData | null>(null)
    const [imageFormData, imageFormDataSet] = useState<FormData | null>(null)

    const [usersSearchObj, usersSearchObjSet] = useState<searchObjType<userType>>({
        searchItems: [],
    })

    const [preAlertsSearchObj, preAlertsSearchObjSet] = useState<searchObjType<preAlertType>>({
        searchItems: [],
    })

    //handle changes from above
    useEffect(() => {
        if (sentPackage === undefined) return

        formObjSet(deepClone(updatePackageSchema.parse(sentPackage)))

    }, [sentPackage])

    function checkIfValid(seenFormObj: Partial<packageType>, seenName: keyof packageType) {
        // @ts-expect-error type
        const testSchema = packageSchema.pick({ [seenName]: true }).safeParse(seenFormObj);

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
            if (sentPackage !== undefined) {
                const deleteOnServer = dbInvoicesToDelete.filter(eachDbInvoice => eachDbInvoice.file.uploaded)

                //delete on server
                await deleteInvoiceOnPackage(sentPackage.id, deleteOnServer)
            }

            //delete locally
            dbInvoices = dbInvoices.filter(eachDbInvoice => dbInvoicesToDelete.find(eachDbInvoiceToDelete => eachDbInvoiceToDelete.file.src === eachDbInvoice.file.src) === undefined)
        }

        return [...dbInvoices]
    }

    async function handleDbImageUpload(dbdbImages: dbImageType[]) {
        //handle files 
        const dbdbImagesToUpload = dbdbImages.filter(eachDbImage => eachDbImage.file.status === "to-upload")
        if (dbdbImagesToUpload.length > 0 && imageFormData !== null) {
            //set upload type
            imageFormData.append("type", "images")

            const response = await fetch(`/api/files/upload`, {
                method: 'POST',
                body: imageFormData,
            })
            const seenNamesObj = await response.json()
            const seenUploadedFiles = seenNamesObj.names

            toast.success("dbImages uploaded")

            dbdbImages = dbdbImages.map(eachDbImage => {
                if (seenUploadedFiles.includes(eachDbImage.file.src)) {
                    //react obj refresher
                    eachDbImage.file = { ...eachDbImage.file }
                    eachDbImage.file.uploaded = true
                }

                return eachDbImage
            })
        }

        const dbdbImagesToDelete = dbdbImages.filter(eachDbImage => eachDbImage.file.status === "to-delete")
        if (dbdbImagesToDelete.length > 0) {
            if (sentPackage !== undefined) {
                const deleteOnServer = dbdbImagesToDelete.filter(eachDbImage => eachDbImage.file.uploaded)

                //delete on server
                await deleteImageOnPackage(sentPackage.id, deleteOnServer)
            }

            //delete locally
            dbdbImages = dbdbImages.filter(eachDbImage => dbdbImagesToDelete.find(eachDbImageToDelete => eachDbImageToDelete.file.src === eachDbImage.file.src) === undefined)
        }

        return [...dbdbImages]
    }

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //new package
            if (sentPackage === undefined) {
                const validatedNewPackage = newPackageSchema.parse(formObj)

                //files
                validatedNewPackage.invoices = await handleDbInvoicesUpload(validatedNewPackage.invoices)
                validatedNewPackage.images = await handleDbImageUpload(validatedNewPackage.images)

                //send up to server
                await addPackage(validatedNewPackage)

                toast.success("submitted")

                //reset
                formObjSet(deepClone(initialFormObj))

            } else {
                //validate
                const validatedUpdatedPackage = updatePackageSchema.parse(formObj)

                //files
                validatedUpdatedPackage.invoices = await handleDbInvoicesUpload(validatedUpdatedPackage.invoices)
                validatedUpdatedPackage.images = await handleDbImageUpload(validatedUpdatedPackage.images)

                //update
                await updatePackage(sentPackage.id, validatedUpdatedPackage)

                toast.success("package updated")
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
            <ShowMore
                label='pre alerts'
                content={(
                    <div className='container'>
                        <Search
                            searchObj={preAlertsSearchObj}
                            searchObjSet={preAlertsSearchObjSet}
                            searchFunc={async (seenFilters) => {
                                return await getPreAlerts({ ...seenFilters }, preAlertsSearchObj.limit, preAlertsSearchObj.offset)
                            }}
                            showPage={true}
                            searchFilters={{
                                trackingNumber: {
                                    value: "",
                                },
                                consignee: {
                                    value: "",
                                },
                                acknowledged: {
                                    value: false,
                                }
                            }}
                        />

                        {preAlertsSearchObj.searchItems.length > 0 && (
                            <div className='container'>
                                <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", gridAutoFlow: "column", gridAutoColumns: "min(50%, 200px)", overflow: "auto", gridTemplateRows: "300px" }} className='snap'>
                                    {preAlertsSearchObj.searchItems.map(eachPreAlert => {
                                        return (
                                            <div key={eachPreAlert.id} className='container'>
                                                {eachPreAlert.fromUser !== undefined && (
                                                    <div className='container' style={{ gap: "var(--spacingS)" }}>
                                                        <p>from user</p>

                                                        <p>name: {eachPreAlert.fromUser.name}</p>

                                                        <p>email: {eachPreAlert.fromUser.email}</p>
                                                    </div>
                                                )}

                                                <p>tracking number: {eachPreAlert.trackingNumber}</p>

                                                <p>store: {eachPreAlert.store}</p>

                                                <p>consignee: {eachPreAlert.consignee}</p>

                                                <p>price: {eachPreAlert.price}</p>

                                                <p>acknowledged: {eachPreAlert.acknowledged.toString()}</p>

                                                <p>{formatLocalDateTime(eachPreAlert.dateCreated)}</p>

                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            if (eachPreAlert.acknowledged) {
                                                                //deselect
                                                                handleUpdatePreAlert(false)

                                                            } else {
                                                                //select and use

                                                                //add onto form obj everything wanted
                                                                formObjSet(prevFormObj => {
                                                                    const newFormObj = { ...prevFormObj }

                                                                    //assign proper user to package owner and rest of values
                                                                    newFormObj.userId = eachPreAlert.userId
                                                                    newFormObj.trackingNumber = eachPreAlert.trackingNumber
                                                                    newFormObj.store = eachPreAlert.store
                                                                    newFormObj.description = eachPreAlert.description
                                                                    newFormObj.price = eachPreAlert.price
                                                                    newFormObj.invoices = eachPreAlert.invoices
                                                                    newFormObj.trackingNumber = eachPreAlert.trackingNumber

                                                                    return newFormObj
                                                                })

                                                                //asknowledge pre alert
                                                                handleUpdatePreAlert(true)

                                                                toast.success(`preAlert selected`)
                                                            }

                                                        } catch (error) {
                                                            consoleAndToastError(error)
                                                        }

                                                        async function handleUpdatePreAlert(acknowledged: boolean) {
                                                            //update preAlert on server then re-search
                                                            await updatePreAlert(eachPreAlert.id, { acknowledged: acknowledged })

                                                            preAlertsSearchObjSet(prevPreAlertsSearchObj => {
                                                                const newPreAlertsSearchObj = { ...prevPreAlertsSearchObj }
                                                                newPreAlertsSearchObj.refreshAll = true
                                                                return newPreAlertsSearchObj
                                                            })
                                                        }
                                                    }}
                                                >select</button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            />

            {formObj.userId !== undefined && (
                <>
                    <ShowMore
                        label='link user to package'
                        content={(
                            <>
                                <Search
                                    searchObj={usersSearchObj}
                                    searchObjSet={usersSearchObjSet}
                                    searchFunc={async (seenFilters) => {
                                        return await getUsers({ ...seenFilters }, usersSearchObj.limit, usersSearchObj.offset)
                                    }}
                                    showPage={true}
                                    searchFilters={{
                                        id: {
                                            value: "",
                                        },
                                        name: {
                                            value: "",
                                        }
                                    }}
                                />

                                {usersSearchObj.searchItems.length > 0 && (
                                    <div className='container'>
                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", gridAutoFlow: "column", gridAutoColumns: "min(30%, 100px)", overflow: "auto", gridTemplateRows: "200px" }} className='snap'>
                                            {usersSearchObj.searchItems.map(eachUser => {
                                                return (
                                                    <ViewUser key={eachUser.id} seenUser={eachUser}
                                                        selectFunction={() => {
                                                            formObjSet(prevFormObj => {
                                                                const newFormObj = { ...prevFormObj }
                                                                if (newFormObj.userId === undefined) return prevFormObj

                                                                newFormObj.userId = eachUser.id

                                                                return newFormObj
                                                            })

                                                            toast.success(`${eachUser.name} selected`)
                                                        }}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    />
                </>
            )}

            {formObj.location !== undefined && (
                <>
                    <label>select package location</label>

                    <select value={formObj.location}
                        onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
                            const eachLocation = event.target.value as locationType

                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.location === undefined) return prevFormObj

                                newFormObj.location = eachLocation

                                return newFormObj
                            })
                        }}
                    >
                        {locationOptions.map(eachLocation => {

                            return (
                                <option key={eachLocation} value={eachLocation}
                                >{eachLocation}</option>
                            )
                        })}
                    </select>
                </>
            )}

            {formObj.status !== undefined && (
                <>
                    <label>select package status</label>

                    <select value={formObj.status}
                        onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
                            const eachStatus = event.target.value as statusType

                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.status === undefined) return prevFormObj

                                newFormObj.status = eachStatus

                                return newFormObj
                            })
                        }}
                    >
                        {statusOptions.map(eachStatusOption => {

                            return (
                                <option key={eachStatusOption} value={eachStatusOption}
                                >{eachStatusOption}</option>
                            )
                        })}
                    </select>
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

            {formObj.images !== undefined && (
                <UploadFiles
                    accept='.jpg,.jpeg,.png,.webp,.bmp,.svg,.tiff'
                    allowedFileTypes={allowedImageFileTypes}
                    formDataSet={imageFormDataSet}
                    newDbRecordSetter={(dbFile) => {
                        //make new dbInvoice
                        const newDbImage: dbImageType = {
                            alt: `${dbFile.fileName} image`,
                            file: dbFile
                        }

                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.images === undefined) return prevFormObj

                            newFormObj.images = [...newFormObj.images, newDbImage]

                            return newFormObj
                        })
                    }}
                    dbUploadedFiles={formObj.images.map(eachDbImage => eachDbImage.file)}
                    dbUploadedFilesSetter={(dbUpdatedFile, index) => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.images === undefined) return prevFormObj

                            newFormObj.images[index].file = { ...dbUpdatedFile }

                            return newFormObj
                        })
                    }}
                />
            )}

















            {formObj.invoices !== undefined && (
                <UploadFiles
                    accept='.pdf,.doc,.docx,.txt'
                    allowedFileTypes={allowedInvoiceFileTypes}
                    formDataSet={invoiceFormDataSet}
                    newDbRecordSetter={(dbFile) => {
                        //make new dbInvoice
                        const newDbInvoice: dbInvoiceType = {
                            type: "internal",
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

            <button className='button1' style={{ justifySelf: "center" }}
                onClick={handleSubmit}
            >{sentPackage !== undefined ? "update" : "submit"}</button>
        </form>
    )
}