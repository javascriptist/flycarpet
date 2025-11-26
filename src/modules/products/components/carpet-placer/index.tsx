'use client'

import { useEffect, useRef, useState } from "react"
import { 
  detectFloorCandidates, 
  drawFloorCandidates, 
  loadOpenCV, 
  getCornerAtPoint,
  updateCorner,
  drawEditableFloorCorners,
  type FloorCandidate,
  type CornerType
} from "@lib/opencv-floor-detection"
import { detectFloorAI, type AIFloorDetectionResult } from "@lib/ai-floor-detection"

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

/**
 * Draw an image with perspective transformation by decomposing into triangles
 * This creates a realistic floor placement effect
 */
function drawPerspectiveImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  corners: Point[]
) {
  // Split the quad into two triangles and render each
  // Triangle 1: top-left, top-right, bottom-left
  // Triangle 2: top-right, bottom-right, bottom-left
  
  const [topLeft, topRight, bottomRight, bottomLeft] = corners
  
  // We'll use a subdivision approach to approximate perspective
  // Divide the carpet into a grid and draw each cell
  const subdivisions = 10
  
  for (let row = 0; row < subdivisions; row++) {
    for (let col = 0; col < subdivisions; col++) {
      const u1 = col / subdivisions
      const u2 = (col + 1) / subdivisions
      const v1 = row / subdivisions
      const v2 = (row + 1) / subdivisions
      
      // Calculate destination quad corners with perspective interpolation
      const destTopLeft = interpolateQuad(corners, u1, v1)
      const destTopRight = interpolateQuad(corners, u2, v1)
      const destBottomRight = interpolateQuad(corners, u2, v2)
      const destBottomLeft = interpolateQuad(corners, u1, v2)
      
      // Calculate source rectangle
      const srcX = u1 * image.width
      const srcY = v1 * image.height
      const srcWidth = (u2 - u1) * image.width
      const srcHeight = (v2 - v1) * image.height
      
      // Draw this subdivision as a transformed quad
      ctx.save()
      
      // Create clipping path for this quad
      ctx.beginPath()
      ctx.moveTo(destTopLeft.x, destTopLeft.y)
      ctx.lineTo(destTopRight.x, destTopRight.y)
      ctx.lineTo(destBottomRight.x, destBottomRight.y)
      ctx.lineTo(destBottomLeft.x, destBottomLeft.y)
      ctx.closePath()
      ctx.clip()
      
      // Calculate approximate transform for this subdivision
      // Use the center point and average dimensions
      const centerX = (destTopLeft.x + destTopRight.x + destBottomRight.x + destBottomLeft.x) / 4
      const centerY = (destTopLeft.y + destTopRight.y + destBottomRight.y + destBottomLeft.y) / 4
      
      const width = (
        Math.hypot(destTopRight.x - destTopLeft.x, destTopRight.y - destTopLeft.y) +
        Math.hypot(destBottomRight.x - destBottomLeft.x, destBottomRight.y - destBottomLeft.y)
      ) / 2
      
      const height = (
        Math.hypot(destBottomLeft.x - destTopLeft.x, destBottomLeft.y - destTopLeft.y) +
        Math.hypot(destBottomRight.x - destTopRight.x, destBottomRight.y - destTopRight.y)
      ) / 2
      
      // Calculate rotation angle
      const dx = destTopRight.x - destTopLeft.x
      const dy = destTopRight.y - destTopLeft.y
      const angle = Math.atan2(dy, dx)
      
      // Apply transform and draw
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)
      ctx.drawImage(
        image,
        srcX, srcY, srcWidth, srcHeight,
        -width / 2, -height / 2, width, height
      )
      
      ctx.restore()
    }
  }
}

/**
 * Bilinear interpolation of a point within a quad
 */
function interpolateQuad(corners: Point[], u: number, v: number): Point {
  const [topLeft, topRight, bottomRight, bottomLeft] = corners
  
  // Bilinear interpolation
  const top = {
    x: topLeft.x + (topRight.x - topLeft.x) * u,
    y: topLeft.y + (topRight.y - topLeft.y) * u
  }
  
  const bottom = {
    x: bottomLeft.x + (bottomRight.x - bottomLeft.x) * u,
    y: bottomLeft.y + (bottomRight.y - bottomLeft.y) * u
  }
  
  return {
    x: top.x + (bottom.x - top.x) * v,
    y: top.y + (bottom.y - top.y) * v
  }
}

