"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Camera } from "lucide-react"
import Image from "next/image"

interface ARCameraFeedProps {
  onCameraReady?: () => void
  onCameraError?: () => void
  children?: React.ReactNode
  testMode?: boolean
}

export function ARCameraFeed({ onCameraReady, onCameraError, children, testMode = false }: ARCameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  const [testModeActive, setTestModeActive] = useState(testMode)

  const startCamera = async () => {
    try {
      setPermissionRequested(true)

      if (!videoRef.current) return

      // If test mode is active, don't actually request camera access
      if (testModeActive) {
        setCameraActive(true)
        if (onCameraReady) onCameraReady()
        return
      }

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
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play().catch((e) => console.error("Error playing video:", e))
        }
      }

      setCameraActive(true)
      setCameraError(null)
      if (onCameraReady) onCameraReady()
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Unable to access your camera. Please ensure you've granted camera permissions.")
      setPermissionRequested(false)
      if (onCameraError) onCameraError()
    }
  }

  // Check if camera permissions were previously granted
  useEffect(() => {
    const checkCameraPermission = async () => {
      // If test mode is active, skip permission check
      if (testModeActive) {
        startCamera()
        return
      }

      try {
        // Check if we can access camera devices without requesting the stream
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")

        // If we have video devices with labels, permissions were likely granted before
        if (videoDevices.length > 0 && videoDevices.some((device) => device.label)) {
          startCamera()
        }
      } catch (error) {
        console.log("Permission check failed:", error)
        // We'll handle this in the manual camera enable flow
      }
    }

    checkCameraPermission()

    // Clean up function
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [testModeActive])

  const handleRetry = () => {
    setCameraError(null)
    setPermissionRequested(false)
  }

  const enableTestMode = () => {
    setTestModeActive(true)
    // Save test mode preference
    localStorage.setItem("bmwX6_test_mode", "true")
    startCamera()
  }

  return (
    <div className="relative w-full h-full">
      {cameraError && (
        <Alert variant="destructive" className="mb-4 border-maryland-red bg-maryland-red/10">
          <AlertCircle className="h-4 w-4 text-maryland-red" />
          <AlertTitle>Camera Access Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>{cameraError}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleRetry}
                className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold"
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!cameraActive ? (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30">
          <Camera className="h-16 w-16 text-maryland-gold mb-4" />
          <p className="text-gray-600 mb-6 text-center px-4 max-w-md">
            This tutorial requires camera access to overlay AR instructions on your BMW dashboard
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button
              onClick={startCamera}
              disabled={permissionRequested}
              className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold py-6 text-lg"
              style={{ touchAction: "manipulation" }}
            >
              {permissionRequested ? "Waiting for permission..." : "Enable Camera"}
            </Button>
          </div>

          {permissionRequested && (
            <p className="mt-4 text-sm text-gray-500 text-center px-4 max-w-md">
              Please allow camera access in the browser prompt. If you don't see a prompt, check your browser settings.
            </p>
          )}

          {/* Developer-only test mode link at the bottom */}
          <div className="absolute bottom-2 w-full text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                enableTestMode()
              }}
              className="text-[10px] text-gray-400 hover:text-gray-500"
            >
              developers only - do not click
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[70vh]">
          {testModeActive ? (
            <div className="absolute inset-0 w-full h-full rounded-lg border border-maryland-gold/30 overflow-hidden">
              <Image src="/bmw-x6-interior.png" alt="BMW X6 Dashboard (Test Mode)" fill className="object-cover" />
              <div className="absolute top-0 left-0 bg-maryland-gold text-maryland-black text-xs px-2 py-1 m-2 rounded">
                Test Mode
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover rounded-lg border border-maryland-gold/30"
            />
          )}
          <div className="absolute inset-0 z-10">{children}</div>
        </div>
      )}
    </div>
  )
}
