"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EnableCameraProps {
  onCameraEnabled?: () => void
}

export function EnableCamera({ onCameraEnabled }: EnableCameraProps) {
  const router = useRouter()
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [permissionChecked, setPermissionChecked] = useState(false)

  // Check camera permissions on component mount
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Check if we can access camera devices
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")

        // If we have video devices with labels, permissions were likely granted before
        if (videoDevices.length > 0 && videoDevices.some((device) => device.label)) {
          setCameraEnabled(true)
          if (onCameraEnabled) {
            onCameraEnabled()
          }
        }
      } catch (error) {
        console.log("Permission check failed:", error)
      } finally {
        setPermissionChecked(true)
      }
    }

    checkCameraPermission()
  }, [onCameraEnabled])

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

      // Stop the stream immediately since we're just checking for permission
      stream.getTracks().forEach((track) => track.stop())

      setCameraEnabled(true)
      console.log("Camera permission granted.")

      // Call the callback after a short delay
      setTimeout(() => {
        if (onCameraEnabled) {
          onCameraEnabled()
        }
      }, 1000)
    } catch (error) {
      console.error("Camera error:", error)
      setErrorMessage("Camera access failed. Please allow camera permission and refresh the page.")

      // Redirect to camera denied page after a short delay
      setTimeout(() => {
        router.push("/camera-denied")
      }, 1500)
    } finally {
      setIsRequesting(false)
    }
  }

  const enableTestMode = () => {
    localStorage.setItem("bmwX6_test_mode", "true")
    router.push("/overview")
  }

  // Show loading state while checking permissions
  if (!permissionChecked) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30">
        <div className="animate-pulse">
          <Camera className="h-16 w-16 text-maryland-gold/50 mb-4" />
        </div>
        <p className="text-gray-500 text-center">Checking camera permissions...</p>
      </div>
    )
  }

  if (cameraEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-green-600">Camera Enabled!</h2>
          <p className="text-gray-600 text-center">Starting AR experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30 relative">
      <Camera className="h-16 w-16 text-maryland-gold mb-4" />
      <h2 className="text-xl font-bold mb-4 text-maryland-black">Enable Your Camera</h2>
      <p className="text-gray-600 mb-6 text-center px-4 max-w-md">
        This tutorial requires camera access to overlay AR instructions on your BMW dashboard
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
