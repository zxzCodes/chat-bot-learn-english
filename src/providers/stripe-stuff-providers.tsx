'use client'

import { createContext,useContext } from "react"
type StripeStuffProps = {
    checkout_link: string | null
    manage_link: string
    isEligible: boolean
    message: string
    remainingConversations: number


}

const StipeStuffContext = createContext<StripeStuffProps | undefined> (undefined)


type StripeStuffProviderProps = StripeStuffProps & {
    children: React.ReactNode
}
export const StripeStuffProvider = ({children,checkout_link,manage_link,    isEligible,message,remainingConversations}:StripeStuffProviderProps) => {
    return (
        <StipeStuffContext.Provider value={{
            checkout_link,
            manage_link,
            isEligible,
            message,
            remainingConversations


        }}>
            {children}
        </StipeStuffContext.Provider>
    )
}











export const useStripeStuff = () => {
    const context = useContext(StipeStuffContext)
    if(!context) {
        throw new Error('useStripeStuff must be used within a StripeStuffProvider')
    }
    return context
}

