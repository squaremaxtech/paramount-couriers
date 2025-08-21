import CircularPercentage from '@/components/animate/CircularPercentage'
import React from 'react'

export default function PercentCard({ value, title, description }: { value: number, title: string, description: string }) {
    return (
        <div className='container' style={{ gridTemplateColumns: "1fr 4fr" }}>
            <CircularPercentage
                value={value}
            />

            <div className='container'>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}