export const CarpetPlacer: React.FC<CarpetPlacerProps> = ({
  roomImage,
  carpetImage,
  countryCode,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [carpetPosition, setCarpetPosition] = useState({ x: 400, y: 450 })
  const [carpetScale, setCarpetScale] = useState(1.0)
  const [carpetRotation, setCarpetRotation] = useState(0)
  const [opacity, setOpacity] = useState(0.8)
  const [roomImg, setRoomImg] = useState<HTMLImageElement | null>(null)
  const [carpetImg, setCarpetImg] = useState<HTMLImageElement | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [floorCorners, setFloorCorners] = useState<any>(null)
  const [floorCandidates, setFloorCandidates] = useState<FloorCandidate[]>([])
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [isEditingFloor, setIsEditingFloor] = useState(false)
  const [draggingCorner, setDraggingCorner] = useState<CornerType | null>(null)
  const isLang = countryCode === "uz"

  // Load images and detect floor
  useEffect(() => {
    const loadImages = async () => {
      const rImg = new Image()
      rImg.src = roomImage
      await new Promise((resolve) => {
        rImg.onload = resolve
      })
      setRoomImg(rImg)

      const cImg = new Image()
      // Use Next.js Image Optimization API as proxy to avoid CORS
      const proxyUrl = `/_next/image?url=${encodeURIComponent(carpetImage)}&w=1200&q=75`
      cImg.src = proxyUrl
      cImg.crossOrigin = "anonymous"
      await new Promise((resolve) => {
        cImg.onload = resolve
      })
      setCarpetImg(cImg)

      // Auto-detect floor using AI (Hugging Face) with OpenCV fallback
      if (canvasRef.current) {
        setIsDetecting(true)
        const canvas = canvasRef.current
        
        try {
          console.log('🤖 Starting AI-powered floor detection...')
          console.log('📷 Room image:', roomImage.substring(0, 50) + '...')
          console.log('📐 Canvas size:', canvas.width, 'x', canvas.height)
          
          // Try AI detection first (Hugging Face Grounded-SAM)
          const aiResult = await detectFloorAI(
            roomImage,
            canvas.width,
            canvas.height
          )

          console.log(`🎯 Detection method: ${aiResult.method.toUpperCase()}`)
          
          // Handle loading state
          if (aiResult.loading) {
            console.log(`⏳ AI model loading... estimated ${aiResult.estimatedTime}s`)
            // Show loading message to user
            // You could add a state here to display "AI model warming up..."
          }

          // Convert AI result to candidates format for compatibility
          let candidates: FloorCandidate[] = []
          
          if (aiResult.success && aiResult.floor) {
            candidates = [{
              corners: aiResult.floor.corners,
              area: 0, // Not used for AI results
              confidence: aiResult.floor.confidence,
              color: '#4CAF50' // Green for AI detection
            }]
            
            // Add alternatives if available
            if (aiResult.alternatives) {
              candidates.push(...aiResult.alternatives.map((alt, i) => ({
                corners: alt.corners,
                area: 0,
                confidence: alt.confidence,
                color: ['#2196F3', '#FF9800'][i] || '#9E9E9E'
              })))
            }
          }

          console.log(`✅ Found ${candidates.length} floor candidates`)
          setFloorCandidates(candidates)
          
          if (candidates.length > 0) {
            // Use the first (best) candidate by default
            const bestCandidate = candidates[0]
            const detectedCorners = bestCandidate.corners
            
            // Calculate center of detected floor area
            const centerX = (detectedCorners.topLeft.x + detectedCorners.topRight.x + 
                           detectedCorners.bottomLeft.x + detectedCorners.bottomRight.x) / 4
            const centerY = (detectedCorners.topLeft.y + detectedCorners.topRight.y + 
                           detectedCorners.bottomLeft.y + detectedCorners.bottomRight.y) / 4
            
            // Calculate appropriate scale based on floor size
            const floorWidth = Math.max(
              Math.abs(detectedCorners.topRight.x - detectedCorners.topLeft.x),
              Math.abs(detectedCorners.bottomRight.x - detectedCorners.bottomLeft.x)
            )
            const initialScale = (floorWidth * 0.5) / 300 // 50% of floor width
            
            console.log('✅ FLOOR DETECTED!')
            console.log('  Confidence:', (bestCandidate.confidence * 100).toFixed(0) + '%')
            console.log('  Top Left:', detectedCorners.topLeft)
            console.log('  Top Right:', detectedCorners.topRight)
            console.log('  Bottom Right:', detectedCorners.bottomRight)
            console.log('  Bottom Left:', detectedCorners.bottomLeft)
            console.log('  Center:', { x: centerX, y: centerY })
            console.log('  Floor Width:', floorWidth)
            console.log('  Initial Scale:', initialScale)
            
            setCarpetPosition({ x: centerX, y: centerY })
            setCarpetScale(initialScale)
            setFloorCorners(detectedCorners) // Store floor corners for perspective
            setSelectedCandidateIndex(0)
            
            // Show candidates if multiple options
            if (candidates.length > 1) {
              setShowCandidates(true)
              console.log(`💡 Multiple floor options detected. Click "Select Floor" to choose.`)
            }
          } else {
            // Use fallback positioning
            console.log('⚠️ FLOOR NOT DETECTED - Using fallback positioning')
            console.log('  Fallback position:', { x: canvas.width / 2, y: canvas.height * 0.7 })
            setCarpetPosition({ x: canvas.width / 2, y: canvas.height * 0.7 })
            setCarpetScale(1.0)
            setFloorCorners(null)
          }
        } catch (error) {
          console.error('❌ Floor detection error:', error)
          console.error('  Error details:', error)
          setCarpetPosition({ x: canvas.width / 2, y: canvas.height * 0.7 })
          setCarpetScale(1.0)
          setFloorCorners(null)
        } finally {
          setIsDetecting(false)
        }
      }
    }

    loadImages()
  }, [roomImage, carpetImage])

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || !roomImg || !carpetImg) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw room image
    ctx.drawImage(roomImg, 0, 0, canvas.width, canvas.height)

    // Draw carpet with perspective transformation to match floor
    ctx.save()
    ctx.globalAlpha = opacity
    
    if (floorCorners) {
      console.log('🎨 Drawing with PERSPECTIVE TRANSFORM')
      console.log('  Floor corners:', floorCorners)
      console.log('  Carpet position:', carpetPosition)
      console.log('  Carpet scale:', carpetScale)
      console.log('  Carpet rotation:', carpetRotation)
      
      // Calculate carpet dimensions
      const carpetAspectRatio = carpetImg.width / carpetImg.height
      const baseWidth = 300
      const carpetWidth = baseWidth * carpetScale
      const carpetHeight = carpetWidth / carpetAspectRatio
      
      // Calculate the four corners of the carpet on the floor plane
      // Apply rotation and scaling to floor corners
      const centerX = carpetPosition.x
      const centerY = carpetPosition.y
      
      // Calculate floor dimensions at carpet position
      const floorCenterX = (floorCorners.topLeft.x + floorCorners.topRight.x + 
                           floorCorners.bottomLeft.x + floorCorners.bottomRight.x) / 4
      const floorCenterY = (floorCorners.topLeft.y + floorCorners.topRight.y + 
                           floorCorners.bottomLeft.y + floorCorners.bottomRight.y) / 4
      
      // Calculate offset from floor center
      const offsetX = centerX - floorCenterX
      const offsetY = centerY - floorCenterY
      
      // Calculate perspective-correct corners for the carpet
      const angle = (carpetRotation * Math.PI) / 180
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      
      // Get floor perspective (trapezoid shape)
      const topWidth = Math.hypot(
        floorCorners.topRight.x - floorCorners.topLeft.x,
        floorCorners.topRight.y - floorCorners.topLeft.y
      )
      const bottomWidth = Math.hypot(
        floorCorners.bottomRight.x - floorCorners.bottomLeft.x,
        floorCorners.bottomRight.y - floorCorners.bottomLeft.y
      )
      const perspectiveRatio = topWidth / bottomWidth
      
      // Calculate carpet corners with perspective
      const halfWidth = carpetWidth / 2
      const halfHeight = carpetHeight / 2
      
      // Interpolate perspective based on Y position
      const normalizedY = (centerY - floorCorners.topLeft.y) / 
                         (floorCorners.bottomLeft.y - floorCorners.topLeft.y)
      const perspectiveFactor = perspectiveRatio + (1 - perspectiveRatio) * normalizedY
      
      // BACK edge (top of carpet, farther away) - smaller due to perspective
      // This should have SMALLER Y value (top of image)
      const backWidth = carpetWidth * perspectiveFactor
      const backHeight = carpetHeight * perspectiveFactor
      const backLeft = {
        x: centerX + offsetX + (-backWidth / 2 * cos - backHeight / 2 * sin),
        y: centerY + offsetY + (-backWidth / 2 * sin + -backHeight / 2 * cos)
      }
      const backRight = {
        x: centerX + offsetX + (backWidth / 2 * cos - backHeight / 2 * sin),
        y: centerY + offsetY + (backWidth / 2 * sin + -backHeight / 2 * cos)
      }
      
      // FRONT edge (bottom of carpet, closer to camera) - larger, no perspective shrink
      // This should have LARGER Y value (bottom of image)
      const frontLeft = {
        x: centerX + offsetX + (-halfWidth * cos + halfHeight * sin),
        y: centerY + offsetY + (-halfWidth * sin + halfHeight * cos)
      }
      const frontRight = {
        x: centerX + offsetX + (halfWidth * cos + halfHeight * sin),
        y: centerY + offsetY + (halfWidth * sin + halfHeight * cos)
      }
      
      // Draw carpet using perspective transform via triangle decomposition
      console.log('  Carpet corners for perspective:')
      console.log('    Back Left:', backLeft)
      console.log('    Back Right:', backRight)
      console.log('    Front Right:', frontRight)
      console.log('    Front Left:', frontLeft)
      
      drawPerspectiveImage(ctx, carpetImg, [
        backLeft, backRight, frontRight, frontLeft
      ])
    } else {
      console.log('🎨 Drawing with SIMPLE 2D TRANSFORM (no floor detected)')
      // Fallback: simple transform without perspective
      ctx.translate(carpetPosition.x, carpetPosition.y)
      ctx.rotate((carpetRotation * Math.PI) / 180)
      
      const carpetAspectRatio = carpetImg.width / carpetImg.height
      const baseWidth = 300
      const carpetWidth = baseWidth * carpetScale
      const carpetHeight = carpetWidth / carpetAspectRatio
      
      ctx.drawImage(
        carpetImg,
        -carpetWidth / 2,
        -carpetHeight / 2,
        carpetWidth,
        carpetHeight
      )
    }
    
    ctx.restore()
    
    // Draw floor candidates overlay if in selection mode
    if (showCandidates && floorCandidates.length > 0) {
      drawFloorCandidates(ctx, floorCandidates, selectedCandidateIndex)
    }
    
    // Draw floor editing overlay if in edit mode
    if (isEditingFloor && floorCorners) {
      drawEditableFloorCorners(ctx, floorCorners, draggingCorner, '#D9A676')
    }
    
    // Draw position indicator (center point) only in normal mode
    if (!isDragging && !showCandidates && !isEditingFloor) {
      ctx.fillStyle = 'rgba(255, 106, 26, 0.8)'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(carpetPosition.x, carpetPosition.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
  }, [roomImg, carpetImg, carpetPosition, carpetScale, carpetRotation, opacity, isDragging, floorCorners, showCandidates, floorCandidates, selectedCandidateIndex, isEditingFloor, draggingCorner])

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // If in floor editing mode, check if clicking on a corner
    if (isEditingFloor && floorCorners) {
      const corner = getCornerAtPoint(floorCorners, { x, y }, 20)
      if (corner) {
        setDraggingCorner(corner)
        return
      }
    }

    // Otherwise, start dragging carpet
    setIsDragging(true)
    setDragStart({ x: x - carpetPosition.x, y: y - carpetPosition.y })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // If dragging a floor corner
    if (draggingCorner && floorCorners) {
      const newCorners = updateCorner(floorCorners, draggingCorner, { x, y })
      setFloorCorners(newCorners)
      canvasRef.current.style.cursor = 'grabbing'
      return
    }

    // Move carpet if dragging
    if (isDragging) {
      setCarpetPosition({
        x: x - dragStart.x,
        y: y - dragStart.y
      })
      canvasRef.current.style.cursor = 'grabbing'
      return
    }
    
    // Show appropriate cursor
    if (isEditingFloor && floorCorners) {
      const corner = getCornerAtPoint(floorCorners, { x, y }, 20)
      canvasRef.current.style.cursor = corner ? 'pointer' : 'default'
    } else {
      canvasRef.current.style.cursor = 'grab'
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setDraggingCorner(null)
    if (canvasRef.current) {
      canvasRef.current.style.cursor = isEditingFloor ? 'default' : 'grab'
    }
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
      setCarpetPosition({ x: canvas.width / 2, y: canvas.height * 0.7 })
      setCarpetScale(1.0)
      setCarpetRotation(0)
      setOpacity(0.8)
    }
  }

  const handleToggleCandidates = () => {
    setShowCandidates(!showCandidates)
  }

  const handleSelectCandidate = (index: number) => {
    if (index < 0 || index >= floorCandidates.length) return
    
    setSelectedCandidateIndex(index)
    const selectedFloor = floorCandidates[index].corners
    
    // Update floor corners and reposition carpet
    setFloorCorners(selectedFloor)
    
    // Calculate center of selected floor
    const centerX = (selectedFloor.topLeft.x + selectedFloor.topRight.x + 
                    selectedFloor.bottomLeft.x + selectedFloor.bottomRight.x) / 4
    const centerY = (selectedFloor.topLeft.y + selectedFloor.topRight.y + 
                    selectedFloor.bottomLeft.y + selectedFloor.bottomRight.y) / 4
    
    setCarpetPosition({ x: centerX, y: centerY })
    
    console.log(`✓ Selected floor candidate ${index + 1}`, selectedFloor)
  }

  const handleConfirmFloor = () => {
    setShowCandidates(false)
    console.log('✅ Floor selection confirmed')
  }

  const handleToggleEditFloor = () => {
    const newEditingState = !isEditingFloor
    setIsEditingFloor(newEditingState)
    
    // Exit candidate selection mode when entering edit mode
    if (newEditingState) {
      setShowCandidates(false)
    }
    
    console.log(newEditingState ? '✏️ Entering floor edit mode' : '✅ Exiting floor edit mode')
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        {isDetecting ? (
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-blue-900">
              <strong>{isLang ? "Tahlil qilmoqda..." : "Анализ изображения..."}</strong>{" "}
              {isLang
                ? "Polni aniqlamoqdamiz"
                : "Определяем пол"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-blue-900">
            <strong>
              {isLang ? "Yo'riqnoma:" : "Инструкция:"}
            </strong>{" "}
            {isLang
              ? "Gilamni sudrab ko'chiring, aylantirib va o'lchamini o'zgartiring."
              : "Перетащите ковер, поверните и измените размер."}
          </p>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="max-w-full max-h-full border border-gray-200 rounded-lg"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
        {/* Scale Control */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 min-w-[100px]">
            {isLang ? "O'lcham:" : "Размер:"}
          </label>
          <input
            type="range"
            min="0.3"
            max="3"
            step="0.1"
            value={carpetScale}
            onChange={(e) => setCarpetScale(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {Math.round(carpetScale * 100)}%
          </span>
        </div>

        {/* Rotation Control */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 min-w-[100px]">
            {isLang ? "Burilish:" : "Поворот:"}
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={carpetRotation}
            onChange={(e) => setCarpetRotation(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {carpetRotation}°
          </span>
        </div>

        {/* Opacity Control */}
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

        {/* Floor Selection (only show if multiple candidates) */}
        {floorCandidates.length > 1 && (
          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                {isLang ? "Pol tanlash:" : "Выбор пола:"}{" "}
                <span className="text-gray-500">
                  ({floorCandidates.length} {isLang ? "variant" : "вариантов"})
                </span>
              </label>
              <button
                onClick={handleToggleCandidates}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  showCandidates
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {showCandidates 
                  ? (isLang ? "Yashirish" : "Скрыть")
                  : (isLang ? "Ko'rsatish" : "Показать")}
              </button>
            </div>
            
            {showCandidates && (
              <div className="space-y-2">
                {floorCandidates.map((candidate, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectCandidate(index)}
                    className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                      selectedCandidateIndex === index
                        ? "bg-orange-100 border-2 border-orange-600 text-orange-900"
                        : "bg-white border border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: candidate.color }}
                        />
                        {isLang ? "Pol" : "Пол"} {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(candidate.confidence * 100).toFixed(0)}% {isLang ? "ishonch" : "уверенность"}
                      </span>
                    </div>
                  </button>
                ))}
                <button
                  onClick={handleConfirmFloor}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mt-2"
                >
                  ✓ {isLang ? "Tasdiqlash" : "Подтвердить"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual Floor Adjustment */}
        {floorCorners && (
          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                {isLang ? "Polni sozlash:" : "Настройка пола:"}
              </label>
              <button
                onClick={handleToggleEditFloor}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  isEditingFloor
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isEditingFloor 
                  ? (isLang ? "Tayyor" : "Готово")
                  : (isLang ? "Tahrirlash" : "Редактировать")}
              </button>
            </div>
            
            {isEditingFloor && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  💡 {isLang 
                    ? "Polning burchaklarini sudrab sozlang" 
                    : "Перетащите углы пола для точной настройки"}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            {isLang ? "Qayta boshlash" : "Сбросить"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-brand-peach hover:bg-brand-terracotta text-white rounded-lg transition-colors font-semibold"
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
