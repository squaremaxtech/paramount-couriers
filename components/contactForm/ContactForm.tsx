"use client"
import React, { useState } from 'react'
import styles from "./styles.module.css"
import { deepClone } from '@/utility/utility'
import toast from 'react-hot-toast'
import { contactFormSchema, contactFormType } from '@/types'
import UseFormErrors from '../useFormErrors/UseFormErrors'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import TextArea from '../inputs/textArea/TextArea'
import { sendNodeEmail } from '@/serverFunctions/handleNodeEmails'
import { newCustomerContactHtml } from '@/lib/emailTemplates'

export default function ContactForm({ submissionAction }: { submissionAction?: () => void }) {
    const initialContactForm: contactFormType = {
        email: "",
        fullname: "",
        message: "",
        phone: "(876) "
    }
    const [formObj, formObjSet] = useState<contactFormType>(deepClone(initialContactForm))

    const { formErrors, checkIfValid } = UseFormErrors<contactFormType>({ schema: contactFormSchema })

    async function handleSubmit() {
        try {
            toast.success("submittting")

            //validate contactForm
            contactFormSchema.parse(formObj)

            const finalEmailHtml = newCustomerContactHtml
                .replace('{{fullname}}', formObj.fullname)
                .replace('{{email}}', formObj.email)
                .replace('{{phone}}', formObj.phone)
                .replace('{{message}}', formObj.message);

            //send email
            await sendNodeEmail({
                sendTo: "info@paramount-couriers.com",
                replyTo: formObj.email,
                subject: `Customer Contact from ${formObj.fullname}`,
                html: finalEmailHtml
            })

            toast.success("submitted")

            //reset
            formObjSet(deepClone(initialContactForm))

            if (submissionAction !== undefined) {
                submissionAction()
            }

        } catch (error) {
            consoleAndToastError(error)
        }
    }

    return (
        <form className={styles.form} action={() => { }}>
            <InputWithIcon
                name={"fullname"}
                value={formObj.fullname}
                iconName='person'
                type={"text"}
                placeHolder={"enter your full name"}
                onChange={(e) => {
                    formObjSet(prevFormObj => {
                        const newFormObj = { ...prevFormObj }

                        newFormObj.fullname = e.target.value

                        return newFormObj
                    })
                }}
                onBlur={() => { checkIfValid(formObj, "fullname") }}
                errors={formErrors["fullname"]}
            />

            <InputWithIcon
                name={"email"}
                value={formObj.email}
                iconName='mail'
                type={"text"}
                placeHolder={"enter your email"}
                onChange={(e) => {
                    formObjSet(prevFormObj => {
                        const newFormObj = { ...prevFormObj }

                        newFormObj.email = e.target.value

                        return newFormObj
                    })
                }}
                onBlur={() => { checkIfValid(formObj, "email") }}
                errors={formErrors["email"]}
            />

            <InputWithIcon
                name={"phone"}
                value={formObj.phone}
                iconName='phone_enabled'
                type={"text"}
                placeHolder={"enter your phone number"}
                onChange={(e) => {
                    formObjSet(prevFormObj => {
                        const newFormObj = { ...prevFormObj }

                        newFormObj.phone = e.target.value

                        return newFormObj
                    })
                }}
                onBlur={() => { checkIfValid(formObj, "phone") }}
                errors={formErrors["phone"]}
            />

            <TextArea
                name={"message"}
                value={formObj.message}
                placeHolder={"enter your message"}
                onChange={(e) => {
                    formObjSet(prevFormObj => {
                        const newFormObj = { ...prevFormObj }

                        newFormObj.message = e.target.value

                        return newFormObj
                    })
                }}
                onBlur={() => { checkIfValid(formObj, "message") }}
                errors={formErrors["message"]}
            />

            <button className='button1'
                onClick={handleSubmit}
            >submit</button>
        </form>
    )
}

function InputWithIcon({ name, value, iconName, onChange, label, type, id, errors, onBlur, placeHolder, required, ...elProps }: {
    name: string, value: string, iconName: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void, label?: string, type?: string, id?: string, errors?: string, placeHolder?: string, required?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {

    return (
        <div {...elProps} style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", ...elProps?.style }}>
            {label !== undefined && <label htmlFor={id !== undefined ? id : name}>{label}{required !== undefined && required === "" ? "*" : required}</label>}

            <div className={`${styles.inputCont} container`} style={{ gridTemplateColumns: "1fr auto", alignItems: "center", padding: "var(--spacingR) var(--spacingM)", backgroundColor: "var(--bg5)" }}>
                <input id={id !== undefined ? id : name} type={type === undefined ? "text" : type} name={name} value={value} placeholder={placeHolder ?? ""} onChange={onChange} onBlur={(e) => { if (onBlur !== undefined) onBlur(e) }} style={{ padding: "0px", borderRadius: "0", backgroundColor: "inherit" }} />

                <span className="material-symbols-outlined">
                    {iconName}
                </span>
            </div>

            {errors !== undefined && <p className="errorText">{errors}</p>}
        </div>
    )
}