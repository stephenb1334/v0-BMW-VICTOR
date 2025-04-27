"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function CameraDenied() {
  const router = useRouter()

  const refreshPage = () => {
    window.location.reload()
  }

  const enableTestMode = () => {
    localStorage.setItem("bmwX6_test_mode", "true")
    router.push("/overview")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Maryland flag-inspired diagonal pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/maryland-pattern.png')] bg-repeat opacity-20"></div>
      </div>

      {/* BMW roundel with Maryland colors */}
      <div className="relative w-24 h-24 mb-6">
        <Image src="/bmw-maryland-roundel.png" alt="BMW Maryland Edition" width={96} height={96} />
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-maryland-red/30">
        <h1 className="text-2xl font-bold mb-4 text-maryland-red text-center">Camera Access Denied</h1>
        <p className="text-gray-700 mb-6 text-center">
          You need to allow camera access to experience the BMW X6 AR tutorial.
        </p>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Please refresh the page and accept camera permission when prompted.
        </p>

        <Button
          onClick={refreshPage}
          className="w-full bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black font-bold py-6"
        >
          Refresh and Try Again
        </Button>

        {/* Developer-only test mode link at the bottom */}
        <div className="mt-6 w-full text-center">
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

      {/* Maryland flag-inspired bottom border */}
      <div className="w-full h-4 mt-8 flex">
        <div className="w-1/4 h-full bg-maryland-black"></div>
        <div className="w-1/4 h-full bg-maryland-gold"></div>
        <div className="w-1/4 h-full bg-maryland-red"></div>
        <div className="w-1/4 h-full bg-maryland-white"></div>
      </div>
    </div>
  )
}
