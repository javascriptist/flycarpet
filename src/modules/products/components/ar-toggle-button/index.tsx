"use client"

import React, { useState } from 'react'
import { Button } from "@medusajs/ui"
import { useParams } from "next/navigation"
import { ARCarpetViewer } from '../ar-carpet-viewer'

interface ARToggleButtonProps {
  product: any
  carpetImage: string
  carpetSize?: { width: number; length: number }
  className?: string
}

export const ARToggleButton: React.FC<ARToggleButtonProps> = ({
  product,
  carpetImage,
  carpetSize,
  className = ""
}) => {
  const [showAR, setShowAR] = useState(false)
  const countryCode = useParams().countryCode as string
  const isLang = countryCode === "uz"

  return (
    <div className={className}>
      {/* AR Toggle Button - Liquid Glass Style */}
      <Button
        onClick={() => setShowAR(!showAR)}
        variant="secondary"
        className="w-full h-12 mb-4 relative overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #e38329ff 0%, #b86111ff 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(255, 106, 26, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
          }}
        />
        
        <span className="flex items-center justify-center gap-2 relative z-10 text-white">
          <span className="text-lg">🏠</span>
          <span className="font-semibold">
            {showAR 
              ? (isLang ? "AR yopish" : "Закрыть AR")
              : (isLang ? "Xonada ko'rish" : "Просмотр в комнате")
            }
          </span>
          <span className="text-sm opacity-90 font-medium">
            {!showAR && (isLang ? "(AR)" : "(AR)")}
          </span>
        </span>
      </Button>

      {/* AR Viewer Modal - Liquid Glass Popup */}
      {showAR && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backdropFilter: 'blur(12px) saturate(150%)',
            background: 'rgba(0, 0, 0, 0.4)',
          }}
          onClick={() => setShowAR(false)}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Floating Frosted Glass Circle */}
            <button
              onClick={() => setShowAR(false)}
              className="absolute -top-4 -right-4 z-10"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
              }}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* AR Viewer Content */}
            <ARCarpetViewer
              product={product}
              carpetImage={carpetImage}
              carpetSize={carpetSize}
            />
          </div>
        </div>
      )}
    </div>
  )
}