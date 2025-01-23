import { verifyUser } from '@/actions/user';
import CallPremium from '@/components/premium-hit';
import prisma from '@/lib/prisma';
import { checkConversationCreationEligibiluity } from '@/utils/stripeStuff';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Chat() {
  const { succes, userExist } = await verifyUser();
  if (!succes || !userExist) {
    redirect('/sign-in');
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: userExist.id,
    },
  });

  if (!dbUser) {
    redirect('/sign-in');
  }

  // Check conversation creation eligibility before creating a new conversation
  const { isEligible, message, remainingConversations } = await checkConversationCreationEligibiluity();
  if (!isEligible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
          <CallPremium />
          <p className="mt-6 text-red-600 dark:text-red-400 font-medium text-lg animate-pulse">{message}</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">You have {remainingConversations} remaining conversations</p>
        </div>
      </div>
    )
  }

  // Create a new conversation if eligible
  const createdChat = await prisma.conversation.create({
    data: {
      userId: dbUser.id,
    },
  });

  // Redirect to the new chat session
  redirect(`/chat/${createdChat.id}`);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Creating chat session...</p>
    </div>
  );
}
