"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { calculatePackageServiceCost, convertToCurrency, deepClone, formatAsMoney, formatWeight } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../inputs/textInput/TextInput'
import { dbInvoiceType, newPackageSchema, packageType, packageSchema, searchObjType, userType, locationOptions, statusOptions, dbImageType } from '@/types'
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
import { getSpecificUser, getUsers } from '@/serverFunctions/handleUsers'
import { ViewUser } from '../users/ViewUser'
import ViewItems from '../items/ViewItem'
import FormToggleButton from '../inputs/formToggleButton/FormToggleButton'
import Select from '../inputs/select/Select'
import { rateByWeightArr } from '@/lib/data'
import { useSession } from 'next-auth/react'

const seenStatusOptions = [...statusOptions]
const seenLocationOptions = [...locationOptions]

export default function AddEditPackage({ sentPackage, submissionAction }: { sentPackage?: packageType, submissionAction?: () => void }) {
    const { data: session } = useSession()

    const [formObj, formObjSet] = useState<Partial<packageType>>(deepClone(sentPackage === undefined ? initialNewPackageObj : packageSchema.partial().parse(sentPackage)))

    const { formErrors, checkIfValid } = UseFormErrors<packageType>({ schema: packageSchema.partial() })
    const { tableColumnAccess } = useTableColumnAccess({ tableName: "packages", tableRecordObject: formObj, crudActionObj: { action: sentPackage === undefined ? "c" : "u", resourceId: sentPackage === undefined ? undefined : `${sentPackage.id}` } })

    const [usersSearchObj, usersSearchObjSet] = useState<searchObjType<userType>>({
        searchItems: [],
    })

    const [invoiceFormData, invoiceFormDataSet] = useState<FormData | null>(null)
    const [imageFormData, imageFormDataSet] = useState<FormData | null>(null)

    const [chosenUser, chosenUserSet] = useState<userType | undefined>(undefined)
    const [invoiceType, invoiceTypeSet] = useState<dbInvoiceType["type"]>("delivery")

    //handle changes from above
    useEffect(() => {
        if (sentPackage === undefined) return

        formObjSet(deepClone(packageSchema.partial().parse(sentPackage)))

    }, [sentPackage])

    //set user id for customer user type
    useEffect(() => {
        const search = async () => {
            //only customers
            if (session === null || session.user.role !== "customer") return

            //set
            formObjSet(prevFormObj => {
                const newFormObj = { ...prevFormObj }
                if (newFormObj.userId === undefined) return prevFormObj

                newFormObj.userId = session.user.id

                return newFormObj
            })
        }
        search()
    }, [session])

    //load chosen user
    useEffect(() => {
        const search = async () => {
            try {
                if (formObj.userId === undefined || formObj.userId === "" || session === null) return

                const seenUser = await getSpecificUser(formObj.userId, { action: "r", resourceId: session.user.id })
                if (seenUser === undefined) throw new Error("not seeing chosen user id")

                chosenUserSet(seenUser)

            } catch (error) {
                consoleAndToastError(error)
            }
        }
        search()
    }, [formObj.userId, session])

    //start off charges from rates
    useEffect(() => {
        if (formObj.charges === undefined || !tableColumnAccess["charges"]) return

        formObjSet(prevFormObj => {
            const newFormObj = { ...prevFormObj }

            if (newFormObj.charges === undefined || formObj.weight === undefined) return prevFormObj

            const seenWeight = parseFloat(formObj.weight)

            const foundRateForWeight = rateByWeightArr.find(eachRateByWeight => eachRateByWeight.weight === seenWeight)
            if (foundRateForWeight === undefined) return prevFormObj

            const seenRate = foundRateForWeight.rate

            newFormObj.charges.freight = convertToCurrency(seenRate * .7)
            newFormObj.charges.fuel = convertToCurrency(seenRate * .1)
            newFormObj.charges.insurance = convertToCurrency(seenRate * .2)

            return newFormObj
        })
    }, [formObj.weight, tableColumnAccess["charges"]])

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //new package
            if (sentPackage === undefined) {
                //validate - replace with initial defaults if no access to "c"
                const filteredPackage = filterTableObjectByColumnAccess(tableColumnAccess, formObj, initialNewPackageObj)

                //invoices
                if (filteredPackage.invoices !== undefined) {
                    filteredPackage.invoices = await handleWithFiles(filteredPackage.invoices, invoiceFormData, "invoice", {
                        delete: async () => {
                            //nohing to run
                        }
                    })
                }

                //images
                if (filteredPackage.images !== undefined) {
                    filteredPackage.images = await handleWithFiles(filteredPackage.images, imageFormData, "image", {
                        delete: async () => {
                            //nohing to run
                        }
                    })
                }

                const validatedNewPackage = newPackageSchema.parse(filteredPackage)

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

                //invoices
                if (filteredPackage.invoices !== undefined) {
                    filteredPackage.invoices = await handleWithFiles(filteredPackage.invoices, invoiceFormData, "invoice", {
                        delete: async (dbWithFilesObjs) => {
                            if (sentPackage !== undefined) {
                                await deleteInvoiceOnPackage(sentPackage.id, dbWithFilesObjs, { action: "d" })
                            }
                        }
                    })
                }

                //images
                if (filteredPackage.images !== undefined) {
                    filteredPackage.images = await handleWithFiles(filteredPackage.images, imageFormData, "image", {
                        delete: async (dbWithFilesObjs) => {
                            if (sentPackage !== undefined) {
                                await deleteImageeOnPackage(sentPackage.id, dbWithFilesObjs, { action: "d" })
                            }
                        }
                    })
                }

                //update
                const updatedPackage = await updatePackage(sentPackage.id, filteredPackage, { action: "u", resourceId: `${sentPackage.id}` })

                toast.success("package updated")

                //set to updated
                formObjSet(updatedPackage)
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
            {formObj.id !== undefined && tableColumnAccess["id"] && (
                <>
                    <TextInput
                        name={"id"}
                        value={`${formObj.id}`}
                        type={"text"}
                        label={"package id"}
                        placeHolder={"enter package id"}
                        onChange={(e) => {
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

            {session !== null && session.user.role !== "customer" && (
                <>
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
                                                return await getUsers({ ...seenFilters }, { action: "r" }, {}, usersSearchObj.limit, usersSearchObj.offset)
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
                        onChange={(e) => {
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
                        onChange={(e) => {
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
                        onChange={(e) => {
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
                        onChange={(e) => {
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

            {formObj.packageValue !== undefined && tableColumnAccess["packageValue"] && (
                <>
                    <TextInput
                        name={"packageValue"}
                        value={formObj.packageValue}
                        type={"text"}
                        label={`packageValue ${formatAsMoney(formObj.packageValue)}`}
                        placeHolder={"enter package value"}
                        onChange={(e) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.packageValue === undefined) return prevFormObj

                                newFormObj.packageValue = e.target.value

                                //keep cif value same as declared value for customers
                                if (session !== null && session.user.role === "customer") {
                                    newFormObj.cifValue = newFormObj.packageValue
                                }

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "packageValue") }}
                        errors={formErrors["packageValue"]}
                    />
                </>
            )}

            {formObj.cifValue !== undefined && tableColumnAccess["cifValue"] && session !== null && session.user.role !== "customer" && (
                <>
                    <TextInput
                        name={"cifValue"}
                        value={formObj.cifValue}
                        type={"text"}
                        label={`CIF value ${formatAsMoney(formObj.cifValue)}`}
                        placeHolder={"enter package value"}
                        onChange={(e) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.cifValue === undefined) return prevFormObj

                                newFormObj.cifValue = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "cifValue") }}
                        errors={formErrors["cifValue"]}
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
                        type="invoice"
                        formDataSet={invoiceFormDataSet}
                        newDbRecordSetter={(dbFile) => {
                            //make new dbInvoice
                            const newDbInvoice: dbInvoiceType = {
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
                        type="image"
                        formDataSet={imageFormDataSet}
                        newDbRecordSetter={(dbFile) => {
                            //make new dbImage
                            const newDbImage: dbImageType = {
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
                        onChange={(e) => {
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

            {formObj.charges !== undefined && tableColumnAccess["charges"] && (
                <>
                    <label>service charges - total: {formatAsMoney(`${calculatePackageServiceCost(formObj.charges)}`)}</label>

                    {formErrors["charges"] !== undefined && <p className='errorText'>{formErrors["charges"]}</p>}

                    <div className='container' style={{ padding: "var(--spacingR)" }}>
                        <TextInput
                            name={"chargesFreight"}
                            value={formObj.charges.freight}
                            type={"text"}
                            label={`freight fee ${formatAsMoney(formObj.charges.freight)}`}
                            placeHolder={"enter freight fee"}
                            onChange={(e) => {
                                formObjSet(prevFormObj => {
                                    const newFormObj = { ...prevFormObj }
                                    if (newFormObj.charges === undefined) return prevFormObj

                                    newFormObj.charges.freight = e.target.value

                                    return newFormObj
                                })
                            }}
                            onBlur={() => { checkIfValid(formObj, "charges") }}
                        />

                        <TextInput
                            name={"chargesFuel"}
                            value={formObj.charges.fuel}
                            type={"text"}
                            label={`fuel fee ${formatAsMoney(formObj.charges.fuel)}`}
                            placeHolder={"enter fuel fee"}
                            onChange={(e) => {
                                formObjSet(prevFormObj => {
                                    const newFormObj = { ...prevFormObj }
                                    if (newFormObj.charges === undefined) return prevFormObj

                                    newFormObj.charges.fuel = e.target.value

                                    return newFormObj
                                })
                            }}
                            onBlur={() => { checkIfValid(formObj, "charges") }}
                        />

                        <TextInput
                            name={"chargesInsurance"}
                            value={formObj.charges.insurance}
                            type={"text"}
                            label={`insurance fee ${formatAsMoney(formObj.charges.insurance)}`}
                            placeHolder={"enter insurance fee"}
                            onChange={(e) => {
                                formObjSet(prevFormObj => {
                                    const newFormObj = { ...prevFormObj }
                                    if (newFormObj.charges === undefined) return prevFormObj

                                    newFormObj.charges.insurance = e.target.value

                                    return newFormObj
                                })
                            }}
                            onBlur={() => { checkIfValid(formObj, "charges") }}
                        />
                    </div>
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
                        onChange={(e) => {
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
                        onChange={(e) => {
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
                        buttonProps={{
                            style: { justifySelf: "flex-start" }
                        }}
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