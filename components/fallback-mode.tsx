"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Info } from "lucide-react"
import Image from "next/image"

interface FallbackModeProps {
  moduleTitle: string
  instructionText: string
  onContinue: () => void
}

export function FallbackMode({ moduleTitle, instructionText, onContinue }: FallbackModeProps) {
  return (
    <div className="w-full space-y-4">
      <Card className="border-maryland-gold/30">
        <CardHeader className="bg-maryland-gold/10 border-b border-maryland-gold/20">
          <CardTitle className="flex items-center gap-2">
            <Info size={18} />
            <span>Camera-Free Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm mb-4">
            You're currently viewing this tutorial without camera access. You can still learn about your BMW's features,
            but without the AR overlay experience.
          </p>

          <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 mb-4">
            <Image src="/bmw-x6-interior.png" alt="BMW X6 Dashboard" fill className="object-cover" />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">{moduleTitle}</h3>
            <p className="text-sm">{instructionText}</p>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-maryland-gold/30"
              onClick={() => {
                // Try to request camera permission again
                navigator.mediaDevices
                  .getUserMedia({ video: true })
                  .then(() => window.location.reload())
                  .catch((err) => console.error("Camera permission denied again:", err))
              }}
            >
              <Camera size={16} />
              <span>Try Camera Again</span>
            </Button>

            <Button className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black" onClick={onContinue}>
              Continue Without Camera
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
