/**
 * OpenCV.js-based Floor Detection
 * 
 * Uses Canny edge detection and contour analysis to find floor regions
 * Allows user to select or adjust detected floor polygons
 */

interface Point {
  x: number
  y: number
}

export interface FloorCorners {
  topLeft: Point
  topRight: Point
  bottomRight: Point
  bottomLeft: Point
}

export interface FloorCandidate {
  corners: FloorCorners
  area: number
  confidence: number
  color: string // For visualization
}

export type CornerType = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'

export interface DraggableCorner {
  type: CornerType
  position: Point
  radius: number
}

// Declare cv namespace for TypeScript
declare global {
  interface Window {
    cv: any
  }
}

let cvLoaded = false
let cvLoadingPromise: Promise<void> | null = null

/**
 * Load OpenCV.js from CDN
 */
export async function loadOpenCV(): Promise<void> {
  if (cvLoaded) return Promise.resolve()
  if (cvLoadingPromise) return cvLoadingPromise

  cvLoadingPromise = new Promise((resolve, reject) => {
    console.log('📦 Loading OpenCV.js from CDN...')
    
    const script = document.createElement('script')
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js'
    script.async = true
    
    script.onload = () => {
      // OpenCV.js needs a moment to initialize
      if (window.cv && window.cv.Mat) {
        console.log('✅ OpenCV.js loaded successfully!')
        cvLoaded = true
        resolve()
      } else {
        // Wait for cv to be ready
        const checkInterval = setInterval(() => {
          if (window.cv && window.cv.Mat) {
            console.log('✅ OpenCV.js ready!')
            cvLoaded = true
            clearInterval(checkInterval)
            resolve()
          }
        }, 100)
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval)
          reject(new Error('OpenCV.js failed to initialize'))
        }, 10000)
      }
    }
    
    script.onerror = () => {
      reject(new Error('Failed to load OpenCV.js'))
    }
    
    document.head.appendChild(script)
  })

  return cvLoadingPromise
}

/**
 * Convert image URL to cv.Mat
 */
async function loadImageToMat(imageUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        
        const mat = window.cv.imread(canvas)
        resolve(mat)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

/**
 * Check if a contour is likely a floor region
 * Enhanced with aspect ratio and position checks
 */
function isFloorCandidate(
  contour: any,
  imageWidth: number,
  imageHeight: number
): boolean {
  const area = window.cv.contourArea(contour)
  const imageArea = imageWidth * imageHeight
  
  // Floor should be at least 5% of image (reduced from 10%)
  if (area < imageArea * 0.05) {
    console.log('  ✗ Rejected: area too small', Math.round(area), '<', Math.round(imageArea * 0.05))
    return false
  }
  
  // Get bounding rectangle
  const rect = window.cv.boundingRect(contour)
  
  // Floor should be in bottom 70% of image (more flexible - was 60%)
  const centerY = rect.y + rect.height / 2
  if (centerY < imageHeight * 0.3) {
    console.log('  ✗ Rejected: too high in image', centerY, '<', imageHeight * 0.3)
    return false
  }
  
  // Floor should be reasonably wide (at least 20% of image width - reduced from 30%)
  if (rect.width < imageWidth * 0.2) {
    console.log('  ✗ Rejected: too narrow', rect.width, '<', imageWidth * 0.2)
    return false
  }
  
  // Floor should have reasonable aspect ratio (more permissive range)
  const aspectRatio = rect.width / rect.height
  if (aspectRatio < 0.3 || aspectRatio > 20) {
    console.log('  ✗ Rejected: bad aspect ratio', aspectRatio)
    return false
  }
  
  // Floor bottom should be in lower portion (more flexible - was 60%)
  const bottomY = rect.y + rect.height
  if (bottomY < imageHeight * 0.5) {
    console.log('  ✗ Rejected: doesn\'t extend to lower portion', bottomY, '<', imageHeight * 0.5)
    return false
  }
  
  console.log('  ✓ CANDIDATE ACCEPTED:', {
    area: Math.round(area),
    areaPercent: ((area / imageArea) * 100).toFixed(1) + '%',
    centerY,
    width: rect.width,
    height: rect.height,
    aspectRatio: aspectRatio.toFixed(2),
    bottomY
  })
  
  return true
}

/**
 * Approximate contour to a quadrilateral (4 corners)
 */
function approximateToQuad(contour: any): Point[] | null {
  const peri = window.cv.arcLength(contour, true)
  const approx = new window.cv.Mat()
  
  // Try different epsilon values to get exactly 4 points
  // Start more aggressive for complex shapes
  for (let epsilon = 0.005; epsilon <= 0.15; epsilon += 0.005) {
    window.cv.approxPolyDP(contour, approx, epsilon * peri, true)
    
    if (approx.rows === 4) {
      const points: Point[] = []
      for (let i = 0; i < 4; i++) {
        points.push({
          x: approx.data32S[i * 2],
          y: approx.data32S[i * 2 + 1]
        })
      }
      approx.delete()
      console.log('  ✓ Approximated to quad with epsilon:', epsilon.toFixed(3))
      return points
    }
  }
  
  // If we can't get exactly 4 points, use bounding rect as fallback
  if (approx.rows > 4) {
    console.log('  ⚠️ Could not simplify to 4 points (got', approx.rows, '), using bounding rect')
    const rect = window.cv.boundingRect(contour)
    const points: Point[] = [
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.width, y: rect.y },
      { x: rect.x + rect.width, y: rect.y + rect.height },
      { x: rect.x, y: rect.y + rect.height }
    ]
    approx.delete()
    return points
  }
  
  approx.delete()
  console.log('  ✗ Failed to approximate to polygon')
  return null
}

