/**
 * Client-side floor detection using image analysis
 * No external dependencies - uses canvas pixel analysis
 */

export interface FloorCorners {
  topLeft: { x: number; y: number }
  topRight: { x: number; y: number }
  bottomLeft: { x: number; y: number }
  bottomRight: { x: number; y: number }
}

/**
 * Detect floor boundaries using edge detection and perspective analysis
 */
export async function detectFloorWithDepth(
  imageBase64: string,
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Promise<FloorCorners | null> {
  console.log('🔬 detectFloorWithDepth called')
  console.log('  Canvas dimensions:', canvasWidth, 'x', canvasHeight)
  console.log('  Image data length:', imageBase64.length)
  
  try {
    // Create temporary canvas for analysis
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      console.error('❌ Failed to get canvas context')
      return null
    }

    console.log('  ✓ Canvas context created')

    // Load image
    const img = await loadImage(imageBase64)
    console.log('  ✓ Image loaded:', img.width, 'x', img.height)
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
    console.log('  ✓ Image data extracted:', imageData.data.length, 'bytes')
    
    // Detect floor using multiple techniques
    const floorRegion = detectFloorRegion(imageData, canvasWidth, canvasHeight)
    console.log('  ✓ Floor region detected:', floorRegion)
    
    return floorRegion
  } catch (error) {
    console.warn('⚠️ Depth-based floor detection failed:', error)
    return null
  }
}

/**
 * Load image from base64
 */
function loadImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`
  })
}

/**
 * Detect floor region using edge detection and color analysis
 */
function detectFloorRegion(
  imageData: ImageData,
  width: number,
  height: number
): FloorCorners {
  console.log('  🔍 Analyzing floor region...')
  const data = imageData.data
  
  // Strategy 1: Find horizontal edges (likely floor-wall boundary)
  const horizontalEdges: number[] = []
  const edgeThreshold = 30
  
  console.log('    Strategy 1: Edge detection...')
  
  // Scan horizontal lines for significant color changes
  for (let y = Math.floor(height * 0.3); y < height - 1; y++) {
    let edgeStrength = 0
    
    for (let x = 0; x < width - 1; x++) {
      const idx = (y * width + x) * 4
      const nextIdx = ((y + 1) * width + x) * 4
      
      // Calculate gradient (color difference between rows)
      const gradient = Math.abs(data[idx] - data[nextIdx]) +
                      Math.abs(data[idx + 1] - data[nextIdx + 1]) +
                      Math.abs(data[idx + 2] - data[nextIdx + 2])
      
      edgeStrength += gradient
    }
    
    // Normalize edge strength
    edgeStrength = edgeStrength / width
    
    if (edgeStrength > edgeThreshold) {
      horizontalEdges.push(y)
    }
  }
  
  console.log('    ✓ Found', horizontalEdges.length, 'horizontal edges')
  if (horizontalEdges.length > 0) {
    console.log('      First edge at Y:', horizontalEdges[0])
  }
  
  // Strategy 2: Detect vanishing point (perspective)
  console.log('    Strategy 2: Vanishing point detection...')
  const vanishingY = detectVanishingPoint(data, width, height)
  console.log('    ✓ Vanishing point Y:', vanishingY)
  
  // Strategy 3: Color histogram analysis (floor often has consistent color)
  console.log('    Strategy 3: Color analysis...')
  const floorColorY = detectFloorByColor(data, width, height)
  console.log('    ✓ Floor color transition Y:', floorColorY)
  
  // Combine strategies to determine floor boundaries
  let floorTopY: number
  
  if (horizontalEdges.length > 0) {
    // Use the first strong horizontal edge as floor top
    floorTopY = horizontalEdges[0]
    console.log('  ✅ Using edge detection: floorTopY =', floorTopY)
  } else if (vanishingY) {
    floorTopY = vanishingY
    console.log('  ✅ Using vanishing point: floorTopY =', floorTopY)
  } else if (floorColorY) {
    floorTopY = floorColorY
    console.log('  ✅ Using color analysis: floorTopY =', floorColorY)
  } else {
    // Fallback: assume floor starts at 50% of image
    floorTopY = Math.floor(height * 0.5)
    console.log('  ⚠️ Using fallback: floorTopY =', floorTopY)
  }
  
  // Apply perspective: floor appears larger at bottom
  const perspectiveFactor = 0.15 // How much narrower the back is
  
  const topWidth = width * (1 - perspectiveFactor)
  const topMargin = (width - topWidth) / 2
  
  const result = {
    topLeft: {
      x: Math.floor(topMargin),
      y: Math.floor(floorTopY)
    },
    topRight: {
      x: Math.floor(width - topMargin),
      y: Math.floor(floorTopY)
    },
    bottomLeft: {
      x: 0,
      y: height - 1
    },
    bottomRight: {
      x: width - 1,
      y: height - 1
    }
  }
  
  console.log('  📐 Final floor corners:', result)
  
  return result
}

/**
 * Detect vanishing point using line detection
 */
function detectVanishingPoint(
  data: Uint8ClampedArray,
  width: number,
  height: number
): number | null {
  // Sample brightness along vertical center line
  const centerX = Math.floor(width / 2)
  const brightnesses: number[] = []
  
  for (let y = 0; y < height; y++) {
    const idx = (y * width + centerX) * 4
    const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
    brightnesses.push(brightness)
  }
  
  // Find the point where brightness changes most (horizon line)
  let maxChange = 0
  let vanishingY = null
  
  for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.7); y++) {
    const change = Math.abs(brightnesses[y] - brightnesses[y + 10])
    if (change > maxChange) {
      maxChange = change
      vanishingY = y
    }
  }
  
  return vanishingY
}

/**
 * Detect floor by finding region with consistent color
 */
function detectFloorByColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): number | null {
  // Sample bottom 20% of image to get dominant floor color
  const sampleY = Math.floor(height * 0.85)
  const colorSamples: { r: number; g: number; b: number }[] = []
  
  for (let x = 0; x < width; x += 10) {
    const idx = (sampleY * width + x) * 4
    colorSamples.push({
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2]
    })
  }
  
  // Calculate average floor color
  const avgColor = {
    r: colorSamples.reduce((sum, c) => sum + c.r, 0) / colorSamples.length,
    g: colorSamples.reduce((sum, c) => sum + c.g, 0) / colorSamples.length,
    b: colorSamples.reduce((sum, c) => sum + c.b, 0) / colorSamples.length
  }
  
  // Find where this color starts (top of floor)
  const colorThreshold = 40
  
  for (let y = Math.floor(height * 0.3); y < height; y++) {
    let matchingPixels = 0
    
    for (let x = 0; x < width; x += 10) {
      const idx = (y * width + x) * 4
      const distance = Math.sqrt(
        Math.pow(data[idx] - avgColor.r, 2) +
        Math.pow(data[idx + 1] - avgColor.g, 2) +
        Math.pow(data[idx + 2] - avgColor.b, 2)
      )
      
      if (distance < colorThreshold) {
        matchingPixels++
      }
    }
    
    // If more than 50% of pixels match floor color, this is likely the floor top
    if (matchingPixels / (width / 10) > 0.5) {
      return y
    }
  }
  
  return null
}

/**
 * Fallback floor detection (simple heuristic)
 */
export function getFallbackFloorCorners(
  canvasWidth: number = 800,
  canvasHeight: number = 600
): FloorCorners {
  const perspectiveFactor = 0.15
  const topY = Math.floor(canvasHeight * 0.5)
  const topWidth = canvasWidth * (1 - perspectiveFactor)
  const topMargin = (canvasWidth - topWidth) / 2
  
  return {
    topLeft: { x: Math.floor(topMargin), y: topY },
    topRight: { x: Math.floor(canvasWidth - topMargin), y: topY },
    bottomLeft: { x: 0, y: canvasHeight - 1 },
    bottomRight: { x: canvasWidth - 1, y: canvasHeight - 1 }
  }
}
