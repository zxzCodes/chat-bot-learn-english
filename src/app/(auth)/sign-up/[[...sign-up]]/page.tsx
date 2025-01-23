import MaxWidthWrapper from '@/components/common/max-width-wrapper'
import { SignUp } from '@clerk/nextjs'
import React from 'react'


const Page = () => {
  return <MaxWidthWrapper className='mx-auto flex justify-center items-center min-h-screen'><SignUp /></MaxWidthWrapper>
}

export default Page