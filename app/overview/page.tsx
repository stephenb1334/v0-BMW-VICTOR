"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ARCameraFeed } from "@/components/ar-camera-feed"
import { SassyVoiceNarrator } from "@/components/sassy-voice-narrator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressTracker } from "@/components/progress-tracker"
import { Info } from "lucide-react"

// This would come from your API or JSON file in a real app
const overviewData = {
  page: "/overview",
  component: "ARDashboardOverview",
  cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
  instructions: [
    {
      stepId: "intro_001",
      text: "Welcome to your BMW X6 Dashboard Tutorial. Hold your phone steady in ultrawide mode (0.5x) pointed at the dashboard.",
      voicePrompt:
        "Alright speed racer, first thing — hold your phone like you hold a menu you can't read without glasses. Aim at the dashboard!",
    },
    {
      stepId: "intro_002",
      text: "You'll see AR highlights pop up over real parts of your dashboard.",
      voicePrompt: "See those fancy lights popping up? Those aren't ghosts. Those are your new best friends.",
    },
    {
      stepId: "intro_003",
      text: "Each hotspot will guide you through a feature step-by-step. Stay in camera mode the whole time.",
      voicePrompt: "Don't put the phone down. This is a tour, not a Netflix binge. Keep it up!",
    },
    {
      stepId: "intro_004",
      text: "Complete simple tasks to move forward. I'll be watching... and yes, I'll be judging.",
      voicePrompt: "I'm judging your dashboard skills harder than you judged my parking back in '74.",
    },
    {
      stepId: "intro_005",
      text: "Ready to start? Tap the big button when you're set!",
      voicePrompt:
        "If you're ready to dominate this dashboard and make your friends jealous, smash that start button like it owes you money!",
    },
  ],
  completionButton: {
    text: "Start the Tutorial!",
    nextRoute: "/module/1",
    voiceOnClick: "And we're off! Buckle up, Einstein.",
  },
  progressTracking: {
    saveInLocalStorage: true,
    storageKey: "bmwX6_tutorial_progress",
  },
  visualCueSettings: {
    hotspotHighlightColor: "blue",
    animationStyle: "pulse_glow",
  },
}

export default function OverviewPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [currentVoicePrompt, setCurrentVoicePrompt] = useState<string | undefined>(undefined)
  const [useFallbackMode, setUseFallbackMode] = useState(false)

  useEffect(() => {
    // Check if user has previously opted for fallback mode
    const fallbackMode = localStorage.getItem("bmwX6_fallback_mode") === "true"
    if (fallbackMode) {
      setUseFallbackMode(true)
    }
  }, [])

  const instructions = overviewData.instructions
  const currentInstruction = instructions[currentStep]

  useEffect(() => {
    if ((currentInstruction && cameraReady) || useFallbackMode) {
      setCurrentVoicePrompt(currentInstruction.voicePrompt)
    }
  }, [currentStep, cameraReady, currentInstruction, useFallbackMode])

  const handleNext = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStart = () => {
    setCurrentVoicePrompt(overviewData.completionButton.voiceOnClick)

    // Short delay to allow the voice to play before navigation
    setTimeout(() => {
      router.push(overviewData.completionButton.nextRoute)
    }, 1500)
  }

  const handleVoiceComplete = () => {
    // Auto-advance after voice narration if not on the last step
    if (currentStep < instructions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 1000)
    }
  }

  const enableFallbackMode = () => {
    setUseFallbackMode(true)
    localStorage.setItem("bmwX6_fallback_mode", "true")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white text-maryland-black p-4 shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold">Dashboard Tutorial</h1>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-maryland-gold rounded-full mr-2"></div>
            <span className="text-sm">Victor's X6</span>
          </div>
        </div>
        <ProgressTracker currentModule={0} totalModules={11} storageKey={overviewData.progressTracking.storageKey} />
      </header>

      <main className="flex-1 p-4 flex flex-col">
        {useFallbackMode ? (
          <Card className="bg-white border-maryland-gold/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-maryland-gold" />
                <h2 className="font-medium">Camera-Free Mode</h2>
              </div>
              <p className="text-sm mb-4">{currentInstruction?.text}</p>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-maryland-gold/30 text-maryland-black"
                >
                  Previous
                </Button>

                {currentStep === instructions.length - 1 ? (
                  <Button
                    className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
                    onClick={handleStart}
                  >
                    {overviewData.completionButton.text}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    className="border-maryland-gold/30 text-maryland-black"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <ARCameraFeed onCameraReady={() => setCameraReady(true)} onCameraError={() => setCameraError(true)}>
            {/* AR overlay content would go here */}
          </ARCameraFeed>
        )}

        {cameraError && !useFallbackMode && (
          <Card className="mt-4 border-maryland-red/30 bg-white/90">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-2 text-maryland-red">Camera Access Required</h2>
              <p className="text-sm text-gray-700 mb-4">
                This tutorial works best with camera access to provide AR overlays. Please enable camera access in your
                browser settings.
              </p>
              <Button
                onClick={enableFallbackMode}
                className="w-full bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black"
              >
                Continue Without Camera
              </Button>
            </CardContent>
          </Card>
        )}

        {!useFallbackMode && (
          <Card className="mt-4 border-maryland-gold/30 bg-white/90">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-2">{currentInstruction?.text}</h2>

              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-maryland-gold/30 text-maryland-black"
                >
                  Previous
                </Button>

                {currentStep === instructions.length - 1 ? (
                  <Button
                    className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
                    onClick={handleStart}
                  >
                    {overviewData.completionButton.text}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    className="border-maryland-gold/30 text-maryland-black"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Maryland flag-inspired bottom border */}
      <div className="w-full h-2 flex">
        <div className="w-1/4 h-full bg-maryland-black"></div>
        <div className="w-1/4 h-full bg-maryland-gold"></div>
        <div className="w-1/4 h-full bg-maryland-red"></div>
        <div className="w-1/4 h-full bg-maryland-white"></div>
      </div>

      {currentVoicePrompt && <SassyVoiceNarrator text={currentVoicePrompt} onComplete={handleVoiceComplete} />}
    </div>
  )
}
