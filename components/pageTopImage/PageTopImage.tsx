import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import pageTopBackground from "@/public/pageTopBackground.jpg"

export default function PageTopImage({ title, bgImageSrc }: { title: string, bgImageSrc?: StaticImageData }) {
    return (
        <div className='container' style={{ position: "relative", alignContent: "center", height: "80svh", zIndex: 0, color: "var(--textC2)", padding: "var(--spacingEL)" }}>
            <Image alt={`${title} image`} src={bgImageSrc ?? pageTopBackground} fill={true} priority={true} style={{ objectFit: "cover", zIndex: -2 }} />

            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "var(--bg4)", opacity: .6, zIndex: -1 }}></div>

            <h1 style={{ color: "inherit" }}>{title}</h1>

            <h5 className='resetTextMargin flexContainer' style={{ color: "inherit" }}>
                <Link href={"/"}><span className='highlightText'>home</span></Link>

                <span>/</span>

                <span>{title}</span>
            </h5>
        </div>
    )
}
