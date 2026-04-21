import React, { Suspense } from 'react'
import { ResetPasswordPage } from '../_components/resetPasswordPage'

const page = () => {
  return (
    <Suspense fallback={<p className="text-white">Prosessing...</p>}>
      <ResetPasswordPage />
    </Suspense>
  )
}

export default page
