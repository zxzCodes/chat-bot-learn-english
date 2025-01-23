"use client";
import { Message } from "@prisma/client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send,LoaderCircle } from "lucide-react";
import { saveGramerImprovements, sendMessageToDB } from "@/lib/db";
// import { continueConversation } from "@/utils/open-ai";
// import { findGrammarImprovements } from "@/utils/open-ai";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

import { continueConversation, findGrammarImprovements } from "@/utils/open-ai.";


import { useAuth } from '@clerk/nextjs'



const Chat = ({
  initialMessages,
  conversationId,
}: {
  initialMessages: Message[];
  conversationId: string;
}) => {

    const {userId} = useAuth()

    
  const {toast} = useToast();
  const [message, setMessage] = useState<string>(""); // for the input field
  const [messages, setMessages] = useState<Message[]>(initialMessages); // for the chat messages
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // for the loading spinner
  const [isTyping, setIsTyping] = useState<boolean>(false); // for the typing indicator
 

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }


  }

  const sendMessage = async () => {

    if(!userId) return // check if the user is logged in
    
    if(!message.trim() || isProcessing) return // check if the message is empty or if the message is being processed
      
    setIsProcessing(true)
    setIsTyping(true)

    const currentMessage = message.trim() // remove any whitespace from the message
    setMessage("") // clear the input field
    try {
        const userMessage = {
            content: currentMessage,
            role: "user",
            id: uuidv4(),
            conversationId: conversationId,
            createdAt: new Date()


   
        } // create a new message object

        setMessages((prev) => [...prev, userMessage]) // add the message to the chat
        if(isTyping) {
            setMessages((prev) => [...prev, {
                content: "...",
                role: " typing-indicator",
                id: uuidv4(),
                conversationId: conversationId,
                createdAt: new Date()
            } as Message])
           
        } // add the typing indicator to the chat

        const [newMessage,correction] = await Promise.all([
            sendMessageToDB(currentMessage, conversationId, 'user'),
            findGrammarImprovements(currentMessage)
        ]) // send the message to the database and check for grammar mistakes

        if(!newMessage) {
            throw new Error("Failed to send message")
        } // throw an error if the message fails to send
        if(correction && newMessage && newMessage.content !== 'No grammar mistakes found') {
            await saveGramerImprovements(newMessage.id,correction)
        } // save the grammar mistakes to the database

     setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !==  userMessage.id)

        return [...filtered, newMessage]

     }) // update the chat with the new message

     const aiResponse = await continueConversation([
            ...messages,
            userMessage
        ], currentMessage) // get the AI response

        if(!aiResponse) {
            throw new Error("Failed to get response")
        }
        const newAiMessage = await sendMessageToDB(aiResponse.content, conversationId, 'assistant') // send the AI response to the database

        if(!newAiMessage) {
            throw new Error("Failed to send message")
        }

    setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== "typing-indicator")

        return [...filtered, newAiMessage]

    }

    ) // update the chat with the AI response

     
        

 


        
    } catch (error) {
        console.log(error)
        toast({
            title: "Failed to send message",
            description: "Please try again",
            
        });
        setMessages((prev) => prev.filter(msg => msg.id !== "typing-indicator")) // remove the typing indicator if the message fails to send

        
    }
    finally {
        setIsProcessing(false) // stop the loading spinner
        setIsTyping(false)// stop the typing indicator
//

    }

      
    
  }


  return (
    <div className="min-h-screen  sm:mt-11 pb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Badge variant={"default"} className="w-32 flex justify-center">
          English Practice
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Conversation
        </h1>
        <p className="text-muted-foreground">
          Practice your English with our AI language partner
        </p>
      </motion.div>
      <Card className="mb-4">
        <CardContent className="p-6">
          <motion.div
            className="space-y-4 mb-6 min-h-[300px] max-h-[350px] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  layout
                  key={msg.id}
                  layoutId={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        msg.role === "assistant"
                          ? "/ai-avatar.png"
                          : "/user-avatar.png"
                      }
                    />
                    <AvatarFallback>
                      {msg.role === "assistant" ? "AI" : "ME"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      msg.role === "assistant"
                        ? "bg-accent/10 text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Separator className="my-4" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <div className="flex-1 flex gap-3">
              <Input
                placeholder={
                  isProcessing
                    ? "Waiting for response..."
                    : "Type your message.."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
               
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                className="shrink-0"
                onClick={sendMessage}
                disabled={!message.trim() || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-5 w-5"
                  >
                    <LoaderCircle />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;