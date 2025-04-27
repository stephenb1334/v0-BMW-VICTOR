"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera } from "lucide-react"

export function EnableCamera({ onCameraEnabled }: { onCameraEnabled?: () => void }) {
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const router = useRouter()

  const requestCameraAccess = async () => {
    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (stream) {
        // Stop the stream immediately since we're just checking for permission
        stream.getTracks().forEach((track) => track.stop())

        setCameraEnabled(true)
        console.log("Camera permission granted.")

        // Either call the callback or navigate after a short delay
        setTimeout(() => {
          if (onCameraEnabled) {
            onCameraEnabled()
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Camera error:", error)
      setErrorMessage("Camera access failed. Please allow camera permission and refresh the page.")
      alert("Camera access failed. Please allow camera permission and refresh the page.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-white rounded-lg border border-maryland-gold/30">
      {!cameraEnabled ? (
        <>
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
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-green-600">Camera Enabled!</h2>
            <p className="text-gray-600 text-center">Great job. Proceeding to Augmented Reality dashboard...</p>
          </div>
        </>
      )}
    </div>
  )
}
