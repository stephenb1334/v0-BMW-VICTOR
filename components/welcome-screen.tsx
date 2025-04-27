"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SassyVoiceNarrator } from "@/components/sassy-voice-narrator"
import Image from "next/image"

export function WelcomeScreen({ userName = "Victor" }: { userName?: string }) {
  const router = useRouter()
  const [voicePlayed, setVoicePlayed] = useState(false)

  const handleStart = () => {
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
        <Image src="/bmw-maryland-roundel.png" alt="BMW Maryland Edition" width={128} height={128} />
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-maryland-gold/30">
        <h1 className="text-4xl font-bold text-maryland-black mb-2 text-center">
          Welcome <span className="text-maryland-gold">{userName}!</span>
        </h1>

        <p className="text-xl text-maryland-black mb-6 text-center">Congrats on the new wheels.</p>

        <p className="text-maryland-black mb-8 text-center">
          Welcome to your tutorial. Let's see a car salesman match this shit.
        </p>

        <Button
          onClick={handleStart}
          className="w-full py-6 text-lg bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
        >
          Start My Tutorial
        </Button>

        <div className="mt-4 flex items-center justify-center">
          <div className="w-1/3 h-px bg-maryland-red"></div>
          <div className="px-3">
            <Image src="/bmw-wordmark.png" alt="BMW" width={60} height={20} />
          </div>
          <div className="w-1/3 h-px bg-maryland-red"></div>
        </div>
      </div>

      {/* Maryland flag-inspired bottom border */}
      <div className="w-full h-4 mt-8 flex">
        <div className="w-1/4 h-full bg-maryland-black"></div>
        <div className="w-1/4 h-full bg-maryland-gold"></div>
        <div className="w-1/4 h-full bg-maryland-red"></div>
        <div className="w-1/4 h-full bg-maryland-white"></div>
      </div>

      <SassyVoiceNarrator
        text="Welcome Victor! Congrats on the new wheels. Let's see a car salesman match this shit."
        autoPlay={!voicePlayed}
        onComplete={() => setVoicePlayed(true)}
      />
    </div>
  )
}
