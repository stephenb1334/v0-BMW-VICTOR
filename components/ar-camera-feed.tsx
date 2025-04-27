"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Camera } from "lucide-react"

interface ARCameraFeedProps {
  onCameraReady?: () => void
  children?: React.ReactNode
}

export function ARCameraFeed({ onCameraReady, children }: ARCameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      if (!videoRef.current) return

      // Request camera with ultrawide if available
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      videoRef.current.srcObject = stream
      setCameraActive(true)
      setCameraError(null)
      if (onCameraReady) onCameraReady()
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Unable to access your camera. Please ensure you've granted camera permissions.")
    }
  }

  useEffect(() => {
    return () => {
      // Clean up camera stream when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {cameraError && (
        <Alert variant="destructive" className="mb-4 border-maryland-red bg-maryland-red/10">
          <AlertCircle className="h-4 w-4 text-maryland-red" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{cameraError}</AlertDescription>
        </Alert>
      )}

      {!cameraActive ? (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-100 rounded-lg border border-maryland-gold/30">
          <Camera className="h-16 w-16 text-maryland-gold mb-4" />
          <p className="text-gray-600 mb-6 text-center px-4">
            This tutorial requires camera access to overlay AR instructions on your BMW dashboard
          </p>
          <Button
            onClick={startCamera}
            className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
          >
            Enable Camera
          </Button>
        </div>
      ) : (
        <div className="relative w-full h-[70vh]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-lg border border-maryland-gold/30"
          />
          <div className="absolute inset-0 z-10">{children}</div>
        </div>
      )}
    </div>
  )
}
