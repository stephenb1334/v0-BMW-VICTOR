"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

interface HotspotOverlayProps {
  hotspots: Hotspot[]
  animationStyle?: "pulse_glow" | "bounce" | "fade"
  highlightColor?: string
}

export function HotspotOverlay({
  hotspots,
  animationStyle = "pulse_glow",
  highlightColor = "blue",
}: HotspotOverlayProps) {
  const [visibleHotspots, setVisibleHotspots] = useState<Hotspot[]>([])

  useEffect(() => {
    // Stagger the appearance of hotspots for a nicer effect
    const showHotspots = async () => {
      setVisibleHotspots([])
      for (let i = 0; i < hotspots.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setVisibleHotspots((prev) => [...prev, hotspots[i]])
      }
    }

    showHotspots()
  }, [hotspots])

  const getAnimationClass = () => {
    switch (animationStyle) {
      case "pulse_glow":
        return "animate-pulse shadow-glow"
      case "bounce":
        return "animate-bounce"
      case "fade":
        return "animate-fade-in"
      default:
        return "animate-pulse shadow-glow"
    }
  }

  const getColorClass = () => {
    switch (highlightColor) {
      case "blue":
        return "bg-blue-500 shadow-blue-400/50"
      case "red":
        return "bg-red-500 shadow-red-400/50"
      case "green":
        return "bg-green-500 shadow-green-400/50"
      default:
        return "bg-blue-500 shadow-blue-400/50"
    }
  }

  const getSizeClass = (size: Hotspot["size"]) => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-8 h-8"
      default:
        return "w-6 h-6"
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleHotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            onClick={hotspot.onClick}
            className={cn(
              "rounded-full flex items-center justify-center",
              getAnimationClass(),
              getColorClass(),
              getSizeClass(hotspot.size),
            )}
            aria-label={hotspot.label}
          >
            <span className="sr-only">{hotspot.label}</span>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-black/75 text-white text-xs px-2 py-1 rounded">
            {hotspot.label}
          </div>
        </div>
      ))}
    </div>
  )
}
