# Carpet Placement with Perspective Transform

## The Problem
AI detection gives you a 2D mask (WHERE the floor is), but not the 3D angle (HOW it's oriented in space).

## The Solution: 3-Step Approach

### Step 1: Detect Floor (OpenCV - Already Working!) ✅
- Uses edge detection to find floor boundaries
- Returns 4 corner points as polygon

### Step 2: Estimate 3D Perspective
From the 2D floor polygon, estimate the 3D perspective by analyzing:
- **Vanishing lines**: Parallel lines in 3D converge to a vanishing point in 2D
- **Trapezoid shape**: Floor gets narrower toward the horizon
- **Aspect ratio**: How "squeezed" the far edge is vs near edge

### Step 3: Transform Carpet to Match
Apply CSS `transform: perspective()` or Canvas transformation to warp the carpet image to match the floor's 3D orientation.

---

## Implementation

### Method A: CSS Transform (Simplest, 90% of cases)

```typescript
// 1. Get floor corners from detection
const floorCorners = {
  topLeft: { x: 100, y: 200 },
  topRight: { x: 400, y: 200 },
  bottomRight: { x: 450, y: 500 },
  bottomLeft: { x: 50, y: 500 },
}

// 2. Calculate perspective
const vanishingPointY = calculateVanishingPoint(floorCorners)
const perspectiveDepth = Math.abs(floorCorners.topRight.y - vanishingPointY)

// 3. Apply CSS transform
<img 
  src={carpetImage}
  style={{
    position: 'absolute',
    left: floorCorners.bottomLeft.x,
    top: floorCorners.topLeft.y,
    width: floorCorners.bottomRight.x - floorCorners.bottomLeft.x,
    transform: `
      perspective(${perspectiveDepth}px)
      rotateX(${calculateRotationX(floorCorners)}deg)
      rotateY(${calculateRotationY(floorCorners)}deg)
    `,
    transformOrigin: 'center bottom',
  }}
/>
```

### Method B: Canvas 2D Transform (More Control)

```typescript
// Using perspective-transform library
import PerspT from 'perspective-transform'

// Source: Carpet rectangle
const srcCorners = [0, 0, carpetWidth, 0, carpetWidth, carpetHeight, 0, carpetHeight]

// Destination: Floor perspective
const dstCorners = [
  floorCorners.topLeft.x, floorCorners.topLeft.y,
  floorCorners.topRight.x, floorCorners.topRight.y,
  floorCorners.bottomRight.x, floorCorners.bottomRight.y,
  floorCorners.bottomLeft.x, floorCorners.bottomLeft.y,
]

const perspT = PerspT(srcCorners, dstCorners)

// Draw carpet with perspective
ctx.save()
const matrix = perspT.coeffs
ctx.setTransform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5])
ctx.drawImage(carpetImage, 0, 0, carpetWidth, carpetHeight)
ctx.restore()
```

### Method C: Three.js 3D (Most Realistic)

```typescript
import * as THREE from 'three'

// 1. Create 3D plane for carpet
const carpetGeometry = new THREE.PlaneGeometry(carpetWidth, carpetHeight)
const carpetTexture = new THREE.TextureLoader().load(carpetImage)
const carpetMaterial = new THREE.MeshStandardMaterial({ 
  map: carpetTexture,
  side: THREE.DoubleSide 
})
const carpetMesh = new THREE.Mesh(carpetGeometry, carpetMaterial)

// 2. Position and rotate to match floor perspective
carpetMesh.position.set(centerX, centerY, 0)
carpetMesh.rotation.x = calculateRotationFromCorners(floorCorners)
carpetMesh.rotation.y = calculateYRotation(floorCorners)

// 3. Add to scene with room photo as background
scene.add(carpetMesh)
```

---

## Practical Solution for Your Project

**Recommendation**: Use **Method A (CSS Transform)** first - it's:
- ✅ Simple to implement
- ✅ Works for 90% of room photos
- ✅ No heavy libraries needed
- ✅ Smooth animations/interactions

**Upgrade to Method C (Three.js)** later for:
- Advanced lighting/shadows
- Interactive rotation
- More realistic rendering

---

## Quick Math: Estimate Perspective Angle

```typescript
function estimatePerspectiveAngle(floorCorners: FloorPerspective): number {
  // Measure how much the far edge is "squeezed" compared to near edge
  const nearWidth = floorCorners.bottomRight.x - floorCorners.bottomLeft.x
  const farWidth = floorCorners.topRight.x - floorCorners.topLeft.x
  
  const perspectiveRatio = farWidth / nearWidth
  
  // More squeeze = steeper angle
  // 1.0 = no perspective (looking straight down)
  // 0.5 = moderate perspective (45° angle)
  // 0.2 = steep perspective (70° angle)
  
  const angleInDegrees = (1 - perspectiveRatio) * 60 // Rough approximation
  
  return angleInDegrees
}
```

---

## Next Steps

1. **Extract floor corners** from OpenCV detection (already done!)
2. **Calculate perspective angle** from corner points
3. **Apply CSS transform** to carpet image
4. **Add fine-tuning controls** (let user adjust angle manually)

Want me to implement this in your carpet-placer component?
