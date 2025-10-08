"use client"
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import { deepClone } from '@/utility/utility'
import toast from 'react-hot-toast'
import TextInput from '../inputs/textInput/TextInput'
import { newUserSchema, userSchema, userType, packageDeliveryMethodOptions, roleOptions, accessLevelOptions, parishOptions } from '@/types'
import { addUser, updateUser } from '@/serverFunctions/handleUsers'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import useTableColumnAccess from '../useTableColumnAccess/UseTableColumnAccess'
import { filterTableObjectByColumnAccess } from '@/useful/usefulFunctions'
import { initialNewUserObj } from '@/lib/initialFormData'
import UseFormErrors from '../useFormErrors/UseFormErrors'
import Select from '../inputs/select/Select'

const seenRoleOptions = [...roleOptions]
const seenAccessLevelOptions = [...accessLevelOptions]
const seenParishOptions = [...parishOptions]
const seenPackageDeliveryMethodOptions = [...packageDeliveryMethodOptions]

export default function AddEditUser({ sentUser, submissionAction }: { sentUser?: userType, submissionAction?: () => void }) {
    const [formObj, formObjSet] = useState<Partial<userType>>(deepClone(sentUser === undefined ? initialNewUserObj : userSchema.partial().parse(sentUser)))

    const { formErrors, checkIfValid } = UseFormErrors<userType>({ schema: userSchema.partial() })
    const { tableColumnAccess } = useTableColumnAccess({ tableName: "users", tableRecordObject: formObj, crudActionObj: { action: sentUser === undefined ? "c" : "u", resourceId: sentUser === undefined ? undefined : `${sentUser.id}` } })

    //handle changes from above
    useEffect(() => {
        if (sentUser === undefined) return

        formObjSet(deepClone(userSchema.partial().parse(sentUser)))

    }, [sentUser])

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //new user
            if (sentUser === undefined) {
                //validate - replace with initial defaults if no access to "c"
                const filteredUser = filterTableObjectByColumnAccess(tableColumnAccess, formObj, initialNewUserObj)

                const validatedNewUser = newUserSchema.parse(filteredUser)

                //send up to server
                await addUser(validatedNewUser)

                toast.success("submitted")

                //reset
                formObjSet(deepClone(initialNewUserObj))

            } else {
                //validate
                const validatedUser = userSchema.parse(formObj)

                //auth
                const filteredUser = filterTableObjectByColumnAccess(tableColumnAccess, validatedUser)

                //update
                const updatedUser = await updateUser(sentUser.id, filteredUser, { action: "u", resourceId: `${sentUser.id}` })

                toast.success("user updated")

                //set to updated
                formObjSet(updatedUser)
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
                        label={"user id"}
                        placeHolder={"enter user id"}
                        onChange={(e) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.id === undefined) return prevFormObj

                                newFormObj.id = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "id") }}
                        errors={formErrors["id"]}
                    />
                </>
            )}

            {formObj.name !== undefined && tableColumnAccess["name"] && (
                <>
                    <TextInput
                        name={"name"}
                        value={formObj.name ?? ""}
                        type={"text"}
                        label={"name"}
                        placeHolder={"enter full name"}
                        onChange={(e) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.name === undefined) return prevFormObj

                                newFormObj.name = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "name") }}
                        errors={formErrors["name"]}
                    />
                </>
            )}

            {formObj.email !== undefined && tableColumnAccess["email"] && (
                <>
                    <TextInput
                        name={"email"}
                        value={formObj.email ?? ''}
                        type={"text"}
                        label={"email"}
                        placeHolder={"enter full email"}
                        onChange={(e) => {
                            formObjSet(prevFormObj => {
                                const newFormObj = { ...prevFormObj }
                                if (newFormObj.email === undefined) return prevFormObj

                                newFormObj.email = e.target.value

                                return newFormObj
                            })
                        }}
                        onBlur={() => { checkIfValid(formObj, "email") }}
                        errors={formErrors["email"]}
                    />
                </>
            )}

            {formObj.role !== undefined && tableColumnAccess["role"] && (
                <Select
                    label='select user role'
                    name='role'
                    value={formObj.role}
                    valueOptions={seenRoleOptions}
                    onChange={value => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.role === undefined) return prevFormObj

                            newFormObj.role = value

                            return newFormObj
                        })
                    }}
                    errors={formErrors["role"]}
                />
            )}

            {formObj.accessLevel !== undefined && tableColumnAccess["accessLevel"] && (
                <Select
                    label='select user accessLevel'
                    name='accessLevel'
                    value={formObj.accessLevel}
                    valueOptions={seenAccessLevelOptions}
                    onChange={value => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.accessLevel === undefined) return prevFormObj

                            newFormObj.accessLevel = value

                            return newFormObj
                        })
                    }}
                    errors={formErrors["accessLevel"]}
                />
            )}

            {formObj.address !== undefined && tableColumnAccess["address"] && (
                <>
                    <label>Address</label>

                    <p className='errorText'>{formErrors["address"]}</p>

                    <div style={{ display: "grid", padding: "var(--spacingR)", gap: "var(--spacingR)" }}>
                        {formObj.address === null ? (
                            <>
                                <button className='button1' style={{ justifySelf: "flex-start" }}
                                    onClick={() => {
                                        //set started values
                                        formObjSet(prevFormObj => {
                                            const newFormObj = { ...prevFormObj }
                                            if (newFormObj.address === undefined) return prevFormObj

                                            newFormObj.address = {
                                                street: "",
                                                parish: "Kingston",
                                                city: "",
                                            }

                                            return newFormObj
                                        })
                                    }}
                                >start address</button>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    name={"addressStreet"}
                                    value={formObj.address.street}
                                    type={"text"}
                                    label={"street"}
                                    placeHolder={"enter your street address"}
                                    onChange={(e) => {
                                        formObjSet(prevFormObj => {
                                            const newFormObj = { ...prevFormObj }
                                            if (newFormObj.address === undefined || newFormObj.address === null) return prevFormObj

                                            newFormObj.address.street = e.target.value

                                            return newFormObj
                                        })
                                    }}
                                    onBlur={() => { checkIfValid(formObj, "address") }}
                                />

                                <Select
                                    label='select parish'
                                    name='addressParish'
                                    value={formObj.address.parish}
                                    valueOptions={seenParishOptions}
                                    onChange={value => {
                                        formObjSet(prevFormObj => {
                                            const newFormObj = { ...prevFormObj }
                                            if (newFormObj.address === undefined || newFormObj.address === null) return prevFormObj

                                            newFormObj.address.parish = value

                                            return newFormObj
                                        })
                                    }}
                                />

                                <TextInput
                                    name={"addressCity"}
                                    value={formObj.address.city}
                                    type={"text"}
                                    label={"city"}
                                    placeHolder={"enter your city"}
                                    onChange={(e) => {
                                        formObjSet(prevFormObj => {
                                            const newFormObj = { ...prevFormObj }
                                            if (newFormObj.address === undefined || newFormObj.address === null) return prevFormObj

                                            newFormObj.address.city = e.target.value

                                            return newFormObj
                                        })
                                    }}
                                    onBlur={() => { checkIfValid(formObj, "address") }}
                                />

                                <button className='button2' style={{ justifySelf: "flex-start" }}
                                    onClick={() => {
                                        formObjSet(prevFormObj => {
                                            const newFormObj = { ...prevFormObj }
                                            if (newFormObj.address === undefined) return prevFormObj

                                            newFormObj.address = null

                                            return newFormObj
                                        })
                                    }}
                                >reset address</button>
                            </>
                        )}
                    </div>
                </>
            )}

            {formObj.packageDeliveryMethod !== undefined && tableColumnAccess["packageDeliveryMethod"] && (
                <Select
                    label='select package devliery method'
                    name='packageDeliveryMethod'
                    value={formObj.packageDeliveryMethod}
                    valueOptions={seenPackageDeliveryMethodOptions}
                    onChange={value => {
                        formObjSet(prevFormObj => {
                            const newFormObj = { ...prevFormObj }
                            if (newFormObj.packageDeliveryMethod === undefined) return prevFormObj

                            newFormObj.packageDeliveryMethod = value

                            return newFormObj
                        })
                    }}
                    errors={formErrors["packageDeliveryMethod"]}
                />
            )}

            <button className='button1' style={{ justifySelf: "center" }}
                onClick={handleSubmit}
            >{sentUser !== undefined ? "update" : "submit"}</button>
        </form>
    )
}