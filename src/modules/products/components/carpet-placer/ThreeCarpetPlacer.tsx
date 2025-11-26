import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

type FloorCorners = [number, number, number, number] // [x1,y1,x2,y2] simplified

interface Props {
  carpetImageUrl: string
  floorMaskUrl?: string
  floorPolygon?: [number, number][]
  enableTransform?: boolean
  onTransformChange?: (position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void
}

interface CarpetSettings {
  opacity: number
  scale: number
  rotationX: number
}

function CarpetPlane({ 
  carpetImageUrl, 
  maskTexture, 
  initialSize, 
  enableTransform,
  onTransformChange,
  settings
}: any) {
  const ref = useRef<THREE.Mesh>(null)
  const transformRef = useRef<any>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = ''
    loader.load(carpetImageUrl, (tex) => {
      tex.flipY = false
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    })
  }, [carpetImageUrl])

  useEffect(() => {
    if (!maskTexture || !texture) return
    texture.alphaMap = maskTexture
    texture.transparent = true
    texture.needsUpdate = true
  }, [maskTexture, texture])

  useEffect(() => {
    if (!ref.current) return
    ref.current.scale.set(settings.scale, settings.scale, settings.scale)
    ref.current.rotation.x = -Math.PI / 2 + settings.rotationX
    if (ref.current.material instanceof THREE.Material) {
      ref.current.material.opacity = settings.opacity
      ref.current.material.needsUpdate = true
    }
  }, [settings])

  useEffect(() => {
    const handleChange = () => {
      if (ref.current && onTransformChange) {
        const pos = ref.current.position
        const rot = ref.current.rotation
        const scale = ref.current.scale
        onTransformChange([pos.x, pos.y, pos.z], [rot.x, rot.y, rot.z], [scale.x, scale.y, scale.z])
      }
    }

    const control = transformRef.current
    if (control) {
      control.addEventListener('change', handleChange)
      return () => control.removeEventListener('change', handleChange)
    }
  }, [onTransformChange])

  return (
    <>
      <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[initialSize[0], initialSize[1]]} />
        <meshStandardMaterial 
          map={texture || undefined} 
          transparent={true} 
          side={THREE.DoubleSide}
          opacity={settings.opacity}
        />
      </mesh>
      {enableTransform && ref.current && (
        <TransformControls 
          ref={transformRef}
          object={ref.current} 
          mode="translate"
        />
      )}
    </>
  )
}

function Scene({ carpetImageUrl, floorMaskUrl, enableTransform, onTransformChange, settings }: any) {
  const { scene, gl } = useThree()
  const [maskTexture, setMaskTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!floorMaskUrl) return
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = ''
    loader.load(floorMaskUrl, (tex) => {
      tex.flipY = false
      tex.format = THREE.RGBAFormat
      tex.needsUpdate = true
      setMaskTexture(tex)
    })
  }, [floorMaskUrl])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <CarpetPlane 
        carpetImageUrl={carpetImageUrl} 
        maskTexture={maskTexture} 
        initialSize={[3, 2]}
        enableTransform={enableTransform}
        onTransformChange={onTransformChange}
        settings={settings}
      />
      <ContactShadows rotation={[ -Math.PI / 2, 0, 0 ]} position={[0, -0.01, 0]} width={10} height={10} far={1} blur={2} />
    </>
  )
}

export default function ThreeCarpetPlacer(props: Props) {
  const { carpetImageUrl, floorMaskUrl, enableTransform = false, onTransformChange } = props
  const [settings, setSettings] = useState<CarpetSettings>({ opacity: 1, scale: 1, rotationX: 0 })

  // Load persisted settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('carpetPlacerSettings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.warn('Failed to parse saved settings:', e)
      }
    }
  }, [])

  // Persist settings on change
  useEffect(() => {
    localStorage.setItem('carpetPlacerSettings', JSON.stringify(settings))
  }, [settings])

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 3, 5], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={45} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Scene 
          carpetImageUrl={carpetImageUrl} 
          floorMaskUrl={floorMaskUrl}
          enableTransform={enableTransform}
          onTransformChange={onTransformChange}
          settings={settings}
        />
      </Canvas>

      {/* UI Controls */}
      <div style={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        background: 'rgba(255,255,255,0.9)', 
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: 200
      }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>Opacity</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={settings.opacity}
            onChange={(e) => setSettings(s => ({ ...s, opacity: parseFloat(e.target.value) }))}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: 11, color: '#666' }}>{Math.round(settings.opacity * 100)}%</span>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>Scale</label>
          <input 
            type="range" 
            min="0.5" 
            max="3" 
            step="0.1" 
            value={settings.scale}
            onChange={(e) => setSettings(s => ({ ...s, scale: parseFloat(e.target.value) }))}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: 11, color: '#666' }}>{settings.scale.toFixed(1)}x</span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>Rotation X</label>
          <input 
            type="range" 
            min="-0.5" 
            max="0.5" 
            step="0.05" 
            value={settings.rotationX}
            onChange={(e) => setSettings(s => ({ ...s, rotationX: parseFloat(e.target.value) }))}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: 11, color: '#666' }}>{Math.round(settings.rotationX * (180 / Math.PI))}°</span>
        </div>

        <button
          onClick={() => setSettings({ opacity: 1, scale: 1, rotationX: 0 })}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '6px 12px',
            fontSize: 12,
            border: '1px solid #ddd',
            borderRadius: 4,
            background: '#f5f5f5',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
