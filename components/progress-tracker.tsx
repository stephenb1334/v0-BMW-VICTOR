"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface ProgressTrackerProps {
  currentModule: number
  totalModules: number
  storageKey?: string
}

export function ProgressTracker({
  currentModule,
  totalModules,
  storageKey = "bmwX6_tutorial_progress",
}: ProgressTrackerProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress percentage
    const percentage = Math.round((currentModule / totalModules) * 100)
    setProgress(percentage)

    // Save progress to localStorage if storageKey is provided
    if (storageKey) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          currentModule,
          totalModules,
          lastUpdated: new Date().toISOString(),
        }),
      )
    }
  }, [currentModule, totalModules, storageKey])

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-maryland-white">
        <span>
          Module {currentModule} of {totalModules}
        </span>
        <span>{progress}% Complete</span>
      </div>
      <Progress value={progress} className="h-2 bg-maryland-black" indicatorClassName="bg-maryland-gold" />
    </div>
  )
}
