'use client'

import { useEffect, useRef, useState } from "react"

interface Point {
  x: number
  y: number
}

interface CarpetPlacerProps {
  roomImage: string
  carpetImage: string
  countryCode?: string
  onClose: () => void
}

export const CarpetPlacer: React.FC<CarpetPlacerProps> = ({
  roomImage,
  carpetImage,
  countryCode,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [corners, setCorners] = useState<Point[]>([])
  const [selectedCorner, setSelectedCorner] = useState<number | null>(null)
  const [opacity, setOpacity] = useState(0.8)
  const [roomImg, setRoomImg] = useState<HTMLImageElement | null>(null)
  const [carpetImg, setCarpetImg] = useState<HTMLImageElement | null>(null)
  const isLang = countryCode === "uz"

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      const rImg = new Image()
      rImg.src = roomImage
      await new Promise((resolve) => {
        rImg.onload = resolve
      })
      setRoomImg(rImg)

      const cImg = new Image()
      cImg.src = carpetImage
      cImg.crossOrigin = "anonymous"
      await new Promise((resolve) => {
        cImg.onload = resolve
      })
      setCarpetImg(cImg)

      // Set default corners (centered square)
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const size = 200

        setCorners([
          { x: centerX - size, y: centerY - size }, // Top-left
          { x: centerX + size, y: centerY - size }, // Top-right
          { x: centerX + size, y: centerY + size }, // Bottom-right
          { x: centerX - size, y: centerY + size }, // Bottom-left
        ])
      }
    }

    loadImages()
  }, [roomImage, carpetImage])

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || !roomImg || !carpetImg || corners.length !== 4) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw room image
    ctx.drawImage(roomImg, 0, 0, canvas.width, canvas.height)

    // Draw carpet with perspective
    ctx.save()
    ctx.globalAlpha = opacity

    try {
      // Apply perspective transformation using matrix
      const [tl, tr, br, bl] = corners
      
      // Simple perspective approximation
      ctx.beginPath()
      ctx.moveTo(tl.x, tl.y)
      ctx.lineTo(tr.x, tr.y)
      ctx.lineTo(br.x, br.y)
      ctx.lineTo(bl.x, bl.y)
      ctx.closePath()
      ctx.clip()

      // Calculate bounds
      const minX = Math.min(tl.x, tr.x, br.x, bl.x)
      const maxX = Math.max(tl.x, tr.x, br.x, bl.x)
      const minY = Math.min(tl.y, tr.y, br.y, bl.y)
      const maxY = Math.max(tl.y, tr.y, br.y, bl.y)
      const width = maxX - minX
      const height = maxY - minY

      ctx.drawImage(carpetImg, minX, minY, width, height)
    } catch (error) {
      console.error('Error drawing carpet:', error)
    }

    ctx.restore()

    // Draw corner points
    corners.forEach((corner, index) => {
      ctx.fillStyle = index === selectedCorner ? '#FF6A1A' : '#fff'
      ctx.strokeStyle = '#FF6A1A'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(corner.x, corner.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Draw corner number
      ctx.fillStyle = '#000'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((index + 1).toString(), corner.x, corner.y)
    })

    // Draw lines between corners
    if (corners.length === 4) {
      ctx.strokeStyle = '#FF6A1A'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      corners.forEach((corner, index) => {
        if (index === 0) {
          ctx.moveTo(corner.x, corner.y)
        } else {
          ctx.lineTo(corner.x, corner.y)
        }
      })
      ctx.closePath()
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [roomImg, carpetImg, corners, opacity, selectedCorner])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking near a corner
    const clickedCorner = corners.findIndex(
      (corner) => Math.hypot(corner.x - x, corner.y - y) < 20
    )

    if (clickedCorner !== -1) {
      setSelectedCorner(clickedCorner)
    } else {
      setSelectedCorner(null)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || selectedCorner === null) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newCorners = [...corners]
    newCorners[selectedCorner] = { x, y }
    setCorners(newCorners)
  }

  const handleCanvasMouseUp = () => {
    setSelectedCorner(null)
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement('a')
    link.download = `carpet-in-room-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  const handleReset = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const size = 200

      setCorners([
        { x: centerX - size, y: centerY - size },
        { x: centerX + size, y: centerY - size },
        { x: centerX + size, y: centerY + size },
        { x: centerX - size, y: centerY + size },
      ])
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>
            {isLang ? "Yo'riqnoma:" : "Инструкция:"}
          </strong>{" "}
          {isLang
            ? "4 ta nuqtani sudrab gilamni joylashtirishni sozlang. Nuqtalarni gilam burchaklariga mos keltiring."
            : "Перетащите 4 точки, чтобы разместить ковер. Совместите точки с углами ковра."}
        </p>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="max-w-full max-h-full cursor-move border border-gray-200 rounded-lg"
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 min-w-[100px]">
            {isLang ? "Shaffoflik:" : "Прозрачность:"}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            {isLang ? "Qayta boshlash" : "Сбросить"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-[#FF6A1A] hover:bg-[#e55d17] text-white rounded-lg transition-colors font-semibold"
          >
            {isLang ? "Yuklab olish" : "Скачать"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
          >
            {isLang ? "Tayyor" : "Готово"}
          </button>
        </div>
      </div>
    </div>
  )
}
