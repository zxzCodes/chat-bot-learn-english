import MaxWidthWrapper from '@/components/common/max-width-wrapper'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <MaxWidthWrapper className='mx-auto flex justify-center items-center min-h-screen'>
      <SignIn />
    </MaxWidthWrapper>
  )
}

export default Page
