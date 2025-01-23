"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { Sheet, SheetContent, SheetHeader, SheetTrigger,SheetTitle } from "@/components/ui/sheet"
import { DarkModeToggle } from "../dark-mode-toggle"
import MaxWidthWrapper from "./max-width-wrapper"


const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <MaxWidthWrapper
      className="fixed top-0 left-0 right-0 z-50 
    bg-white-100/20 backdrop-blur-md shadow-md
    dark:bg-background/90 dark:backdrop-blur-md dark:shadow-sm"
    >
      <nav className="flex items-center justify-between py-4 px-4">
        <div className="flex items-center">
          <Link href="/" className="md:text-2xl font-bold text-xl text-primary">
            LangLo
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <DarkModeToggle />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <Link href="/sign-in">
              <Button variant="default">Get Started</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <DarkModeToggle />
                <SheetTitle className="sr-only">dark mode</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors mt-2 py-2 rounded-lg hover:bg-accent/10 pr-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {!isSignedIn && (
                  <Link href="/sign-in">
                    <Button variant="default" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </MaxWidthWrapper>
  )
}

