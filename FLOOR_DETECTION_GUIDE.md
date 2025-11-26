# Floor Detection & Carpet AR Guide

## Overview

The Room Visualizer feature uses **OpenCV.js** to automatically detect floor areas in room photos and map carpets with realistic perspective transformation. This creates an AR-like experience for customers to visualize carpets in their own rooms.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ User uploads room photo                                 │
│ ("Xonangizda ko'ring" button)                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ OpenCV.js Floor Detection Pipeline                      │
│                                                          │
│ 1. Image Preprocessing                                  │
│    • Bilateral filter (preserve edges)                  │
│    • Adaptive thresholding                              │
│    • Canny edge detection                               │
│    • Morphological closing                              │
│                                                          │
│ 2. Contour Analysis                                     │
│    • Find all contours                                  │
│    • Filter by geometric properties:                    │
│      - Position (bottom 60% of image)                   │
│      - Size (>10% of image area)                        │
│      - Aspect ratio (width > height)                    │
│      - Width (>30% of image width)                      │
│                                                          │
│ 3. Polygon Approximation                                │
│    • Approximate contours to quadrilaterals             │
│    • Extract 4 corner points                            │
│    • Sort: topLeft, topRight, bottomRight, bottomLeft   │
│                                                          │
│ 4. Candidate Ranking                                    │
│    • Confidence = area / (imageArea * 0.5)              │
│    • Sort by confidence                                 │
│    • Return top candidates                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ User Interaction                                         │
│                                                          │
│ Option 1: Multiple Candidates                           │
│   → Click "Select Floor" to choose from options         │
│   → Each candidate shown with colored overlay           │
│                                                          │
│ Option 2: Manual Adjustment                             │
│   → Click "Edit Floor" button                          │
│   → Drag corner handles (TL, TR, BR, BL)               │
│   → Fine-tune floor boundaries                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Perspective Carpet Mapping                               │
│                                                          │
│ • Calculate perspective transformation                   │
│ • Apply trapezoid distortion (far edge smaller)         │
│ • Render carpet using triangle subdivision               │
│ • Support rotation, scale, opacity controls             │
└─────────────────────────────────────────────────────────┘
```

## Key Files

### 1. `src/lib/opencv-floor-detection.ts`

Core OpenCV.js integration for floor detection.

**Key Functions:**

- `loadOpenCV()` - Loads OpenCV.js from CDN (lazy loading)
- `detectFloorCandidates()` - Main detection pipeline
- `drawFloorCandidates()` - Visualize multiple floor options
- `drawEditableFloorCorners()` - Show draggable corner handles
- `getCornerAtPoint()` - Hit detection for corner dragging
- `updateCorner()` - Update floor corner positions

**Detection Parameters:**

```typescript
// Edge Detection
cv.Canny(blurred, edges, 30, 100) // Lower threshold = more edges

// Morphological Operations
cv.morphologyEx(combined, closed, cv.MORPH_CLOSE, kernel)

// Floor Validation
- Minimum area: 10% of image
- Position: Bottom 60% of image
- Width: >30% of image width
- Aspect ratio: 0.5 - 10.0
- Bottom touch: >60% of image height
```

### 2. `src/modules/products/components/carpet-placer/index.tsx`

React component for carpet placement with perspective.

**Features:**

- ✅ Automatic floor detection on image upload
- ✅ Multi-candidate selection UI
- ✅ Manual corner adjustment (drag TL, TR, BR, BL handles)
- ✅ Real-time perspective transformation
- ✅ Interactive controls (scale, rotation, opacity, position)
- ✅ Download final composition
- ✅ Bilingual UI (Uzbek/Russian)

**State Management:**

```typescript
const [floorCorners, setFloorCorners] = useState<FloorCorners | null>(null)
const [floorCandidates, setFloorCandidates] = useState<FloorCandidate[]>([])
const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0)
const [showCandidates, setShowCandidates] = useState(false)
const [isEditingFloor, setIsEditingFloor] = useState(false)
const [draggingCorner, setDraggingCorner] = useState<CornerType | null>(null)
```

### 3. `src/modules/products/components/room-visualizer-button/index.tsx`

Entry point button and modal wrapper.

## User Workflow

### Step 1: Upload Room Photo

```
User clicks: "Xonangizda ko'ring" / "Посмотрите в вашей комнате"
         ↓
ImageUploader component
         ↓
User selects/takes photo
         ↓
Image stored as base64 data URL
```

### Step 2: Automatic Detection

```
CarpetPlacer receives roomImage
         ↓
