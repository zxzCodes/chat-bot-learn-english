'use server'

import { onCurrentUser } from "@/actions/user"
import prisma from "./prisma"
import { Message } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function sendMessageToDB(message:string,conversationId:string,role:string):Promise<Message | undefined> {

    try {
        const user = await onCurrentUser()
        if(!user) {
            throw new Error("User not found")
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                userId: user.id
            }
        })

        if(!conversation) {
            throw new Error("Conversation not found")
        }

        const newMessage = await prisma.message.create({
            data: {
                role: role,
                content: message,
                conversationId: conversationId
            }

        })

        return newMessage

      


        
    } catch (error) {
        console.log(error)
        return undefined
        
    }





   }

   export async function  saveGramerImprovements(messageId:string,correction:{
    original:string,
    corrected:string,
    focus:string
   }) {

    await onCurrentUser()
    try {
        const user = await onCurrentUser()
        if(!user) {
            throw new Error("User not found")
        }

        const message = await prisma.message.findUnique({
            where: {

                id: messageId,
                
            }
        })

        if(!message) {
            throw new Error("Message not found")
        }

        const createCorrection = await prisma.correction.create({
            data: {
                original: correction.original,
                corrected: correction.corrected,
                focus: correction.focus,
                messageId: messageId
            }

        })

const updatedMessage = await prisma.message.update({
    where: {
        id: messageId
    },
    data: {
      improvements: {
        connect: {
          id: createCorrection.id
        }
      }
    }
})

if(!updatedMessage) {
    throw new Error("Failed to update message")
}

await prisma.user.update({
    where: {
        id: user.id
    },
    data:{
        weaknesses: {
            push: correction.focus
        }
    }
})

revalidatePath(`/chat/${updatedMessage.conversationId}`)

        
    } catch (error) {
    console.log(error)
    throw new Error("Failed to save grammar improvements")
        
    }
    
   }

   export async function deleteGrammarImprovement(
    messageId: string,
    conversationId: string
  ) {

    await onCurrentUser();
    try {
      await prisma.correction.delete({
        where: {
          id: messageId,
        },
      });
  
      revalidatePath(`/chat/${conversationId}`);
    } catch (error) {
      console.error("error deleting grammar improvement", error);
      return undefined;
    }
  }