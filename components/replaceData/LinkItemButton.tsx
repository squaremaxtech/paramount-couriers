"use client"
import { withId } from '@/types'
import { generateTrackingNumber } from '@/utility/utility'
import Link from 'next/link'
import React from 'react'

export default function LinkItemButton<T extends withId>({ link, seenObj, isPackage }: { link: string, seenObj: T, isPackage?: boolean }) {
    return (
        <Link href={`${link}/${seenObj.id}`}>
            <button className='button3'>
                {isPackage ? generateTrackingNumber(seenObj.id as number) : seenObj.id}

                <span className="material-symbols-outlined">
                    link
                </span>
            </button>
        </Link>
    )
}
