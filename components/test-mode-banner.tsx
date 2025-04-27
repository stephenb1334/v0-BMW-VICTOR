"use client"

import { useState } from "react"
import { AlertCircle, X } from "lucide-react"

export function TestModeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 mx-auto w-full max-w-md z-50 p-2">
      <div className="bg-maryland-gold/90 text-maryland-black p-3 rounded-lg shadow-lg flex items-center gap-2">
        <AlertCircle size={16} />
        <span className="text-sm flex-1">
          Test Mode: Using simulated dashboard. Point your phone at any surface to continue.
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-maryland-gold/80 rounded"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