/**
 * Convert 4 points to FloorCorners (sorted)
 */
function pointsToFloorCorners(points: Point[]): FloorCorners {
  if (points.length !== 4) {
    throw new Error('Expected exactly 4 points')
  }
  
  // Sort by Y coordinate
  const sorted = [...points].sort((a, b) => a.y - b.y)
  
  // Top 2 points
  const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x)
  // Bottom 2 points
  const bottom = sorted.slice(2, 4).sort((a, b) => a.x - b.x)
  
  return {
    topLeft: top[0],
    topRight: top[1],
    bottomLeft: bottom[0],
    bottomRight: bottom[1]
  }
}

/**
 * Detect floor candidates using OpenCV edge detection
 */
export async function detectFloorCandidates(
  imageUrl: string,
  canvasWidth: number,
  canvasHeight: number
): Promise<FloorCandidate[]> {
  console.log('🔍 Starting OpenCV floor detection...')
  
  try {
    // Ensure OpenCV is loaded
    await loadOpenCV()
    
    const cv = window.cv
    
    // Load image
    console.log('📸 Loading image...')
    const src = await loadImageToMat(imageUrl)
    console.log(`✓ Image loaded: ${src.cols}x${src.rows}`)
    
    // Resize to canvas dimensions for consistency
    const resized = new cv.Mat()
    cv.resize(src, resized, new cv.Size(canvasWidth, canvasHeight))
    src.delete()
    
    // Convert to grayscale
    const gray = new cv.Mat()
    cv.cvtColor(resized, gray, cv.COLOR_RGBA2GRAY)
    
    // Apply bilateral filter to preserve edges while reducing noise
    const filtered = new cv.Mat()
    cv.bilateralFilter(gray, filtered, 9, 75, 75)
    
    // Apply adaptive thresholding to detect edges better in varying lighting
    const thresh = new cv.Mat()
    cv.adaptiveThreshold(
      filtered,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      11,
      2
    )
    
    // Also run Canny edge detection
    const blurred = new cv.Mat()
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0)
    
    // Canny edge detection with tuned parameters
    console.log('🔬 Running Canny edge detection...')
    const edges = new cv.Mat()
    cv.Canny(blurred, edges, 30, 100) // Lower threshold for more edges
    
    // Combine threshold and edges
    const combined = new cv.Mat()
    cv.bitwise_or(thresh, edges, combined)
    
    // Apply morphological closing to connect broken edges
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5))
    const closed = new cv.Mat()
    cv.morphologyEx(combined, closed, cv.MORPH_CLOSE, kernel)
    
    // Dilate to strengthen edges
    const dilated = new cv.Mat()
    cv.dilate(closed, dilated, kernel, new cv.Point(-1, -1), 2)
    
    // Find contours
    console.log('🔍 Finding contours...')
    const contours = new cv.MatVector()
    const hierarchy = new cv.Mat()
    cv.findContours(
      dilated,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    )
    
    console.log(`✓ Found ${contours.size()} contours`)
    
    // Filter and convert to floor candidates
    const candidates: FloorCandidate[] = []
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
    
    console.log('🔍 Evaluating contours for floor candidates...')
    
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i)
      
      console.log(`\n📐 Contour ${i + 1}/${contours.size()}:`)
      
      if (isFloorCandidate(contour, canvasWidth, canvasHeight)) {
        const points = approximateToQuad(contour)
        
        if (points) {
          const area = cv.contourArea(contour)
          const imageArea = canvasWidth * canvasHeight
          const confidence = Math.min(area / (imageArea * 0.5), 1.0)
          
          candidates.push({
            corners: pointsToFloorCorners(points),
            area,
            confidence,
            color: colors[candidates.length % colors.length]
          })
          
          console.log(`  ✅ CANDIDATE ${candidates.length}:`, {
            area: Math.round(area),
            confidence: (confidence * 100).toFixed(0) + '%',
            points: points.map(p => `(${Math.round(p.x)},${Math.round(p.y)})`).join(' ')
          })
        }
      }
    }
    
    console.log(`\n📊 Total candidates found: ${candidates.length}`)
    
    // If no candidates found, try a more lenient approach
    if (candidates.length === 0) {
      console.log('⚠️ No quadrilateral candidates found. Trying lenient mode...')
      
      // Find the largest contour in the bottom half of image
      let largestArea = 0
      let largestContour = null
      
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i)
        const area = cv.contourArea(contour)
        const rect = cv.boundingRect(contour)
        
        // Must be in bottom half and reasonably large
        if (rect.y + rect.height > canvasHeight * 0.5 && area > canvasWidth * canvasHeight * 0.03) {
          if (area > largestArea) {
            largestArea = area
            largestContour = contour
          }
        }
      }
      
      if (largestContour) {
        console.log('  ✓ Found large contour in bottom half:', Math.round(largestArea))
        
        // Use bounding rectangle as floor
        const rect = cv.boundingRect(largestContour)
        const points: Point[] = [
          { x: rect.x, y: rect.y },
          { x: rect.x + rect.width, y: rect.y },
          { x: rect.x + rect.width, y: rect.y + rect.height },
          { x: rect.x, y: rect.y + rect.height }
        ]
        
        candidates.push({
          corners: pointsToFloorCorners(points),
          area: largestArea,
          confidence: Math.min(largestArea / (canvasWidth * canvasHeight * 0.5), 1.0),
          color: colors[0]
        })
        
        console.log('  ✓ Added lenient candidate with bounding rect')
      }
    }
    
    // Cleanup
    gray.delete()
    filtered.delete()
    thresh.delete()
    blurred.delete()
    edges.delete()
    combined.delete()
    kernel.delete()
    closed.delete()
    dilated.delete()
    contours.delete()
    hierarchy.delete()
    resized.delete()
    
    // Sort by confidence (area)
    candidates.sort((a, b) => b.confidence - a.confidence)
    
    console.log(`✅ Found ${candidates.length} floor candidates`)
    
    return candidates
    
  } catch (error) {
    console.error('❌ OpenCV floor detection failed:', error)
    
    // Return fallback candidate
    console.log('⚠️ Using fallback floor detection')
    return [{
      corners: getFallbackFloorCorners(canvasWidth, canvasHeight),
      area: canvasWidth * canvasHeight * 0.4,
      confidence: 0.3,
      color: '#FF6B6B'
    }]
  }
}

