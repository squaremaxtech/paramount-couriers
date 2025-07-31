"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { deepClone, formatAsMoney, formatWeight } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../inputs/textInput/TextInput'
import { dbInvoiceType, newPackageSchema, packageType, wantedCrudObjType, packageSchema, searchObjType, preAlertType, userType, locationOptions, statusOptions, dbImageType } from '@/types'
import { addPackage, deleteImageeOnPackage, deleteInvoiceOnPackage, updatePackage } from '@/serverFunctions/handlePackages'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import { allowedImageFileTypes, allowedInvoiceFileTypes, imageFileInputAccept, invoiceFileInputAccept } from '@/types/uploadTypes'
import UploadFiles from '../uploadFiles/UploadFiles'
import { handleWithFiles } from '@/utility/handleWithFiles'
import useTableColumnAccess from '../useTableColumnAccess/UseTableColumnAccess'
import { filterTableObjectByColumnAccess } from '@/useful/usefulFunctions'
import { initialNewPackageObj } from '@/lib/initialFormData'
import UseFormErrors from '../useFormErrors/UseFormErrors'
import ShowMore from '../showMore/ShowMore'
import Search from '../search/Search'
import { deleteImageeOnPreAlert, deleteInvoiceOnPreAlert, getPreAlerts, updatePreAlert } from '@/serverFunctions/handlePreAlerts'
import { getSpecificUser, getUsers } from '@/serverFunctions/handleUsers'
import { ViewPreAlert } from '../preAlerts/ViewPreAlert'
import { ViewUser } from '../users/ViewUser'
import ViewItems from '../items/ViewItem'
import FormToggleButton from '../inputs/formToggleButton/FormToggleButton'
import Select from '../inputs/select/Select'

const seenStatusOptions = [...statusOptions]
const seenLocationOptions = [...locationOptions]

