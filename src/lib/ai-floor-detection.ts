/**
 * AI-Powered Floor Detection
 * 
 * This module provides floor detection using:
 * 1. Hugging Face Grounded-SAM (AI-powered, most accurate)
 * 2. OpenCV edge detection (fallback, works offline)
 * 3. Manual selection (last resort)
 */

import { FloorCorners, FloorCandidate } from './opencv-floor-detection'

export interface AIFloorDetectionResult {
  success: boolean
  method: 'ai' | 'opencv' | 'manual'
  floor?: {
    corners: FloorCorners
    mask?: string // Base64 encoded mask image
    confidence: number
    boundingBox?: number[]
  }
  alternatives?: Array<{
    corners: FloorCorners
    confidence: number
  }>
  error?: string
  loading?: boolean
  estimatedTime?: number
}

/**
 * Detect floor using AI (Hugging Face Grounded-SAM)
 * Falls back to OpenCV if API fails
 */
export async function detectFloorAI(
  imageSource: string, // URL or base64
  canvasWidth: number,
  canvasHeight: number
): Promise<AIFloorDetectionResult> {
  try {
    console.log('🤖 Attempting AI floor detection...')
    
    // Call our backend API
    const response = await fetch('/api/detect-floor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageSource,
        prompt: 'floor'
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      
      // Check if model is loading
      if (error.loading) {
        console.log('⏳ AI model is loading...')
        return {
          success: false,
          method: 'ai',
          loading: true,
          estimatedTime: error.estimatedTime || 20,
          error: error.error || 'Model is loading'
        }
      }

      // If API suggests fallback, use OpenCV
      if (error.fallback) {
        console.log('⚠️ AI detection unavailable, using OpenCV fallback')
        return detectFloorOpenCV(imageSource, canvasWidth, canvasHeight)
      }

      throw new Error(error.error || 'API request failed')
    }

    const result = await response.json()

    if (!result.success || !result.floor) {
      console.log('⚠️ No floor detected by AI, using OpenCV fallback')
      return detectFloorOpenCV(imageSource, canvasWidth, canvasHeight)
    }

    console.log('✅ AI floor detection successful!')
    console.log('  Confidence:', (result.floor.confidence * 100).toFixed(1) + '%')

    // Convert polygon to FloorCorners format
    const corners: FloorCorners = {
      topLeft: result.floor.polygon.topLeft,
      topRight: result.floor.polygon.topRight,
      bottomRight: result.floor.polygon.bottomRight,
      bottomLeft: result.floor.polygon.bottomLeft
    }

    // Process alternatives if available
    const alternatives = result.alternatives?.map((alt: any) => ({
      corners: {
        topLeft: alt.polygon.topLeft,
        topRight: alt.polygon.topRight,
        bottomRight: alt.polygon.bottomRight,
        bottomLeft: alt.polygon.bottomLeft
      },
      confidence: alt.confidence
    })) || []

    return {
      success: true,
      method: 'ai',
      floor: {
        corners,
        mask: result.floor.mask,
        confidence: result.floor.confidence,
        boundingBox: result.floor.boundingBox
      },
      alternatives
    }

  } catch (error) {
    console.error('❌ AI floor detection error:', error)
    console.log('🔄 Falling back to OpenCV detection')
    return detectFloorOpenCV(imageSource, canvasWidth, canvasHeight)
  }
}

/**
 * OpenCV fallback detection
 */
async function detectFloorOpenCV(
  imageSource: string,
  canvasWidth: number,
  canvasHeight: number
): Promise<AIFloorDetectionResult> {
  try {
    // Import OpenCV detection function
    const { detectFloorCandidates } = await import('./opencv-floor-detection')
    
    console.log('🔍 Using OpenCV edge detection...')
    const candidates = await detectFloorCandidates(imageSource, canvasWidth, canvasHeight)

    if (candidates.length > 0) {
      console.log('✅ OpenCV detected', candidates.length, 'floor candidates')
      
      return {
        success: true,
        method: 'opencv',
        floor: {
          corners: candidates[0].corners,
          confidence: candidates[0].confidence
        },
        alternatives: candidates.slice(1, 3).map(c => ({
          corners: c.corners,
          confidence: c.confidence
        }))
      }
    }

    console.log('⚠️ OpenCV found no floor candidates')
    return {
      success: false,
      method: 'opencv',
      error: 'Could not detect floor area automatically'
    }

  } catch (error) {
    console.error('❌ OpenCV detection error:', error)
    return {
      success: false,
      method: 'opencv',
      error: 'Floor detection failed'
    }
  }
}

/**
 * Manual floor selection
 * User clicks 4 corners to define floor area
 */
export function startManualFloorSelection(
  canvas: HTMLCanvasElement,
  onComplete: (corners: FloorCorners) => void
): () => void {
  const points: Array<{ x: number; y: number }> = []
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  console.log('✋ Manual floor selection mode activated')
  console.log('  Click 4 corners: Top-Left → Top-Right → Bottom-Right → Bottom-Left')

  const drawPoints = () => {
    // Draw existing points
    points.forEach((p, i) => {
      ctx.fillStyle = '#D9A676'
      ctx.strokeStyle = '#FFF'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Label
      ctx.fillStyle = '#FFF'
      ctx.font = 'bold 12px sans-serif'
      ctx.fillText(`${i + 1}`, p.x - 4, p.y + 4)
    })

    // Draw lines between points
    if (points.length > 1) {
      ctx.strokeStyle = '#D9A676'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      if (points.length === 4) {
        ctx.closePath()
      }
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  const handleClick = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    points.push({ x, y })
    drawPoints()

    if (points.length === 4) {
      console.log('✅ Manual floor selection complete')
      
      const corners: FloorCorners = {
        topLeft: points[0],
        topRight: points[1],
        bottomRight: points[2],
        bottomLeft: points[3]
      }

      onComplete(corners)
      cleanup()
    } else {
      console.log(`  Point ${points.length}/4 recorded`)
    }
  }

  const cleanup = () => {
    canvas.removeEventListener('click', handleClick)
    canvas.style.cursor = 'default'
  }

  canvas.addEventListener('click', handleClick)
  canvas.style.cursor = 'crosshair'

  return cleanup
}
