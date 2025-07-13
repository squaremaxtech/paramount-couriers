import { customerCheck } from '@/serverFunctions/handleAuth'
import React from 'react'

export default async function Page() {
  await customerCheck()

  return (
    <div>
      customer Page
    </div>
  )
}
