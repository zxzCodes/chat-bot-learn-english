
import { BookOpen, MessageSquare, Stars, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaxWidthWrapper from "@/components/common/max-width-wrapper";
import Image from "next/image";
import Link from "next/link";


const features = [

  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Interactive Conversations",
    description: "Practice real-world scenarios with our AI-powered chat system",
    badge: "Real-time Learning"
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Personalized Learning",
    description: "Adaptive learning path that grows with your progress",
    badge: "Smart AI"
  },
  {
    icon: <Stars className="h-8 w-8" />,
    title: "Instant Feedback",
    description: "Get immediate corrections and suggestions to improve your language skills",
    badge: "24/7 Support"
  },
  {
    icon: <Stars className="h-8 w-8" />,
    title: "Quiz Generation",
    description: "Automatically generate quizzes based on your learning progress",
    badge: "Custom Quizzes"
  },
  {
    icon: <Stars className="h-8 w-8" />,
    title: "Error Simulation",
    description: "AI intentionally makes mistakes to help you learn better",
    badge: "Enhanced Learning"
  },
];

const About =  () => {

 

  



  return (
    <MaxWidthWrapper className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2 mb-4">
            Your Language Learning Companion
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Master Languages Through
            <br />
            Natural Conversations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform helps you master new languages through
            immersive conversations and personalized feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
            <Image
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Language Learning"
              width={400}
              height={400}
              priority
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground text-lg">
              We combine cutting-edge AI technology with proven language learning
              methodologies to create an immersive and effective learning
              experience. Our intelligent chatbot adapts to your level, providing
              real-time feedback and natural conversations.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/about">Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

               
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <Badge variant="secondary" className="mb-3">
                  {feature.badge}
                </Badge>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Transform Your Language Journey?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join thousands of learners who are already experiencing the power of AI-driven
            language learning.
          </p>
          <Button size="lg" className="px-8">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default About;