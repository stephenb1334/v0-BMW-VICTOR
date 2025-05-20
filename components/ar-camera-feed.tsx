"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import Image from "next/image"
import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

interface ARCameraFeedProps {
  onCameraReady?: () => void
  onCameraError?: () => void
  children?: React.ReactNode
  testMode?: boolean
}

export function ARCameraFeed({ onCameraReady, onCameraError, children, testMode = false }: ARCameraFeedProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [testModeActive, setTestModeActive] = useState(testMode)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [grokResponse, setGrokResponse] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Function to analyze camera frame with Grok
  const analyzeCameraFrame = async () => {
    if (!canvasRef.current || !videoRef.current || isAnalyzing) return

    try {
      setIsAnalyzing(true)

      // Draw the current video frame to the canvas
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        // Convert canvas to data URL
        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.8)

        // Send to Grok for analysis
        const response = await generateText({
          model: xai("grok-3-beta"),
          prompt: `Analyze this BMW dashboard image and provide a brief, helpful explanation of what's visible. Focus on identifying dashboard elements and controls: ${dataUrl}`,
        })

        setGrokResponse(response.text)
      }
    } catch (error) {
      console.error("Error analyzing camera frame:", error)
      setGrokResponse("I couldn't analyze what's in the camera view. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

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

      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch((e) => {
              console.error("Error playing video:", e)
              setErrorMessage("Error displaying camera feed. Please refresh and try again.")
              if (onCameraError) onCameraError()
            })
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
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  // Add a debug function to check camera status
  const debugCamera = () => {
    console.log("Video element:", videoRef.current)
    console.log("Camera stream:", cameraStream)
    console.log("Video element ready state:", videoRef.current?.readyState)
    console.log("Video element error:", videoRef.current?.error)

    if (cameraStream) {
      console.log(
        "Camera tracks:",
        cameraStream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
        })),
      )
    }

    // Try to restart the camera
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = null
      setTimeout(() => {
        if (videoRef.current && cameraStream) {
          videoRef.current.srcObject = cameraStream
          videoRef.current.play().catch((e) => console.error("Error restarting video:", e))
        }
      }, 500)
    }
  }

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
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover rounded-lg border border-maryland-gold/30"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Debug button - only visible in development */}
          {process.env.NODE_ENV === "development" && (
            <button
              onClick={debugCamera}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
            >
              Debug Camera
            </button>
          )}

          {/* Grok analysis button */}
          <Button
            onClick={analyzeCameraFrame}
            disabled={isAnalyzing}
            className="absolute bottom-4 left-4 bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Dashboard"}
          </Button>

          {/* Grok response display */}
          {grokResponse && (
            <div className="absolute top-20 left-4 right-4 bg-maryland-black/90 text-maryland-white p-4 rounded-lg shadow-lg border border-maryland-gold/30 text-base">
              <p>{grokResponse}</p>
            </div>
          )}
        </>
      )}
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  )
}