Load OpenCV.js (if not loaded)
         ↓
detectFloorCandidates(roomImage, 800, 600)
         ↓
Show detection spinner: "Polni aniqlamoqdamiz"
         ↓
Found N candidates → Sort by confidence
```

### Step 3: Floor Selection (Optional)

If multiple candidates detected:

```
Click "Ko'rsatish" / "Показать" button
         ↓
Overlay shows colored polygons
         ↓
Click preferred floor option
         ↓
Click "✓ Tasdiqlash" / "Подтвердить"
```

### Step 4: Manual Adjustment (Optional)

```
Click "Tahrirlash" / "Редактировать" button
         ↓
Corner handles appear (TL, TR, BR, BL labels)
         ↓
Drag corners to fine-tune floor boundaries
         ↓
Click "Tayyor" / "Готово" when satisfied
```

### Step 5: Carpet Placement

```
Carpet auto-positioned at floor center
         ↓
User adjusts:
  - Position (drag)
  - Scale (slider 30%-300%)
  - Rotation (slider 0°-360°)
  - Opacity (slider 0%-100%)
         ↓
Click "Yuklab olish" / "Скачать" to save
```

## Technical Deep Dive

### Perspective Transformation

The carpet is rendered with realistic perspective using **bilinear interpolation** and **triangle subdivision**:

```typescript
// 1. Calculate perspective-correct corners
const perspectiveRatio = topWidth / bottomWidth

// 2. Interpolate based on Y position (depth)
const normalizedY = (centerY - floorCorners.topLeft.y) / 
                    (floorCorners.bottomLeft.y - floorCorners.topLeft.y)
const perspectiveFactor = perspectiveRatio + (1 - perspectiveRatio) * normalizedY

// 3. Apply to carpet edges
// BACK edge (far away) - smaller due to perspective
const backWidth = carpetWidth * perspectiveFactor

// FRONT edge (close to camera) - full size
const frontWidth = carpetWidth
```

### Triangle Subdivision Method

Instead of simple quad rendering, we subdivide the carpet into a grid of small quads (10×10) and render each independently. This approximates true perspective transformation:

```typescript
const subdivisions = 10

for (let row = 0; row < subdivisions; row++) {
  for (let col = 0; col < subdivisions; col++) {
    // Map source texture region
    const srcX = u1 * image.width
    const srcY = v1 * image.height
    
    // Map to perspective-transformed destination
    const destQuad = interpolateQuad(corners, u1, v1)
    
    // Render subdivision
    ctx.clip()
    ctx.drawImage(...)
  }
}
```

This creates smooth perspective distortion without requiring WebGL or complex matrix transformations.

### Edge Detection Pipeline

```typescript
// Step 1: Bilateral filter - preserves edges while smoothing
cv.bilateralFilter(gray, filtered, 9, 75, 75)

// Step 2: Adaptive threshold - handles varying lighting
cv.adaptiveThreshold(filtered, thresh, 255, 
  cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2)

// Step 3: Canny edge detection
cv.Canny(blurred, edges, 30, 100)

// Step 4: Combine threshold + edges
cv.bitwise_or(thresh, edges, combined)

// Step 5: Morphological closing - connect broken edges
cv.morphologyEx(combined, closed, cv.MORPH_CLOSE, kernel)

// Step 6: Dilation - strengthen edges
cv.dilate(closed, dilated, kernel, new cv.Point(-1, -1), 2)
```

### Geometric Filtering

Contours are validated as floor candidates using multiple criteria:

```typescript
function isFloorCandidate(contour, imageWidth, imageHeight): boolean {
  const area = cv.contourArea(contour)
  const rect = cv.boundingRect(contour)
  const centerY = rect.y + rect.height / 2
  const bottomY = rect.y + rect.height
  const aspectRatio = rect.width / rect.height
  
  return (
    area >= imageArea * 0.1 &&           // Min 10% of image
    centerY >= imageHeight * 0.4 &&      // In bottom 60%
    rect.width >= imageWidth * 0.3 &&    // At least 30% wide
    aspectRatio >= 0.5 &&                 // Not too tall
    aspectRatio <= 10 &&                  // Not too wide
    bottomY >= imageHeight * 0.6          // Touches lower portion
  )
}
```

## Performance Optimization

### OpenCV.js Loading

OpenCV.js (4.8.0) is loaded lazily from CDN only when needed:

```typescript
let cvLoaded = false
let cvLoadingPromise: Promise<void> | null = null

