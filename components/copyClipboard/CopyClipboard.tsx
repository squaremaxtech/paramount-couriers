"use client"
import React from 'react'
import toast from 'react-hot-toast';

export default function CopyClipboard({ text }: { text: string }) {
    return (
        <button style={{ cursor: "pointer", marginLeft: "var(--spacingS)" }}
            onClick={() => {
                navigator.clipboard.writeText(text);

                toast.success("copied to clipboard")
            }}
        >
            <span className="material-symbols-outlined">
                content_copy
            </span>
        </button>
    )
}
