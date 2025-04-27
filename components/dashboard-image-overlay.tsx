"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface DashboardImageOverlayProps {
  moduleId: string
}

export function DashboardImageOverlay({ moduleId }: DashboardImageOverlayProps) {
  const [imageSrc, setImageSrc] = useState("/bmw-x6-interior.png")

  useEffect(() => {
    // Different images for different modules
    switch (moduleId) {
      case "1":
        setImageSrc("/bmw-x6-interior.png")
        break
      case "2":
        setImageSrc("/bmw-x6-driver-view.png")
        break
      case "3":
        setImageSrc("/bmw-x6-interior.png") // Infotainment focus
        break
      case "4":
        setImageSrc("/bmw-x6-interior.png") // Climate focus
        break
      case "5":
        setImageSrc("/bmw-x6-driver-view.png") // Drive modes
        break
      case "11":
        setImageSrc("/bmw-x6-interior.png") // Cat ejection
        break
      default:
        setImageSrc("/bmw-x6-interior.png")
    }
  }, [moduleId])

  return (
    <div className="absolute inset-0 z-0">
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt="BMW X6 Dashboard"
        fill
        className="object-cover opacity-50"
        priority
      />
      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
        <div className="bg-white/80 px-4 py-2 rounded-lg text-sm">Test Mode: Using simulated dashboard image</div>
      </div>
    </div>
  )
}
