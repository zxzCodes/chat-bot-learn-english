"use client"

import useModel from "@/hooks/useModel"
import { Button } from "./ui/button"

export default function CallPremium() {
  const {  setOpen } = useModel()
  return (
    <Button
      onClick={() => setOpen(true)}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800"
    >
      Upgrade to Premium
    </Button>
  )
}

