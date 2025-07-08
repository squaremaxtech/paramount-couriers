import { adminCheck } from '@/serverFunctions/handleAuth'
import React from 'react'

export default async function Page() {
  await adminCheck()

  return (
    <div>admin Page</div>
  )
}
