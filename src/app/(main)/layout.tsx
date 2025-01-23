import prisma from '@/lib/prisma'
import { checkConversationCreationEligibiluity,  createCheckoutLink, createCustomerIfNull, generateCustomerPortalLink } from '@/utils/stripeStuff'

import React from 'react'
import { redirect } from 'next/navigation'
import { StripeStuffProvider } from '@/providers/stripe-stuff-providers'
import { Toaster } from "@/components/ui/sonner"
import PremiumModal from '@/components/premium-model'
import { onCurrentUser } from '@/actions/user'

export default async  function layout({children}: {children: React.ReactNode}) {

    const userExist = await onCurrentUser()

    if(!userExist) {
        redirect('/sign-in')
    }

    await createCustomerIfNull()

  
    
    

    const user = await prisma.user.findUnique({
        where: {
          id: userExist.id
        }
      
      }) 
      
      if(!user || !user.stripe_customer_id) {
        redirect('/sign-in')
      }

      const manage_link = await  generateCustomerPortalLink(user.stripe_customer_id)
      const checkout_link = await createCheckoutLink(user.stripe_customer_id)

      const  {isEligible,message,remainingConversations} = await checkConversationCreationEligibiluity()

      
    
  return (
   <StripeStuffProvider

   checkout_link={checkout_link}
    manage_link={manage_link}
    isEligible={isEligible}
    message={message}
    remainingConversations={remainingConversations}




   
   
   >

    {children}
    <PremiumModal/>
    <Toaster />
   </StripeStuffProvider>
  )
}
