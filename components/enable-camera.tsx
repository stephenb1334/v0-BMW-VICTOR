"use client"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"

interface EnableCameraProps {
  onCameraEnabled?: () => void
}

export function EnableCamera({ onCameraEnabled }: EnableCameraProps) {
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [permissionState, setPermissionState] = useState<string>("prompt") // 'prompt', 'granted', 'denied'

  // Check if camera permissions were previously granted
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check if we can access camera devices without requesting the stream
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")

        // If we have video devices with labels, permissions were likely granted before
        if (videoDevices.length > 0 && videoDevices.some((device) => device.label)) {
          setPermissionState("granted")
          setCameraEnabled(true)
          if (onCameraEnabled) {
            onCameraEnabled()
          }
        }
      } catch (error) {
        console.log("Permission check failed:", error)
      }
    }

    checkPermissions()
  }, [onCameraEnabled])

  const requestCameraAccess = async () => {
    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (stream) {
        // Stop the stream immediately since we're just checking for permission
        stream.getTracks().forEach((track) => track.stop())

        setPermissionState("granted")
        setCameraEnabled(true)
        console.log("Camera permission granted.")

        // Call the callback after a short delay
        setTimeout(() => {
          if (onCameraEnabled) {
            onCameraEnabled()
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Camera error:", error)
      setPermissionState("denied")
      setErrorMessage("Camera access failed. Please allow camera permission and refresh the page.")
    } finally {
      setIsRequesting(false)
    }
  }

  // If permission is already granted, call onCameraEnabled immediately
  useEffect(() => {
    if (permissionState === "granted" && onCameraEnabled) {
      onCameraEnabled()
    }
  }, [permissionState, onCameraEnabled])

  if (permissionState === "granted") {
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
    <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30">
      <Camera className="h-16 w-16 text-maryland-gold mb-4" />
      <h2 className="text-xl font-bold mb-4">Enable Your Camera</h2>
      <p className="text-gray-600 mb-6 text-center px-4 max-w-md">
        This tutorial requires camera access to overlay AR instructions on your BMW dashboard
      </p>
      <button
        onClick={requestCameraAccess}
        disabled={isRequesting}
        className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold py-6 px-8 text-lg rounded"
        style={{ touchAction: "manipulation" }}
      >
        {isRequesting ? "Requesting access..." : "Enable Camera"}
      </button>
      {errorMessage && <p className="mt-4 text-sm text-red-500 text-center px-4 max-w-md">{errorMessage}</p>}

      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={() => {
            localStorage.setItem("bmwX6_fallback_mode", "true")
            window.location.reload()
          }}
          className="text-sm text-gray-500 underline"
        >
          Continue without camera (Test Mode)
        </button>
      </div>
    </div>
  )
}
