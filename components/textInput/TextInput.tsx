export default function TextInput({
    name, value, onChange, label, type, id, errors, onBlur, placeHolder, disabled, ...elProps }: {
        name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void, label?: string, type?: string, id?: string, errors?: string, placeHolder?: string, disabled?: boolean
    } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps} style={{ display: "grid", alignContent: "flex-start", gap: "1rem", ...elProps?.style }}>
            {label !== undefined && <label htmlFor={id !== undefined ? id : name} style={{ filter: disabled ? "brightness(.2)" : "" }}>{label}</label>}

            <input id={id !== undefined ? id : name} type={type === undefined ? "text" : type} name={name} value={value} placeholder={placeHolder ?? ""} onChange={(e) => {
                if (disabled) return

                onChange(e)
            }} onBlur={(e) => { if (onBlur !== undefined) onBlur(e) }} />

            {errors !== undefined && <p className="errorText">{errors}</p>}
        </div>
    )
}
