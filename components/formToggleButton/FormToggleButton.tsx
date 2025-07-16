import React from 'react'

export default function FormToggleButton({ label, value, onClick, buttonText, errors }: { label: string, value: boolean, onClick: () => void, buttonText?: string, errors?: string }) {
    return (
        <div style={{ display: "grid", alignContent: "flex-start", gap: "1rem" }}>
            <label>{label}</label>

            <button className='button1'
                onClick={onClick}
            >{buttonText === undefined ? value.toString() : buttonText}</button>

            {errors !== undefined && (
                <>
                    <p className='errorText'>{errors}</p>
                </>
            )}
        </div>
    )
}
