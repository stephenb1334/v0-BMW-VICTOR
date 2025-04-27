"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image src="/stylized-roundel.png" alt="BMW Logo" width={120} height={60} className="mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">BMW X6 Dashboard Tutorial</CardTitle>
          <CardDescription>Learn your vehicle's features through an interactive AR experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image src="/bmw-x6-interior.png" alt="BMW X6 Dashboard" fill className="object-cover" />
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              Interactive AR experience - no manual reading required
            </p>
            <p className="flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              Step-by-step guidance with a friendly AI assistant
            </p>
            <p className="flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              Complete the tutorial in under 30 minutes
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={() => router.push("/overview")}>
            Start Tutorial
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-4 text-xs text-gray-600">Requires camera access and works best on mobile devices</p>
    </div>
  )
}
