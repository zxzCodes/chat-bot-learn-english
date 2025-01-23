'use client'
import { Check, Sparkles,  Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/common/max-width-wrapper";
import Link from "next/link";
import { useStripeStuff } from "@/providers/stripe-stuff-providers";


const freeTierFeatures = [
  " 1 conversations with the AI ",
  "1 Quiz ",
  "Basic language exercises",
  "Limited vocabulary practice",
  "Community support",
  "Progress tracking",
  
];

const premiumTierFeatures = [
  "Unlimited conversations",
  "Advanced language exercises",
  "Full vocabulary access",
  "Priority support 24/7",
  "Detailed progress analytics",
  "Pronunciation feedback",
  "Custom learning paths",
  "Offline mode access",
];

const Pricing =() => {


  const {checkout_link} =   useStripeStuff()



  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <MaxWidthWrapper className="py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2 mb-4">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Choose Your Learning Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free or unlock unlimited potential with our premium plan.
            No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="border-2 relative">
            <CardHeader className="pb-8 pt-6">
              <h3 className="text-2xl font-bold text-center mb-2">Free Plan</h3>
              <p className="text-center text-muted-foreground">
                Perfect for getting started
              </p>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {freeTierFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
               <Link href="/sign-up">Start for Free</Link>
           
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1">
                <Sparkles className="h-4 w-4 mr-1 inline" />
                MOST POPULAR
              </Badge>
            </div>
            <CardHeader className="pb-8 pt-6">
              <h3 className="text-2xl font-bold text-center mb-2">Premium Plan</h3>
              <p className="text-center text-muted-foreground">
                Unlock unlimited potential
              </p>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">$10</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {premiumTierFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
              asChild
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                size="lg"
              >
                <Link href={checkout_link!}>Upgrade Now</Link>
               
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">100% Satisfaction Guaranteed</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Try our premium plan risk-free. If you&apos;re not completely satisfied,
            we&apos;ll refund your first month&apos;s subscription.
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Pricing;