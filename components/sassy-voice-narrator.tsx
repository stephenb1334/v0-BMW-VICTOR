"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SassyVoiceNarratorProps {
  text?: string
  autoPlay?: boolean
  onComplete?: () => void
}

export function SassyVoiceNarrator({ text, autoPlay = true, onComplete }: SassyVoiceNarratorProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentText, setCurrentText] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // In a real implementation, this would use actual audio files or a text-to-speech API
  // For this demo, we'll simulate audio playback with a timer
  useEffect(() => {
    if (text && autoPlay && !isMuted) {
      playAudio(text)
    }
  }, [text, autoPlay, isMuted])

  const playAudio = (textToSpeak: string) => {
    if (isMuted) return

    setIsPlaying(true)
    setCurrentText(textToSpeak)

    // Simulate audio duration based on text length (roughly 100ms per character)
    const duration = Math.max(2000, textToSpeak.length * 100)

    // In a real implementation, this would play an actual audio file
    // For now, we'll just use a timeout to simulate audio playback
    setTimeout(() => {
      setIsPlaying(false)
      if (onComplete) onComplete()
    }, duration)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted && isPlaying) {
      // Stop current playback if we're muting
      setIsPlaying(false)
    }
  }

  return (
    <div className="relative">
      {/* Voice indicator - UPDATED: larger text and higher position */}
      {isPlaying && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-maryland-black/90 text-maryland-white p-5 rounded-lg shadow-lg border border-maryland-gold/30">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-maryland-gold rounded-full animate-sound-wave"
                    style={{
                      height: `${8 + Math.random() * 12}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="flex-1 text-base font-medium">{currentText}</p>
          </div>
        </div>
      )}

      {/* Mute button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-maryland-black border-maryland-gold shadow-lg"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-maryland-gold" />
        ) : (
          <Volume2 className="h-4 w-4 text-maryland-gold" />
        )}
      </Button>
    </div>
  )
}
