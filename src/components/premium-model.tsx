// components/PremiumModal.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {  buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star } from 'lucide-react';
import useModel from '@/hooks/useModel';
import { useStripeStuff } from '@/providers/stripe-stuff-providers';
import Link from 'next/link';


const premiumTierFeatures = [
  'Unlimited conversations',
  'Advanced language exercises',
  'Full vocabulary access',
  'Priority support 24/7',
  'Detailed progress analytics',
  'Pronunciation feedback',
  'Custom learning paths',
  'Offline mode access',
];

const PremiumModal: React.FC = () => {
  const { open,setOpen } = useModel()

  const {checkout_link} = useStripeStuff()

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1">
            <Sparkles className="h-4 w-4 mr-1 inline" />
            MOST POPULAR
          </Badge>
        </div>
        <DialogHeader className="pb-8 pt-6">
          <DialogTitle className="text-2xl font-bold text-center mb-2">Premium Plan</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Unlock unlimited chat with the AI and more!
          </DialogDescription>
          <div className="text-center mt-4">
            <span className="text-4xl font-bold">$10</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <ul className="space-y-3">
            {premiumTierFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
         <Link href={checkout_link!} className={buttonVariants()}>
            Upgrade
            </Link>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
