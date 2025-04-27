"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import Image from "next/image"

interface ARCameraFeedProps {
  onCameraReady?: () => void
  onCameraError?: () => void
  children?: React.ReactNode
  testMode?: boolean
}

export function ARCameraFeed({ onCameraReady, onCameraError, children, testMode = false }: ARCameraFeedProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [testModeActive, setTestModeActive] = useState(testMode)

  useEffect(() => {
    // If test mode is active, skip camera request
    if (testModeActive) {
      setCameraEnabled(true)
      if (onCameraReady) onCameraReady()
    }
  }, [testModeActive, onCameraReady])

  const requestCameraAccess = async () => {
    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((e) => console.error("Error playing video:", e))
          }
        }
      }

      setCameraEnabled(true)
      setErrorMessage("")
      if (onCameraReady) onCameraReady()
    } catch (error) {
      console.error("Camera error:", error)
      setErrorMessage("Camera access failed. Please allow camera permission and refresh the page.")
      if (onCameraError) onCameraError()

      // Redirect to camera denied page after a short delay
      setTimeout(() => {
        router.push("/camera-denied")
      }, 1500)
    } finally {
      setIsRequesting(false)
    }
  }

  const enableTestMode = () => {
    setTestModeActive(true)
    localStorage.setItem("bmwX6_test_mode", "true")
  }

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  if (!cameraEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30 relative">
        <Camera className="h-16 w-16 text-maryland-gold mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-maryland-black">Welcome to Your BMW X6 Experience</h1>
        <p className="text-gray-700 mb-6 text-center px-4 max-w-md">
          To begin the interactive dashboard tutorial, please enable your camera.
        </p>
        <Button
          onClick={requestCameraAccess}
          disabled={isRequesting}
          className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold py-6 px-8 text-lg"
          style={{ touchAction: "manipulation" }}
        >
          {isRequesting ? "Requesting access..." : "Enable Camera"}
        </Button>
        {errorMessage && <p className="mt-4 text-sm text-red-500 text-center px-4 max-w-md">{errorMessage}</p>}

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
            Developers only - Do not click
          </a>
        </div>
      </div>
    )
  }

  return (
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
  )
}