export default function AddEditPackage({ sentPackage, wantedCrudObj, submissionAction }: { sentPackage?: packageType, wantedCrudObj: wantedCrudObjType, submissionAction?: () => void }) {
    const [formObj, formObjSet] = useState<Partial<packageType>>(deepClone(sentPackage === undefined ? initialNewPackageObj : packageSchema.partial().parse(sentPackage)))

    const { formErrors, checkIfValid } = UseFormErrors<packageType>({ schema: packageSchema.partial() })
    const { tableColumnAccess } = useTableColumnAccess({ tableName: "packages", tableRecordObject: formObj, wantedCrudObj: wantedCrudObj })

    const [preAlertsSearchObj, preAlertsSearchObjSet] = useState<searchObjType<preAlertType>>({
        searchItems: [],
    })
    const [usersSearchObj, usersSearchObjSet] = useState<searchObjType<userType>>({
        searchItems: [],
    })

    const [invoiceFormData, invoiceFormDataSet] = useState<FormData | null>(null)
    const [imageFormData, imageFormDataSet] = useState<FormData | null>(null)

    const [chosenUser, chosenUserSet] = useState<userType | undefined>(undefined)
    const [chosenPreAlert, chosenPreAlertSet] = useState<preAlertType | undefined>(undefined)
    const [invoiceType, invoiceTypeSet] = useState<dbInvoiceType["type"]>("delivery")

    //handle changes from above
    useEffect(() => {
        if (sentPackage === undefined) return

        formObjSet(deepClone(packageSchema.partial().parse(sentPackage)))

    }, [sentPackage])

    //load chosen user
    useEffect(() => {
        const search = async () => {
            try {
                if (formObj.userId === undefined || formObj.userId === "") return

                const seenUser = await getSpecificUser(formObj.userId, { crud: "r" })
                if (seenUser === undefined) throw new Error("not seeing chosen user id")

                chosenUserSet(seenUser)

            } catch (error) {
                consoleAndToastError(error)
            }
        }
        search()
    }, [formObj.userId])

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //new package
            if (sentPackage === undefined) {
                //validate - replace with initial defaults if no access to "c"
                const filteredPackage = filterTableObjectByColumnAccess(tableColumnAccess, formObj, initialNewPackageObj)

                //files - can sometimes contain files from given preAlert
                if (filteredPackage.invoices !== undefined) {
                    filteredPackage.invoices = await handleWithFiles(filteredPackage.invoices, invoiceFormData, "invoice", {
                        delete: async (dbWithFilesObjs) => {
                            if (chosenPreAlert !== undefined) {
                                await deleteInvoiceOnPreAlert(chosenPreAlert.id, dbWithFilesObjs, { crud: "d" })
                            }
                        }
                    })
                }
                //images
                if (filteredPackage.images !== undefined) {
                    filteredPackage.images = await handleWithFiles(filteredPackage.images, imageFormData, "image", {
                        delete: async (dbWithFilesObjs) => {
                            if (chosenPreAlert !== undefined) {
                                await deleteImageeOnPreAlert(chosenPreAlert.id, dbWithFilesObjs, { crud: "d" })
                            }
                        }
                    })
                }

                const validatedNewPackage = newPackageSchema.parse(filteredPackage)

                //update chosen preAlert
                await runSameForPreAlert()

                //send up to server
                await addPackage(validatedNewPackage)

                toast.success("submitted")

                //reset
                invoiceFormDataSet(null)
                imageFormDataSet(null)
                formObjSet(deepClone(initialNewPackageObj))
                chosenUserSet(undefined)

            } else {
                //validate
                const validatedPackage = packageSchema.parse(formObj)

                //auth
                const filteredPackage = filterTableObjectByColumnAccess(tableColumnAccess, validatedPackage)

                //files
                if (filteredPackage.invoices !== undefined) {
                    filteredPackage.invoices = await handleWithFiles(filteredPackage.invoices, invoiceFormData, "invoice", {
                        delete: async (dbWithFilesObjs) => {
                            if (sentPackage !== undefined) {
                                await deleteInvoiceOnPackage(sentPackage.id, dbWithFilesObjs, { crud: "d" })
                            }
                        }
                    })
                }

                //images
                if (filteredPackage.images !== undefined) {
                    filteredPackage.images = await handleWithFiles(filteredPackage.images, imageFormData, "image", {
                        delete: async (dbWithFilesObjs) => {
                            if (sentPackage !== undefined) {
                                await deleteImageeOnPackage(sentPackage.id, dbWithFilesObjs, { crud: "d" })
                            }
                        }
                    })
                }

                //update chosen preAlert
                await runSameForPreAlert()

                //update
                const updatedPackage = await updatePackage(sentPackage.id, filteredPackage, wantedCrudObj)

                toast.success("package updated")

                //set to updated
                formObjSet(updatedPackage)
            }

            if (submissionAction !== undefined) {
                submissionAction()
            }

            async function runSameForPreAlert() {
                //update chosen preAlert
                if (chosenPreAlert !== undefined) {
                    await handleUpdatePreAlert(chosenPreAlert, { acknowledged: true })
                }
            }

        } catch (error) {
            consoleAndToastError(error)
        }
    }

    async function handleUpdatePreAlert(preAlert: preAlertType, newPreAlertObj: Partial<preAlertType>) {
        try {
            //update preAlert on server then re-search
            await updatePreAlert(preAlert.id, newPreAlertObj, { crud: "u" })

            preAlertsSearchObjSet(prevPreAlertsSearchObj => {
                const newPreAlertsSearchObj = { ...prevPreAlertsSearchObj }
                newPreAlertsSearchObj.refreshAll = true
                return newPreAlertsSearchObj
            })

        } catch (error) {
            consoleAndToastError(error)
        }
    }

    return (
        <form className={styles.form} action={() => { }}>
            <ShowMore
                label='pre alerts'
                startShowing={sentPackage === undefined}
                content={(
                    <div className='container'>
                        <Search
                            searchObj={preAlertsSearchObj}
                            searchObjSet={preAlertsSearchObjSet}
                            searchFunc={async (seenFilters) => {
                                return await getPreAlerts({ ...seenFilters }, { crud: "r" }, {}, preAlertsSearchObj.limit, preAlertsSearchObj.offset)
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
                            <ViewItems
                                itemObjs={preAlertsSearchObj.searchItems.map(eachSeaarchItem => {
                                    return {
                                        item: eachSeaarchItem,
                                        Element: <ViewPreAlert preAlert={eachSeaarchItem} />
                                    }
                                })}
                                selectedId={chosenPreAlert !== undefined ? chosenPreAlert.id : undefined}
                                selectionAction={async (eachPreAlert) => {
                                    try {
                                        //add onto form obj everything wanted
                                        formObjSet(prevFormObj => {
                                            const newFormObj = { ...prevFormObj }

                                            //assign proper preAlert values to package
                                            newFormObj.userId = eachPreAlert.userId
                                            newFormObj.trackingNumber = eachPreAlert.trackingNumber
                                            newFormObj.store = eachPreAlert.store
                                            newFormObj.consignee = eachPreAlert.consignee
                                            newFormObj.description = eachPreAlert.description
                                            newFormObj.price = eachPreAlert.price
                                            newFormObj.invoices = eachPreAlert.invoices

                                            return newFormObj
                                        })

                                        //set used
                                        chosenPreAlertSet(eachPreAlert)

                                        //deselect
                                        if (chosenPreAlert !== undefined && chosenPreAlert.id === eachPreAlert.id) {
                                            chosenPreAlertSet(undefined)

                                        } else {
                                            toast.success(`preAlert selected`)
                                        }

                                    } catch (error) {
                                        consoleAndToastError(error)
                                    }
                                }}
                            />
                        )}
                    </div>
                )}
            />

            {formObj.id !== undefined && tableColumnAccess["id"] && (
                <>
                    <TextInput
                        name={"id"}
                        value={`${formObj.id}`}
                        type={"text"}
                        label={"package id"}
                        placeHolder={"enter package id"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.id === undefined) return prevFormObj

                                newFormObj.id = parseInt(e.target.value)

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "id") }}
                        errors={formErrors["id"]}
                    />
                </>
            )}

            {formObj.userId !== undefined && tableColumnAccess["userId"] && (
                <>
                    <ShowMore
                        label='user selection'
                        content={(
                            <>
                                <Search
                                    searchObj={usersSearchObj}
                                    searchObjSet={usersSearchObjSet}
                                    searchFunc={async (seenFilters) => {
                                        return await getUsers({ ...seenFilters }, { crud: "r" }, usersSearchObj.limit, usersSearchObj.offset)
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
                                    <ViewItems
                                        itemObjs={usersSearchObj.searchItems.map(eachSeaarchItem => {
                                            return {
                                                item: eachSeaarchItem,
                                                Element: <ViewUser user={eachSeaarchItem} />
                                            }
                                        })}
                                        selectedId={chosenUser !== undefined ? chosenUser.id : undefined}
                                        selectionAction={async (eachUser) => {
                                            formObjSet(prevFormObj => {
                                                const newFormObj = { ...prevFormObj }
                                                if (newFormObj.userId === undefined) return prevFormObj

                                                newFormObj.userId = eachUser.id

                                                return newFormObj
                                            })

                                            toast.success(`${eachUser.name} selected`)
                                        }}
                                    />
                                )}
                            </>
                        )}
                    />
                </>
            )}

            {chosenUser !== undefined && (
                <>
                    <label>chosen user</label>

                    <ViewUser user={chosenUser} fullView={false} />
                </>
            )}

            {formObj.location !== undefined && tableColumnAccess["location"] && (
                <Select
                    label='select package location'
                    name='location'
                    value={formObj.location}
                    valueOptions={seenLocationOptions}
                    onChange={value => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.location === undefined) return prevFormObj

                            newFormObj.location = value

                            return newFormObj
                        })
                    }}
                    errors={formErrors["location"]}
                />
            )}

            {formObj.status !== undefined && tableColumnAccess["status"] && (
                <Select
                    label='select package status'
                    name='status'
                    value={formObj.status}
                    valueOptions={seenStatusOptions}
                    onChange={value => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.status === undefined) return prevFormObj

                            newFormObj.status = value

                            return newFormObj
                        })
                    }}
                    errors={formErrors["status"]}
                />
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

            {formObj.price !== undefined && tableColumnAccess["price"] && (
                <>
                    <TextInput
                        name={"price"}
                        value={formObj.price}
                        type={"text"}
                        label={`price ${formatAsMoney(formObj.price)}`}
                        placeHolder={"enter price"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.price === undefined) return prevFormObj

                                newFormObj.price = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "price") }}
                        errors={formErrors["price"]}
                    />
                </>
            )}

            {formObj.invoices !== undefined && tableColumnAccess["invoices"] && (
                <>
                    <label>
                        upload {invoiceType} invoices

                        <button className='button2' style={{ marginLeft: "var(--spacingR)" }}
                            onClick={() => {
                                invoiceTypeSet(prevInvoiceType => {
                                    const newInvoiceType = prevInvoiceType === "delivery" ? "seller" : "delivery"
                                    return newInvoiceType
                                })
                            }}
                        >swap type</button>
                    </label>

                    <UploadFiles
                        id='uploadInvoices'
                        accept={invoiceFileInputAccept}
                        allowedFileTypes={allowedInvoiceFileTypes}
                        formDataSet={invoiceFormDataSet}
                        newDbRecordSetter={(dbFile) => {
                            //make new dbInvoice
                            const newDbInvoice: dbInvoiceType = {
                                dbFileType: "invoice",
                                type: invoiceType,
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
                </>
            )}

            {formObj.images !== undefined && tableColumnAccess["images"] && (
                <>
                    <label>Upload Images</label>

                    <UploadFiles
                        id='uploadImages'
                        accept={imageFileInputAccept}
                        allowedFileTypes={allowedImageFileTypes}
                        formDataSet={imageFormDataSet}
                        newDbRecordSetter={(dbFile) => {
                            //make new dbImage
                            const newDbImage: dbImageType = {
                                dbFileType: "image",
                                file: dbFile,
                                alt: dbFile.fileName,
                            }

                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.images === undefined) return prevFormObj

                                newFormObj.images = [...newFormObj.images, newDbImage]

                                return newFormObj
                            })
                        }}
                        dbWithFileObjs={formObj.images}
                        dbWithFileObjsSetter={dbWithFileObjs => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.images === undefined) return prevFormObj

                                newFormObj.images = [...dbWithFileObjs]

                                return newFormObj
                            })
                        }}
                    />
                </>
            )}

            {formObj.weight !== undefined && tableColumnAccess["weight"] && (
                <>
                    <TextInput
                        name={"weight"}
                        value={formObj.weight}
                        type={"text"}
                        label={`weight ${formatWeight(formObj.weight)}`}
                        placeHolder={"enter weight"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.weight === undefined) return prevFormObj

                                newFormObj.weight = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "weight") }}
                        errors={formErrors["weight"]}
                    />
                </>
            )}

            {formObj.payment !== undefined && tableColumnAccess["payment"] && (
                <>
                    <TextInput
                        name={"payment"}
                        value={formObj.payment}
                        type={"text"}
                        label={`payment ${formatAsMoney(formObj.payment)}`}
                        placeHolder={"enter payment"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.payment === undefined) return prevFormObj

                                newFormObj.payment = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "payment") }}
                        errors={formErrors["payment"]}
                    />
                </>
            )}

            {formObj.comments !== undefined && tableColumnAccess["comments"] && (
                <>
                    <TextInput
                        name={"comments"}
                        value={formObj.comments}
                        type={"text"}
                        label={"comments"}
                        placeHolder={"enter comments"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.comments === undefined) return prevFormObj

                                newFormObj.comments = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "comments") }}
                        errors={formErrors["comments"]}
                    />
                </>
            )}

            {formObj.needAttention !== undefined && tableColumnAccess["needAttention"] && (
                <>
                    <FormToggleButton
                        label='package needs attention?'
                        onClick={() => {
                            if (!tableColumnAccess["needAttention"]) return

                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.needAttention === undefined) return prevFormObj

                                newFormObj.needAttention = !newFormObj.needAttention

                                return newFormObj
                            })
                        }}
                        value={formObj.needAttention}
                        errors={formErrors["needAttention"]}
                    />
                </>
            )}

            <button className='button1' style={{ justifySelf: "center" }}
                onClick={handleSubmit}
            >{sentPackage !== undefined ? "update" : "submit"}</button>
        </form>
    )
}