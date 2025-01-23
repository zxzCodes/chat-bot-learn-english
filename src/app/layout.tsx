import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navbar from "@/components/common/nav-bar"
import { ThemeProvider } from "next-themes"
import {
  ClerkProvider,
  
} from '@clerk/nextjs'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "langLo",
  description: "Your AI language learning companion",
  icons:{
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider> 
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}

