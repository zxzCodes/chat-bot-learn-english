import Chat from '@/components/chat'
import MaxWidthWrapper from '@/components/common/max-width-wrapper'
import GramerImprovements from '@/components/gramer-improvements'

import prisma from '@/lib/prisma'


import { Correction } from '@prisma/client'
import { notFound} from 'next/navigation'
import React from 'react'
type ChatProps = {
    params: {
        chatid: string
    }

}

export default async  function ChatId({params}: ChatProps) {
    const {chatid} = await params

    const chat = await prisma.conversation.findUnique({
        where: {
            id: chatid
        },
        select:{
            message:{
                include:{
                    improvements:true
                }
            }
        }
    })





    if(!chat) {
        return notFound()
    }
 

   
  return (
    <MaxWidthWrapper
    className=' mt-20'
    >
        <div className='grid grid-cols-1 md:grid-cols-12 sm:gap-6 gap-2'>
            <div
            className='col-span-1 md:col-span-8'
            >
                <Chat 
                initialMessages={chat?.message || []}
                conversationId={chatid}

                
                
                />
            </div>

            <div className='grid col-span-1 md:col-span-4'>
                <GramerImprovements
                improvements={
                    chat.message.map((message) => message.improvements).filter(Boolean) as Correction[]
                }
                
                
                
                />

            </div>

        </div>
    </MaxWidthWrapper>
  )
}
