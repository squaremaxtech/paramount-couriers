import Image from 'next/image'
import React from 'react'
import logo from "@/public/logo.png"

export default function Logo() {
    return (
        <Image alt='logo' src={logo} width={150} height={150} style={{ objectFit: "contain" }} />
    )
}
