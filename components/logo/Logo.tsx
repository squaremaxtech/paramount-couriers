import Image from 'next/image'
import React from 'react'
import logo from "@/public/logo.jpeg"
import Link from 'next/link'

export default function Logo() {
    return (
        <Link href={"/"}>
            <Image alt='logo' src={logo} width={300} height={300} style={{ width: "clamp(1rem, 15000vw, 5rem)", objectFit: "contain" }} />
        </Link>
    )
}
