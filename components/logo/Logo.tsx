import Image from 'next/image'
import React from 'react'
import logo from "@/public/logo.jpg"
import Link from 'next/link'

export default function Logo() {
    return (
        <Link href={"/"} style={{ aspectRatio: "16/9", width: "5rem" }}>
            <Image alt='logo' src={logo} width={300} height={300} style={{ width: "100%", objectFit: "contain" }} />
        </Link>
    )
}