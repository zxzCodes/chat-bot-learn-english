import { verifyUser } from '@/actions/user'
import MaxWidthWrapper from '@/components/common/max-width-wrapper'
import Dashboard from '@/components/dashboard'
import prisma from '@/lib/prisma'

import { redirect } from 'next/navigation'
import React from 'react'


export default async function page() {
const {succes,userExist} =  await verifyUser()
if(!succes || !userExist){ {
  redirect('/sign-in')
}
}

const user = await prisma.user.findUnique({
  where: {
    id: userExist.id
  }

}) 

if(!user) {
  redirect('/sign-in')
}








const quizez = await prisma.quiz.findMany({
  where: {
    userId:  userExist.id
  },
  include: {
    questions: true // Include the questions and answers
  }
}) 

const conversations = await prisma.conversation.findMany({
  where: {
    userId: userExist.id
  },
  include: {
    message: true
  },
  orderBy: {
    createdAt: 'desc' 
  }

})
  return (
    <MaxWidthWrapper className='mt-20'>
<Dashboard  conversations={conversations} quizzes={quizez} />
    </MaxWidthWrapper>
  )
}
