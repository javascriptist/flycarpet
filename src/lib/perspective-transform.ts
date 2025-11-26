/**
 * Perspective Transformation for Carpet Placement
 * 
 * Transforms a 2D carpet image to match the 3D perspective of a floor
 * based on the detected floor mask coordinates.
 */

export interface Point2D {
  x: number
  y: number
}

export interface FloorPerspective {
  topLeft: Point2D
  topRight: Point2D
  bottomRight: Point2D
  bottomLeft: Point2D
}

/**
 * Calculate CSS transform matrix for perspective transformation
 * Maps a rectangle (carpet) to a quadrilateral (floor perspective)
 */
export function calculatePerspectiveTransform(
  sourceWidth: number,
  sourceHeight: number,
  targetCorners: FloorPerspective
): string {
  // Source corners (carpet as rectangle)
  const src = [
    { x: 0, y: 0 },                          // top-left
    { x: sourceWidth, y: 0 },                // top-right
    { x: sourceWidth, y: sourceHeight },     // bottom-right
    { x: 0, y: sourceHeight },               // bottom-left
  ]

  // Target corners (floor perspective)
  const dst = [
    targetCorners.topLeft,
    targetCorners.topRight,
    targetCorners.bottomRight,
    targetCorners.bottomLeft,
  ]

  // Calculate perspective matrix (8 degrees of freedom)
  const matrix = computePerspectiveMatrix(src, dst)
  
  return `matrix3d(${matrix.join(', ')})`
}

/**
 * Compute 3D transformation matrix from 4 point correspondences
 * Using homography (perspective transformation)
 */
function computePerspectiveMatrix(
  src: Point2D[],
  dst: Point2D[]
): number[] {
  // This is a simplified version - for production, use a library like 'perspective-transform'
  // or calculate the full homography matrix
  
  // For now, return a basic 3D transform matrix
  // In production, you'd solve the 8-parameter perspective equation
  
  const scaleX = (dst[1].x - dst[0].x) / (src[1].x - src[0].x)
  const scaleY = (dst[3].y - dst[0].y) / (src[3].y - src[0].y)
  const translateX = dst[0].x - src[0].x * scaleX
  const translateY = dst[0].y - src[0].y * scaleY
  
  // Simple affine transform (not full perspective, but good starting point)
  return [
    scaleX, 0, 0, 0,
    0, scaleY, 0, 0,
    0, 0, 1, 0,
    translateX, translateY, 0, 1
  ]
}

/**
 * Extract floor corners from mask bounding box
 * Assumes floor is roughly trapezoidal (closer edge is wider)
 */
export function extractFloorCornersFromMask(
  maskImageUrl: string,
  canvasWidth: number,
  canvasHeight: number
): Promise<FloorPerspective> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Find bounding box of white pixels (mask)
      let minX = canvas.width, maxX = 0
      let minY = canvas.height, maxY = 0
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          const brightness = imageData.data[i] // Red channel (grayscale)
          
          if (brightness > 128) { // White pixel
            minX = Math.min(minX, x)
            maxX = Math.max(maxX, x)
            minY = Math.min(minY, y)
            maxY = Math.max(maxY, y)
          }
        }
      }
      
      // Scale to canvas dimensions
      const scaleX = canvasWidth / canvas.width
      const scaleY = canvasHeight / canvas.height
      
      resolve({
        topLeft: { x: minX * scaleX, y: minY * scaleY },
        topRight: { x: maxX * scaleX, y: minY * scaleY },
        bottomRight: { x: maxX * scaleX, y: maxY * scaleY },
        bottomLeft: { x: minX * scaleX, y: maxY * scaleY },
      })
    }
    
    img.onerror = reject
    img.src = maskImageUrl
  })
}

/**
 * Apply perspective to carpet using CSS transforms
 * Returns CSS style object
 */
export function applyCarpetPerspective(
  carpetWidth: number,
  carpetHeight: number,
  floorCorners: FloorPerspective
): React.CSSProperties {
  const transform = calculatePerspectiveTransform(
    carpetWidth,
    carpetHeight,
    floorCorners
  )
  
  return {
    position: 'absolute',
    width: `${carpetWidth}px`,
    height: `${carpetHeight}px`,
    transform,
    transformOrigin: 'top left',
    // Add shadow for realism
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
  }
}

/**
 * Detect floor perspective from vanishing points
 * More accurate than just using bounding box
 */
export function detectFloorPerspectiveFromLines(
  edges: ImageData
): FloorPerspective | null {
  // This would use Hough transform to detect lines
  // Then find vanishing points where lines converge
  // Then estimate floor plane corners
  
  // For now, return null to use simpler bounding box method
  return null
}

/**
 * Simple estimation: assume floor is in bottom 60% of image
 * and has perspective convergence toward horizon
 */
export function estimateFloorPerspective(
  imageWidth: number,
  imageHeight: number
): FloorPerspective {
  const horizonY = imageHeight * 0.4 // Horizon at 40% from top
  const bottomY = imageHeight * 0.95
  
  // Perspective: top (far) is narrower, bottom (near) is wider
  const topWidth = imageWidth * 0.5
  const bottomWidth = imageWidth * 0.9
  
  const centerX = imageWidth / 2
  
  return {
    topLeft: { 
      x: centerX - topWidth / 2, 
      y: horizonY 
    },
    topRight: { 
      x: centerX + topWidth / 2, 
      y: horizonY 
    },
    bottomRight: { 
      x: centerX + bottomWidth / 2, 
      y: bottomY 
    },
    bottomLeft: { 
      x: centerX - bottomWidth / 2, 
      y: bottomY 
    },
  }
}
