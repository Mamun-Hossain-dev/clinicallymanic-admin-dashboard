import React, { Suspense } from 'react'
import { VerifyEmailPage } from '../_components/verifyEmailPage'

const page = () => {
  return (
    <Suspense fallback={<p className="text-white">Verifying...</p>}>
      <VerifyEmailPage />
    </Suspense>
  )
}

export default page