/**
 * Fallback floor corners (if OpenCV detection fails)
 */
function getFallbackFloorCorners(width: number, height: number): FloorCorners {
  const floorTop = height * 0.5
  const perspectiveFactor = 0.15
  
  return {
    topLeft: { 
      x: width * perspectiveFactor, 
      y: floorTop 
    },
    topRight: { 
      x: width * (1 - perspectiveFactor), 
      y: floorTop 
    },
    bottomRight: { 
      x: width - 1, 
      y: height - 1 
    },
    bottomLeft: { 
      x: 0, 
      y: height - 1 
    }
  }
}

/**
 * Draw floor candidates on canvas (for user selection)
 */
export function drawFloorCandidates(
  ctx: CanvasRenderingContext2D,
  candidates: FloorCandidate[],
  selectedIndex: number = 0
): void {
  candidates.forEach((candidate, index) => {
    const isSelected = index === selectedIndex
    const corners = candidate.corners
    
    // Draw polygon
    ctx.beginPath()
    ctx.moveTo(corners.topLeft.x, corners.topLeft.y)
    ctx.lineTo(corners.topRight.x, corners.topRight.y)
    ctx.lineTo(corners.bottomRight.x, corners.bottomRight.y)
    ctx.lineTo(corners.bottomLeft.x, corners.bottomLeft.y)
    ctx.closePath()
    
    // Fill with semi-transparent color
    ctx.fillStyle = isSelected 
      ? candidate.color + '40' // More opaque for selected
      : candidate.color + '20'
    ctx.fill()
    
    // Outline
    ctx.strokeStyle = isSelected ? candidate.color : candidate.color + '80'
    ctx.lineWidth = isSelected ? 3 : 2
    ctx.stroke()
    
    // Draw corner handles
    if (isSelected) {
      const cornerRadius = 8
      ctx.fillStyle = candidate.color
      
      Object.values(corners).forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, cornerRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }
    
    // Draw label
    const centerX = (corners.topLeft.x + corners.topRight.x) / 2
    const centerY = (corners.topLeft.y + corners.bottomLeft.y) / 2
    
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const label = isSelected 
      ? `✓ Floor ${index + 1} (${(candidate.confidence * 100).toFixed(0)}%)`
      : `Floor ${index + 1}`
    
    ctx.strokeText(label, centerX, centerY)
    ctx.fillText(label, centerX, centerY)
  })
}