export async function loadOpenCV(): Promise<void> {
  if (cvLoaded) return Promise.resolve()
  if (cvLoadingPromise) return cvLoadingPromise
  
  // Load script, wait for cv.Mat to be available
  // Prevents duplicate loads
}
```

**Size:** ~8MB (loaded once, cached by browser)

### Image Resizing

Room images are resized to canvas dimensions (800×600) before processing:

```typescript
const resized = new cv.Mat()
cv.resize(src, resized, new cv.Size(canvasWidth, canvasHeight))
```

This reduces processing time while maintaining quality.

### Memory Management

All OpenCV Mat objects are explicitly deleted to prevent memory leaks:

```typescript
try {
  const gray = new cv.Mat()
  // ... processing ...
} finally {
  gray.delete()
  filtered.delete()
  edges.delete()
  // ... all mats
}
```

## Fallback Behavior

If floor detection fails (e.g., no suitable contours found, OpenCV error):

```typescript
return [{
  corners: getFallbackFloorCorners(width, height),
  area: width * height * 0.4,
  confidence: 0.3,
  color: '#FF6B6B'
}]

function getFallbackFloorCorners(width, height): FloorCorners {
  return {
    topLeft: { x: width * 0.15, y: height * 0.5 },
    topRight: { x: width * 0.85, y: height * 0.5 },
    bottomRight: { x: width - 1, y: height - 1 },
    bottomLeft: { x: 0, y: height - 1 }
  }
}
```

This provides a reasonable default trapezoid for perspective mapping.

## Future Enhancements

### Potential Improvements

1. **Vanishing Point Detection**
   - Calculate vanishing point from detected lines
   - Use for more accurate perspective estimation

2. **Machine Learning Floor Segmentation**
   - Replace edge detection with ML model (e.g., BodyPix, TensorFlow.js)
   - More robust to complex scenes

3. **Multi-Floor Detection**
   - Detect stairs, split-level floors
   - Allow multiple carpet placements

4. **Real-time Video AR**
   - Use device camera for live preview
   - Track floor plane continuously

5. **3D Rendering**
   - Use Three.js or Babylon.js for true 3D
   - Add shadows, reflections, carpet texture

6. **Wall Detection**
   - Detect wall planes
   - Allow tapestry/rug hanging visualization

## Debugging Tips

### Enable Logging

Detection logs are already verbose in console:

```
🔍 Starting OpenCV floor detection...
📸 Loading image...
✓ Image loaded: 800x600
🔬 Running Canny edge detection...
🔍 Finding contours...
✓ Found 23 contours
  ✓ Candidate 1: { area: 240000, confidence: 100%, topLeft: {x: 120, y: 300} }
✅ Found 3 floor candidates
```

### View Edge Detection

Add intermediate visualization to see what OpenCV detected:

```typescript
// After edge detection
const debugCanvas = document.createElement('canvas')
cv.imshow(debugCanvas, edges) // Show edges
document.body.appendChild(debugCanvas)
```

### Test Different Thresholds

Adjust Canny parameters based on image characteristics:

```typescript
// Bright, high-contrast images
cv.Canny(blurred, edges, 50, 150)

// Dark, low-contrast images
cv.Canny(blurred, edges, 20, 80)

// Very noisy images
cv.Canny(blurred, edges, 100, 200)
```

## Browser Compatibility

| Browser | OpenCV.js | Canvas 2D | Status |
|---------|-----------|-----------|--------|
| Chrome 90+ | ✅ | ✅ | Full support |
| Firefox 88+ | ✅ | ✅ | Full support |
| Safari 14+ | ✅ | ✅ | Full support |
| Edge 90+ | ✅ | ✅ | Full support |
| Mobile Chrome | ✅ | ✅ | Full support |
| Mobile Safari | ✅ | ✅ | Full support |

**Requirements:**
- JavaScript enabled
- Canvas 2D support
- ~10MB free memory for OpenCV.js
- Modern ES6+ support

## Conclusion

The floor detection system provides an intuitive, AI-powered way for customers to visualize carpets in their rooms. By combining OpenCV.js computer vision with interactive React UI and perspective rendering, we create a compelling AR-like experience entirely in the browser.

**Key Benefits:**
- ✅ No app installation required
- ✅ Works on desktop and mobile
- ✅ Automatic floor detection
- ✅ Manual refinement options
- ✅ Realistic perspective mapping
- ✅ Download and share results

---

**Last Updated:** November 2025  
**OpenCV.js Version:** 4.8.0  
**Next.js Version:** 15.0.3
