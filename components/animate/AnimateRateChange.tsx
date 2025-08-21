"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function AnimateRateChange({ amount, animateTime = 2500, stepper = 1 }: { amount: number, animateTime?: number, stepper?: number }) {
    const { ref, inView } = useInView()

    const [animateAmount, animateAmountSet] = useState(0)

    const [timeLoop,] = useState(() => {
        return animateTime / amount
    })

    const looper = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        if (inView) {
            if (looper.current) clearInterval(looper.current)

            looper.current = setInterval(() => {
                animateAmountSet(prev => {
                    const newAmount = prev + stepper

                    if (newAmount >= amount) {
                        clearInterval(looper.current)
                        return amount
                    }

                    return newAmount
                })
            }, timeLoop)

        } else {
            animateAmountSet(0)
        }
    }, [inView])

    return (
        <span ref={ref}>{animateAmount}</span>
    )
}
