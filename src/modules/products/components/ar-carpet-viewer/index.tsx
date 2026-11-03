"use client"

import React, { useEffect, useRef, useState } from 'react'
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

  const status = (message: string, tone: "loading" | "error" = "loading") => (
    <div className={`ar-carpet-viewer ${className}`}>
      <div className="grid h-80 place-items-center rounded-card bg-surface-sunken" role="status">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          {tone === "loading" ? (
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-accent-strong" aria-hidden />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-ink-subtle" aria-hidden>
              <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <p className="text-callout text-ink">{message}</p>
          {tone === "error" && (
            <p className="text-footnote text-ink-muted">
              {t({ uz: "AR funksiyasi hozircha mavjud emas", ru: "AR функция временно недоступна", en: "AR isn't available right now" }, countryCode)}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return status(t({ uz: "AR tayyorlanmoqda...", ru: "Подготовка AR...", en: "Preparing AR..." }, countryCode))
  }

  if (error) {
    return status(error, "error")
  }

  if (!modelUrl) {
    return status(t({ uz: "3D model tayyorlanmoqda...", ru: "Подготовка 3D модели...", en: "Preparing 3D model..." }, countryCode))
  }

  return (
    <div className={`ar-carpet-viewer flex flex-col gap-4 ${className}`}>
      <div className="relative overflow-hidden rounded-card bg-surface-sunken">
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
            width: "100%",
            height: "min(60dvh, 460px)",
            backgroundColor: "transparent",
          }}
          onLoad={handleModelLoad}
          onError={handleModelError}
        >
          {isARSupported && (
            <button
              slot="ar-button"
              className="btn-primary absolute bottom-4 left-1/2 -translate-x-1/2 shadow-float"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" />
              </svg>
              {t({ uz: "Xonamda ko\u02bcrish", ru: "Открыть в комнате", en: "Place in my room" }, countryCode)}
            </button>
          )}
        </model-viewer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-footnote text-ink-muted">
        <span>
          {t({ uz: "O'lcham:", ru: "Размер:", en: "Size:" }, countryCode)}{" "}
          <span className="num font-medium text-ink">
            {carpetSize.width} m × {carpetSize.length} m
          </span>
        </span>
        <span>
          {isARSupported
            ? t({ uz: "Tugmani bosing va gilamni polga qo\u02bcying", ru: "Нажмите кнопку и поставьте ковер на пол", en: "Tap the button, then point at your floor" }, countryCode)
            : t({ uz: "Aylantirish uchun suring, kattalashtirish uchun chimchilang", ru: "Проведите, чтобы повернуть, сведите пальцы для масштаба", en: "Drag to rotate, pinch or scroll to zoom" }, countryCode)}
        </span>
      </div>

      <style jsx>{`
        model-viewer::part(default-progress-bar) {
          display: none;
        }
      `}</style>
    </div>
  )
}
