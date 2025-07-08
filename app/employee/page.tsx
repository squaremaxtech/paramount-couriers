import { employeeOrAdminCheck } from '@/serverFunctions/handleAuth'
import React from 'react'

export default async function Page() {
    await employeeOrAdminCheck()

    return (
        <div>Page</div>
    )
}
