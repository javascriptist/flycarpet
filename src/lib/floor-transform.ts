/**
 * Compute 3D plane transform from detected 2D floor polygon.
 * Uses homography/perspective transformation to map carpet onto floor area.
 */

import PerspT from 'perspective-transform'

export interface Point2D {
  x: number
  y: number
}

export interface FloorPolygon {
  topLeft: Point2D
  topRight: Point2D
  bottomRight: Point2D
  bottomLeft: Point2D
}

/**
 * Calculate Three.js plane position, rotation, and scale
 * from a detected floor polygon.
 */
export function calculatePlaneTransform(
  floorPolygon: FloorPolygon,
  canvasWidth: number,
  canvasHeight: number
): {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
} {
  // Convert pixel coordinates to normalized [-1, 1] range
  const normalize = (p: Point2D) => ({
    x: (p.x / canvasWidth) * 2 - 1,
    y: -((p.y / canvasHeight) * 2 - 1), // Flip Y
  })

  const tl = normalize(floorPolygon.topLeft)
  const tr = normalize(floorPolygon.topRight)
  const br = normalize(floorPolygon.bottomRight)
  const bl = normalize(floorPolygon.bottomLeft)

  // Calculate center position
  const centerX = (tl.x + tr.x + br.x + bl.x) / 4
  const centerY = (tl.y + tr.y + br.y + bl.y) / 4

  // Calculate width and height
  const topWidth = Math.abs(tr.x - tl.x)
  const bottomWidth = Math.abs(br.x - bl.x)
  const leftHeight = Math.abs(bl.y - tl.y)
  const rightHeight = Math.abs(br.y - tr.y)

  const avgWidth = (topWidth + bottomWidth) / 2
  const avgHeight = (leftHeight + rightHeight) / 2

  // Estimate rotation from trapezoid shape
  // If top is narrower than bottom, floor is tilted away (rotateX > 0)
  const perspectiveRatio = topWidth / bottomWidth
  const rotationX = (1 - perspectiveRatio) * (Math.PI / 4) // Max 45 degrees

  // Calculate Y rotation from horizontal skew
  const topCenterX = (tl.x + tr.x) / 2
  const bottomCenterX = (bl.x + br.x) / 2
  const horizontalSkew = topCenterX - bottomCenterX
  const rotationY = horizontalSkew * Math.PI // Rough approximation

  return {
    position: [centerX * 5, 0, centerY * 5], // Scale to 3D space
    rotation: [-Math.PI / 2 + rotationX, rotationY, 0],
    scale: [avgWidth * 5, avgHeight * 5, 1],
  }
}

/**
 * Create a perspective transformation matrix from floor polygon
 * for mapping 2D carpet texture to 3D floor plane.
 */
export function createPerspectiveTransform(
  floorPolygon: FloorPolygon,
  carpetWidth: number,
  carpetHeight: number
): PerspT.PerspT {
  // Source: carpet rectangle (normalized)
  const srcCorners = [0, 0, 1, 0, 1, 1, 0, 1]

  // Destination: floor polygon (normalized)
  const dstCorners = [
    floorPolygon.topLeft.x,
    floorPolygon.topLeft.y,
    floorPolygon.topRight.x,
    floorPolygon.topRight.y,
    floorPolygon.bottomRight.x,
    floorPolygon.bottomRight.y,
    floorPolygon.bottomLeft.x,
    floorPolygon.bottomLeft.y,
  ]

  return PerspT(srcCorners, dstCorners)
}

/**
 * Extract floor corners from OpenCV detection result.
 * Assumes the result contains a polygon array.
 */
export function extractFloorPolygon(
  detectionResult: { polygon?: number[][] }
): FloorPolygon | null {
  if (!detectionResult.polygon || detectionResult.polygon.length < 4) {
    return null
  }

  const [p0, p1, p2, p3] = detectionResult.polygon

  return {
    topLeft: { x: p0[0], y: p0[1] },
    topRight: { x: p1[0], y: p1[1] },
    bottomRight: { x: p2[0], y: p2[1] },
    bottomLeft: { x: p3[0], y: p3[1] },
  }
}

/**
 * Estimate floor perspective angle from polygon shape.
 * Returns angle in degrees (0 = flat, 90 = vertical).
 */
export function estimateFloorAngle(floorPolygon: FloorPolygon): number {
  const topWidth = Math.abs(
    floorPolygon.topRight.x - floorPolygon.topLeft.x
  )
  const bottomWidth = Math.abs(
    floorPolygon.bottomRight.x - floorPolygon.bottomLeft.x
  )

  const perspectiveRatio = topWidth / bottomWidth

  // More compression = steeper angle
  // 1.0 = no perspective (0°)
  // 0.5 = moderate (45°)
  // 0.2 = steep (70°)
  const angleRadians = (1 - perspectiveRatio) * (Math.PI / 2)
  return (angleRadians * 180) / Math.PI
}
