"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useAnimations, Html, Environment } from "@react-three/drei"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PawPrintIcon as Paw, ArrowUp } from "lucide-react"
import type * as THREE from "three" // Import THREE

interface CatEjectionARProps {
  catPlaced: boolean
  ejectButtonVisible: boolean
  catEjected: boolean
  currentStep: number
}

function CatModel({ ejected }: { ejected: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF("/assets/3d/duck.glb") // Using duck as placeholder for cat
  const { actions } = useAnimations(animations, group)
  const [position, setPosition] = useState([0, -0.5, 0])
  const [rotation, setRotation] = useState([0, 0, 0])
  const [scale, setScale] = useState(0.5)

  useFrame(() => {
    if (ejected && group.current) {
      // Move the cat upward when ejected
      setPosition((prev) => [prev[0], prev[1] + 0.1, prev[2]])

      // Add some rotation for fun
      setRotation((prev) => [prev[0], prev[1] + 0.1, prev[2] + 0.05])

      // Make it smaller as it "flies away"
      if (scale > 0.1) {
        setScale((prev) => prev * 0.98)
      }
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} position={position} rotation={rotation} scale={scale} />
    </group>
  )
}

function EjectButton({ onClick, visible }: { onClick: () => void; visible: boolean }) {
  if (!visible) return null

  return (
    <Html position={[0, -1, 0]} center>
      <Button
        onClick={onClick}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 animate-pulse"
        style={{ touchAction: "manipulation" }}
      >
        <Paw size={16} />
        <span>EJECT CAT</span>
        <ArrowUp size={16} />
      </Button>
    </Html>
  )
}

function SunroofOverlay({ open }: { open: boolean }) {
  return (
    <Html position={[0, 2, 0]} center>
      <div
        className={`w-64 h-16 border-4 ${open ? "border-green-500 bg-sky-200/50" : "border-gray-500 bg-gray-800/50"} rounded-lg transition-all duration-1000`}
      >
        {open && (
          <div className="flex justify-center items-center h-full">
            <span className="text-green-500 font-bold animate-pulse">SUNROOF OPEN</span>
          </div>
        )}
      </div>
    </Html>
  )
}

function CatScene({
  catPlaced,
  ejectButtonVisible,
  catEjected,
  onEject,
}: {
  catPlaced: boolean
  ejectButtonVisible: boolean
  catEjected: boolean
  onEject: () => void
}) {
  const { camera } = useThree()

  useEffect(() => {
    // Position camera to see the scene properly
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="apartment" />

      {/* Sunroof visualization */}
      <SunroofOverlay open={catEjected} />

      {/* Cat model */}
      {catPlaced && <CatModel ejected={catEjected} />}

      {/* Eject button */}
      <EjectButton onClick={onEject} visible={ejectButtonVisible && !catEjected} />

      {/* Passenger seat visualization */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color={catPlaced ? "#f8a5c2" : "#c0c0c0"} />
      </mesh>
    </>
  )
}

export function CatEjectionAR({ catPlaced, ejectButtonVisible, catEjected, currentStep }: CatEjectionARProps) {
  const [ejected, setEjected] = useState(false)
  const [playSound, setPlaySound] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setEjected(catEjected)
    if (catEjected) {
      setPlaySound(true)
    }
  }, [catEjected])

  useEffect(() => {
    if (playSound && audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e))
    }
  }, [playSound])

  const handleEject = () => {
    setEjected(true)
    setPlaySound(true)
  }

  return (
    <div className="absolute inset-0 z-20 pointer-events-auto">
      {/* Audio for sunroof and ejection */}
      <audio ref={audioRef} src="/mechanical_opening.mp3" preload="auto" />

      <Canvas style={{ touchAction: "none" }}>
        <Suspense fallback={null}>
          <CatScene
            catPlaced={catPlaced}
            ejectButtonVisible={ejectButtonVisible}
            catEjected={ejected}
            onEject={handleEject}
          />
        </Suspense>
      </Canvas>

      {/* Instruction overlay for step 1 */}
      {currentStep === 1 && !catPlaced && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 text-white p-4 rounded-lg text-center">
            <Paw className="mx-auto mb-2" />
            <p>Tap on the passenger seat to place a cat</p>
          </div>
        </div>
      )}

      {/* Ejection effects */}
      {ejected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-ping bg-pink-500/20 w-full h-full"></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-sky-300/70 to-transparent animate-pulse"></div>
          <div className="text-4xl font-bold text-pink-500 animate-bounce">EJECTING CAT!</div>
        </div>
      )}
    </div>
  )
}
