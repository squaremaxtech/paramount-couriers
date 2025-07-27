import React from 'react'
import AddEditPackage from '@/components/packages/AddEditPackage'

export default function Page() {
    return (
        <main>
            <AddEditPackage wantedCrudObj={{ crud: "c" }} />
        </main>
    )
}