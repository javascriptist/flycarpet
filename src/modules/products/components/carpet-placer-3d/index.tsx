'use client'

import { useEffect, useRef, useState } from "react"
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { detectFloorWithDepth, getFallbackFloorCorners } from "@lib/depth-floor-detection"

interface CarpetPlacer3DProps {
  roomImage: string
  carpetImage: string
  carpetWidth: number // in meters
  carpetLength: number // in meters
  countryCode?: string
  onClose: () => void
}

export const CarpetPlacer3D: React.FC<CarpetPlacer3DProps> = ({
  roomImage,
  carpetImage,
  carpetWidth,
  carpetLength,
  countryCode,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const carpetMeshRef = useRef<THREE.Mesh | null>(null)
  
  const [carpetPosition, setCarpetPosition] = useState({ x: 0, y: 0, z: 0 })
  const [carpetScale, setCarpetScale] = useState(1.0)
  const [carpetRotation, setCarpetRotation] = useState(0)
  const [opacity, setOpacity] = useState(0.9)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [modelUrl, setModelUrl] = useState<string | null>(null)

  const isLang = countryCode === 'uz'

  // Generate 3D model URL
  useEffect(() => {
    const generateModel = async () => {
      try {
        const params = new URLSearchParams({
          image: carpetImage,
          width: carpetWidth.toString(),
          length: carpetLength.toString(),
        })
        
        const response = await fetch(`/api/generate-carpet-model?${params}`)
        const data = await response.json()
        
        if (data.model_url) {
          setModelUrl(data.model_url)
        }
      } catch (error) {
        console.error('Failed to generate carpet model:', error)
      }
    }

    generateModel()
  }, [carpetImage, carpetWidth, carpetLength])

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !modelUrl) return

    const width = 800
    const height = 600

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Load room image as background
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(roomImage, (texture) => {
      // Create a plane for the room background
      const geometry = new THREE.PlaneGeometry(10, 7.5)
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
      const backgroundMesh = new THREE.Mesh(geometry, material)
      backgroundMesh.position.z = -5
      scene.add(backgroundMesh)
    })

    // Load carpet GLB model
    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        const carpet = gltf.scene
        carpet.position.set(carpetPosition.x, carpetPosition.y, carpetPosition.z)
        carpet.scale.set(carpetScale, carpetScale, carpetScale)
        carpet.rotation.y = (carpetRotation * Math.PI) / 180
        
        // Make carpet semi-transparent
        carpet.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial
              material.transparent = true
              material.opacity = opacity
            }
          }
        })

        carpetMeshRef.current = carpet as any
        scene.add(carpet)
        setIsLoading(false)

        // Animate
        const animate = () => {
          requestAnimationFrame(animate)
          renderer.render(scene, camera)
        }
        animate()
      },
      (progress) => {
        console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(0)}%`)
      },
      (error) => {
        console.error('Failed to load carpet model:', error)
        setIsLoading(false)
      }
    )

    // Cleanup
    return () => {
      renderer.dispose()
      scene.clear()
    }
  }, [modelUrl, roomImage])

  // Update carpet transform when sliders change
  useEffect(() => {
    if (!carpetMeshRef.current) return

    const carpet = carpetMeshRef.current
    carpet.position.set(carpetPosition.x, carpetPosition.y, carpetPosition.z)
    carpet.scale.set(carpetScale, carpetScale, carpetScale)
    carpet.rotation.y = (carpetRotation * Math.PI) / 180

    // Update opacity
    carpet.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial
          material.opacity = opacity
        }
      }
    })
  }, [carpetPosition, carpetScale, carpetRotation, opacity])

  // Handle drag to move carpet
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !carpetMeshRef.current) return

    const deltaX = (e.clientX - dragStart.x) * 0.01
    const deltaY = -(e.clientY - dragStart.y) * 0.01

    setCarpetPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
      z: prev.z
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleReset = () => {
    setCarpetPosition({ x: 0, y: 0, z: 0 })
    setCarpetScale(1.0)
    setCarpetRotation(0)
    setOpacity(0.9)
  }

  const handleDownload = () => {
    if (!rendererRef.current) return

    const canvas = rendererRef.current.domElement
    const link = document.createElement('a')
    link.download = 'carpet-room-visualization.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-gray-100 p-4"
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          className="border border-gray-300 rounded-lg shadow-lg"
        />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-gray-700">
              {isLang ? "3D model yuklanmoqda..." : "Загрузка 3D модели..."}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 p-6 space-y-4">
        {/* Instructions */}
        <div className="text-sm text-gray-600 mb-4">
          <p className="font-semibold mb-1">
            {isLang ? "Qanday foydalanish:" : "Как использовать:"}
          </p>
          <ul className="space-y-1">
            <li>• {isLang ? "Gilam harakatlantirish: sichqonchani bosib sudrang" : "Перемещение: нажмите и перетащите"}</li>
            <li>• {isLang ? "O'lcham, burilish va shaffoflikni sozlang" : "Настройте размер, поворот и прозрачность"}</li>
          </ul>
        </div>

        {/* Scale slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isLang ? "O'lchami" : "Размер"}: {Math.round(carpetScale * 100)}%
          </label>
          <input
            type="range"
            min="0.3"
            max="3"
            step="0.1"
            value={carpetScale}
            onChange={(e) => setCarpetScale(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Rotation slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isLang ? "Burilish" : "Поворот"}: {Math.round(carpetRotation)}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={carpetRotation}
            onChange={(e) => setCarpetRotation(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Opacity slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isLang ? "Shaffoflik" : "Прозрачность"}: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isLang ? "Qayta tiklash" : "Сбросить"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLang ? "Yuklab olish" : "Скачать"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            {isLang ? "Yopish" : "Закрыть"}
          </button>
        </div>
      </div>
    </div>
  )
}
