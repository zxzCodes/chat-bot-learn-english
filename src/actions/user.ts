'use server'
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const onCurrentUser = async () => {
    const user = await currentUser()
    if(!user) return redirect('/sign-in')
        return user
}

export async function  verifyUser() {
    try {
        const user = await onCurrentUser()
        const userExist = await prisma.user.findUnique({
            where: {
                id: user.id,
                email: user.emailAddresses[0].emailAddress

            }
        })
        if(!userExist) {
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.emailAddresses[0].emailAddress,
                    name: user.fullName!,
                   
                }
            })
        }
return {succes:true,  userExist}

        
    } catch (error) {
        console.log(error)
        return {succes:false}
        
    }
    
}

