"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@medusajs/ui"
import { useParams } from "next/navigation"
import { t } from "@lib/util/translations"

// Import model-viewer types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        ar?: boolean
        'ar-modes'?: string
        'ar-placement'?: string
        'camera-controls'?: boolean
        'auto-rotate'?: boolean
        poster?: string
        'shadow-intensity'?: string
        loading?: string
        'reveal'?: string
        style?: React.CSSProperties
        onLoad?: () => void
        onError?: (event: any) => void
      }
    }
  }
}

interface ARCarpetViewerProps {
  product: any
  carpetImage: string
  carpetSize?: { width: number; length: number }
  className?: string
}

export const ARCarpetViewer: React.FC<ARCarpetViewerProps> = ({
  product,
  carpetImage,
  carpetSize = { width: 4, length: 3 },
  className = ""
}) => {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modelUrl, setModelUrl] = useState<string>('')
  const modelViewerRef = useRef<HTMLElement>(null)
  
  const countryCode = useParams().countryCode as string

  // Check AR support and generate carpet model
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Check for WebXR support
        if ('xr' in navigator) {
          const isSupported = await (navigator as any).xr?.isSessionSupported?.('immersive-ar')
          setIsARSupported(isSupported)
        } else {
          // Fallback check for mobile AR (iOS Quick Look, Android Scene Viewer)
          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          setIsARSupported(isMobile)
        }
      } catch (err) {
        // Assume mobile devices support AR
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        setIsARSupported(isMobile)
      }
    }

    const generateCarpetModel = async () => {
      try {
        // Generate carpet 3D model from API
        const params = new URLSearchParams({
          width: carpetSize.width.toString(),
          length: carpetSize.length.toString(),
          image: carpetImage
        })

        const response = await fetch(`/api/generate-carpet-model?${params}`)
        if (!response.ok) {
          throw new Error('Failed to generate carpet model')
        }

        const data = await response.json()
        setModelUrl(data.model_url)
      } catch (err) {
        console.error('Carpet model generation error:', err)
        setError(t({ uz: "Gilam modeli yaratilmadi", ru: "Не удалось создать модель ковра", en: "Couldn't create the carpet model" }, countryCode))
      } finally {
        setIsLoading(false)
      }
    }

    // Load model-viewer script
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js'
      script.onload = () => {
        checkARSupport()
        generateCarpetModel()
      }
      script.onerror = () => {
        setError(t({ uz: "AR kutubxonasi yuklanmadi", ru: "AR библиотека не загрузилась", en: "The AR library didn't load" }, countryCode))
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } else {
      checkARSupport()
      generateCarpetModel()
    }
  }, [countryCode, carpetImage, carpetSize.width, carpetSize.length])

  const handleModelLoad = () => {
  }

  const handleModelError = (event: any) => {
    console.error('❌ Model loading error:', event)
    console.error('Model URL:', modelUrl)
    setError(t({ uz: "3D model yuklanmadi", ru: "3D модель не загрузилась", en: "The 3D model didn't load" }, countryCode))
  }

  if (isLoading) {
    return (
      <div className={`ar-carpet-viewer ${className}`}>
        <div className="flex items-center justify-center h-80 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-[#D9A676] mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">
              {t({ uz: "AR tayyorlanmoqda...", ru: "Подготовка AR...", en: "Preparing AR..." }, countryCode)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`ar-carpet-viewer ${className}`}>
        <div className="flex items-center justify-center h-80 bg-red-50 border border-red-200 rounded-2xl">
          <div className="text-center px-6">
            <p className="text-red-600 mb-2 text-2xl">⚠️</p>
            <p className="text-red-600 font-medium mb-1">{error}</p>
            <p className="text-sm text-gray-500">
              {t({ uz: "AR funksiyasi hozircha mavjud emas", ru: "AR функция временно недоступна", en: "AR isn't available right now" }, countryCode)
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Don't render if model URL is not ready yet
  if (!modelUrl) {
    return (
      <div className={`ar-carpet-viewer ${className}`}>
        <div className="flex items-center justify-center h-80 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-[#D9A676] mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">
              {t({ uz: "3D model tayyorlanmoqda...", ru: "Подготовка 3D модели...", en: "Preparing 3D model..." }, countryCode)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`ar-carpet-viewer ${className}`}>
      <div 
        className="bg-white rounded-3xl shadow-sm border overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25), 0 0 1px rgba(255, 255, 255, 0.5) inset',
        }}
      >
        {/* Header - Liquid Glass */}
        <div 
          className="px-6 py-4"
          style={{
            background: 'linear-gradient(135deg, #f68821ff 0%, #ae5a0bff 100%)',
            backdropFilter: 'blur(40px) saturate(180%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2 text-lg">
              <span className="text-xl">🏠</span>
              {t({ uz: "Xonada ko'rish", ru: "Просмотр в комнате", en: "View in your room" }, countryCode)}
            </h3>
            {isARSupported && (
              <span 
                className="text-white text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                AR {t({ uz: "qo'llab-quvvatlanadi", ru: "поддерживается", en: "supported" }, countryCode)}
              </span>
            )}
          </div>
        </div>

        {/* Model Viewer */}
        <div className="relative bg-gradient-to-b from-gray-50 to-white">
          <model-viewer
            ref={modelViewerRef}
            src={modelUrl}
            alt={`${product.title} AR model`}
            ar={isARSupported}
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
            camera-controls={true}
            auto-rotate={true}
            poster={carpetImage}
            shadow-intensity="1"
            loading="eager"
            reveal="auto"
            style={{
              width: '100%',
              height: '450px',
              backgroundColor: 'transparent'
            }}
            onLoad={handleModelLoad}
            onError={handleModelError}
          >
            {/* AR Button */}
            {isARSupported && (
              <button
                slot="ar-button"
                className="absolute top-4 right-4 bg-[#D9A676] hover:bg-[#e55d17] text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <span>📱</span>
                <span>{t({ uz: "AR ko'rish", ru: "Просмотр в AR", en: "View in AR" }, countryCode)}</span>
              </button>
            )}
          </model-viewer>

          {/* Instructions */}
          <div 
            className="absolute bottom-6 left-6 right-6 text-gray-700 text-sm px-4 py-3 rounded-xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            {isARSupported ? (
              <p className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">📱</span>
                <span>
                  {t({ uz: "AR tugmasini bosing va gilamni xonangizda joylashtiring", ru: "Нажмите AR и разместите ковер в вашей комнате", en: "Tap AR and place the carpet in your room" }, countryCode)
                  }
                </span>
              </p>
            ) : (
              <p className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">🖱️</span>
                <span>
                  {t({ uz: "Sichqoncha bilan gilamni aylantirib ko'ring", ru: "Поворачивайте ковер мышкой для просмотра", en: "Drag to rotate the carpet" }, countryCode)
                  }
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Info Panel - Liquid Glass Footer */}
        <div 
          className="px-6 py-4"
          style={{
            background: 'rgba(249, 250, 251, 0.8)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {t({ uz: "O'lcham:", ru: "Размер:", en: "Size:" }, countryCode)} 
              </span>
              <span className="text-sm text-[#D9A676] font-semibold">
                {carpetSize.width}m × {carpetSize.length}m
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1 transition-colors hover:text-[#D9A676]">
                <span>🔄</span>
                <span className="hidden sm:inline">{t({ uz: "Aylantirish", ru: "Поворот", en: "Rotate" }, countryCode)}</span>
              </span>
              <span className="flex items-center gap-1 transition-colors hover:text-[#D9A676]">
                <span>🔍</span>
                <span className="hidden sm:inline">{t({ uz: "Kattalashtirish", ru: "Масштаб", en: "Zoom" }, countryCode)}</span>
              </span>
              {isARSupported && (
                <span className="flex items-center gap-1 transition-colors hover:text-[#D9A676]">
                  <span>📱</span>
                  <span className="hidden sm:inline">{t({ uz: "AR rejim", ru: "AR режим", en: "AR mode" }, countryCode)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for model-viewer (removed progress bar line) */}
      <style jsx>{`
        model-viewer::part(default-progress-bar) {
          display: none;
        }
      `}</style>
    </div>
  )
}
