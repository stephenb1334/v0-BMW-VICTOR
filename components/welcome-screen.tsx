"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function WelcomeScreen({ userName = "Victor" }: { userName?: string }) {
  const router = useRouter()
  const [voicePlayed, setVoicePlayed] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = () => {
    setIsStarting(true)
    // Simply navigate to the overview page without requesting camera permission
    // The camera permission will be handled in the AR components
    router.push("/overview")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Maryland flag-inspired diagonal pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/maryland-pattern.png')] bg-repeat opacity-20"></div>
      </div>

      {/* BMW roundel with Maryland colors */}
      <div className="relative w-32 h-32 mb-8">
        {/* Placeholder for the dashboard image component */}
      </div>

\