/**
 * Get the corner that is closest to a point (for dragging)
 */
export function getCornerAtPoint(
  corners: FloorCorners,
  point: Point,
  threshold: number = 20
): CornerType | null {
  const cornerEntries = Object.entries(corners) as [CornerType, Point][]
  
  for (const [type, corner] of cornerEntries) {
    const distance = Math.hypot(corner.x - point.x, corner.y - point.y)
    if (distance <= threshold) {
      return type
    }
  }
  
  return null
}

/**
 * Update a corner position in FloorCorners
 */
export function updateCorner(
  corners: FloorCorners,
  cornerType: CornerType,
  newPosition: Point
): FloorCorners {
  return {
    ...corners,
    [cornerType]: newPosition
  }
}

/**
 * Draw floor corners with draggable handles (for manual adjustment)
 */
export function drawEditableFloorCorners(
  ctx: CanvasRenderingContext2D,
  corners: FloorCorners,
  draggingCorner: CornerType | null = null,
  color: string = '#D9A676'
): void {
  // Draw floor polygon outline
  ctx.beginPath()
  ctx.moveTo(corners.topLeft.x, corners.topLeft.y)
  ctx.lineTo(corners.topRight.x, corners.topRight.y)
  ctx.lineTo(corners.bottomRight.x, corners.bottomRight.y)
  ctx.lineTo(corners.bottomLeft.x, corners.bottomLeft.y)
  ctx.closePath()
  
  // Semi-transparent fill
  ctx.fillStyle = color + '30'
  ctx.fill()
  
  // Outline
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([5, 5])
  ctx.stroke()
  ctx.setLineDash([])
  
  // Draw corner handles
  const cornerRadius = 10
  const cornerEntries = Object.entries(corners) as [CornerType, Point][]
  
  cornerEntries.forEach(([type, point]) => {
    const isDragging = type === draggingCorner
    const radius = isDragging ? cornerRadius + 2 : cornerRadius
    
    // Outer circle (white border)
    ctx.beginPath()
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Inner circle
    ctx.beginPath()
    ctx.arc(point.x, point.y, radius - 4, 0, Math.PI * 2)
    ctx.fillStyle = isDragging ? '#FFD700' : color
    ctx.fill()
    
    // Label
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const labels: Record<CornerType, string> = {
      topLeft: 'TL',
      topRight: 'TR',
      bottomRight: 'BR',
      bottomLeft: 'BL'
    }
    
    ctx.fillText(labels[type], point.x, point.y - radius - 10)
  })
}

/**
 * Check if point is inside floor polygon
 */
export function isPointInFloor(corners: FloorCorners, point: Point): boolean {
  // Use ray casting algorithm
  const vertices = [
    corners.topLeft,
    corners.topRight,
    corners.bottomRight,
    corners.bottomLeft
  ]
  
  let inside = false
  
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x
    const yi = vertices[i].y
    const xj = vertices[j].x
    const yj = vertices[j].y
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
    
    if (intersect) inside = !inside
  }
  
  return inside
}

