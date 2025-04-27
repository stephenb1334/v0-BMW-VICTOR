"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SassyVoiceNarrator } from "@/components/sassy-voice-narrator"
import Image from "next/image"
import { CheckCircle, Gift } from "lucide-react"

export default function CompletePage() {
  const router = useRouter()
  const [voicePrompt, setVoicePrompt] = useState<string | undefined>(undefined)
  const [showBonusButton, setShowBonusButton] = useState(false)

  useEffect(() => {
    // Play completion voice prompt
    setVoicePrompt(
      "Congratulations! You've officially graduated from the 'I have no idea what I'm doing' club to the 'I kinda know what I'm doing' club. Your BMW is impressed, and so am I!",
    )

    // Check if user has completed all regular modules
    const progress = localStorage.getItem("bmwX6_tutorial_progress")
    if (progress) {
      try {
        const { currentModule } = JSON.parse(progress)
        if (currentModule >= 10) {
          setShowBonusButton(true)
        }
      } catch (e) {
        console.error("Error parsing progress:", e)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-maryland-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Maryland flag-inspired diagonal pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/maryland-pattern.png')] bg-repeat opacity-20"></div>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-maryland-gold/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-maryland-gold/20 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-maryland-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-maryland-white">Tutorial Complete!</CardTitle>
          <CardDescription className="text-maryland-white/80">
            You've successfully completed the BMW X6 Dashboard Tutorial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-maryland-gold/30">
            <Image src="/bmw-x6-driver-view.png" alt="BMW X6 Dashboard" fill className="object-cover" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-maryland-white">What you've learned:</h3>
            <ul className="space-y-1 text-sm text-maryland-white/80">
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Dashboard Overview and Main Components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Instrument Cluster and Gauge Readings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Infotainment System Navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Climate Control and Comfort Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Drive Modes and Performance Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Phone Connectivity and Media Integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Voice Commands and Intelligent Assistant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Parking Assistance and Backup Cameras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-maryland-gold text-maryland-black p-1 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span>Ambient Lighting and Interior Customization</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {showBonusButton && (
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold flex items-center gap-2"
              onClick={() => router.push("/module/11")}
            >
              <Gift size={16} />
              <span>Unlock Secret Bonus Module</span>
              <Gift size={16} />
            </Button>
          )}

          <Button
            className="w-full bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
          <Button
            variant="outline"
            className="w-full border-maryland-gold/30 text-maryland-white hover:bg-maryland-gold/10"
            onClick={() => router.push("/overview")}
          >
            Restart Tutorial
          </Button>
        </CardFooter>
      </Card>

      {/* Maryland flag-inspired bottom border */}
      <div className="w-full h-2 flex mt-8">
        <div className="w-1/4 h-full bg-maryland-black"></div>
        <div className="w-1/4 h-full bg-maryland-gold"></div>
        <div className="w-1/4 h-full bg-maryland-red"></div>
        <div className="w-1/4 h-full bg-maryland-white"></div>
      </div>

      {voicePrompt && <SassyVoiceNarrator text={voicePrompt} />}
    </div>
  )
}
