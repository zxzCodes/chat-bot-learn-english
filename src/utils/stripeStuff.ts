'use server'
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import { onCurrentUser } from "@/actions/user"
import Stripe from "stripe"

export async function checkIfUserHasStripeId(): Promise<{
    isSubscribed: boolean;
    subscriptionData: Stripe.Subscription[]
  }> {
    const userAuth = await onCurrentUser()
    const user = await prisma.user.findUnique({
        where: {
           id: userAuth.id
        }
    })

if(!user?.stripe_customer_id) {
    return {
        isSubscribed: false,
        subscriptionData: []
    }
}

const subscription = await stripe.subscriptions.list({
    customer: user.stripe_customer_id
})

return {
    isSubscribed: subscription.data.length > 0,
    subscriptionData: subscription.data

}
   
}

export async function createCheckoutLink(customer: string) {
    const checkout = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?success=false`,
      customer: customer,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
    });
  
    return checkout.url;
  }

  export async function generateCustomerPortalLink(customerId: string) {
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
       
      }
  
  );
     
  
      return portalSession.url;
    }
    catch (error) {
      console.error(error);
  
      throw new Error("Error creating portal link");
    }
  }

  export async function createCustomerIfNull() {
    const userAuth = await onCurrentUser()
    const user = await prisma.user.findUnique({
        where: {
           id: userAuth.id
        }
    })

    if(user?.stripe_customer_id) {
        return user.stripe_customer_id
    }

    const customer = await stripe.customers.create({
        email: userAuth.emailAddresses[0].emailAddress
    })

    await prisma.user.update({
        where: {
            id: userAuth.id
        },
        data: {
            stripe_customer_id: customer.id
        }
    })

    return customer.id
  }


  //if the user has more then no subscripn and the user can only have 1 conversation in free tier the user need to upprgade plan to have more then 1 conversation


  export async function checkConversationCreationEligibiluity():Promise<{
    isEligible: boolean,
    message: string,
    remainingConversations: number

  }> {
      const userAuth = await onCurrentUser() // get the user from the auth
      const user = await prisma.user.findUnique({
          where: {
             id: userAuth.id
          }
      }) // get the user from the database

      if(!user) {
          return {
              isEligible: false,
              message: 'User not found',
              remainingConversations: 0
          }
      } // if the user is not found return false

      const stripeSubscription = await checkIfUserHasStripeId() //  check if the user has a stripe subscription

      const currentDate = new Date(); //  get the current date
  
      let isSubscribed = false; // set the user to not subscribed
      let periodStart: number; // set the period start
      let periodEnd: number; // set the period end
      let subscriptionDated: number | null = null; // set the subscription date to null

      if(stripeSubscription.subscriptionData.length > 0) {
          const subscriion = stripeSubscription.subscriptionData[0] // get the first subscription
          isSubscribed = subscriion.status === 'active' // check if the subscription is active
          periodStart = subscriion.current_period_start //  get the current period start
          periodEnd = subscriion.current_period_end // get the current period end
          subscriptionDated = subscriion.created // get the subscription date
      } // if the user has a subscription

      else {
        periodStart = Math.floor(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() /
            1000
        ); // get the period start
        periodEnd = Math.floor(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ).getTime() / 1000
        ); // get the period end
      }


      const conversationCount = await prisma.conversation.count({
        where: {
          userId: user.id, // get the user id
          
          createdAt: {
            gte: new Date(
              isSubscribed ? Math.min(subscriptionDated!, periodStart) : periodStart * 1000
            ), // get the created at date
            lt: new Date(periodEnd * 1000) // get the end date 
          },
        
        }
      }) // get the conversation count


      const limit = isSubscribed ? 20 : 5 // set the limit to 40 if the user is subscribed and 5 if the user is not subscribed

      const remainingConversations =  Math.max(0, limit - conversationCount) // get the remaining conversations

      if(remainingConversations === 0) {
        const resetDate = new Date(periodEnd * 1000).toLocaleDateString() // get the reset date
          return {
              isEligible: false,
              message: isSubscribed ? `You have reached your conversation limit for this month. Your limit will reset on ${resetDate}` : 'You have reached your conversation limit for this month. Upgrade to a premium plan to get more conversations',
              remainingConversations: 0
          }
      }

      return {
          isEligible: true,
          message:`You have ${remainingConversations} remaining conversations`,
          remainingConversations: remainingConversations
      }




      

    






  }
