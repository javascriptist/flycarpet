# ThreeCarpetPlacer Component

React Three Fiber component for realistic 3D carpet placement with perspective transform, lighting, shadows, and interactive controls.

## Installation

```bash
npm install
# or
yarn
```

Dependencies added to `package.json`:
- `three@^0.162.0`
- `@react-three/fiber@^9.6.3`
- `@react-three/drei@^9.49.0`

## Usage

### Basic Example

```tsx
import ThreeCarpetPlacer from '@modules/products/components/carpet-placer/ThreeCarpetPlacer'

function ProductPage() {
  return (
    <ThreeCarpetPlacer
      carpetImageUrl="/rugpic/randomrug1.png"
      floorMaskUrl="/api/floor-mask.png"
      enableTransform={true}
    />
  )
}
```

### With Floor Detection Integration

```tsx
import ThreeCarpetPlacer from '@modules/products/components/carpet-placer/ThreeCarpetPlacer'
import { detectFloorAI } from '@lib/ai-floor-detection'

function RoomVisualizer() {
  const [maskUrl, setMaskUrl] = useState<string>()

  const handleRoomUpload = async (roomImage: string) => {
    const result = await detectFloorAI(roomImage, 800, 600)
    if (result.success) {
      setMaskUrl(result.maskUrl)
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => {/* handle upload */}} />
      {maskUrl && (
        <ThreeCarpetPlacer
          carpetImageUrl="/carpets/product-123.jpg"
          floorMaskUrl={maskUrl}
          enableTransform={true}
          onTransformChange={(pos, rot, scale) => {
            console.log('Carpet transform:', { pos, rot, scale })
          }}
        />
      )}
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `carpetImageUrl` | `string` | *required* | URL of the carpet texture image |
| `floorMaskUrl` | `string` | `undefined` | Optional floor mask (PNG with alpha channel) |
| `floorPolygon` | `[number, number][]` | `undefined` | Floor corner points from detection |
| `enableTransform` | `boolean` | `false` | Enable TransformControls for drag/rotate/scale |
| `onTransformChange` | `(pos, rot, scale) => void` | `undefined` | Callback when user transforms the carpet |

## Features

### ✅ Completed

- **3D Scene**: Uses React Three Fiber for WebGL rendering
- **Perspective Transform**: Automatically calculates plane transform from detected floor polygon
- **Mask Clipping**: Applies floor mask as alpha map to clip carpet to floor shape
- **Lighting & Shadows**: 
  - Ambient light (0.6 intensity)
  - Directional light with shadows (0.8 intensity)
  - Contact shadows for realism
- **Interactive Controls**:
  - TransformControls for drag/rotate/scale (when `enableTransform={true}`)
  - OrbitControls for camera movement
- **UI Sliders**:
  - Opacity (0-100%)
  - Scale (0.5x-3x)
  - Rotation X (-30° to +30°)
  - Reset button
- **Persistence**: Settings saved to `localStorage` and restored on reload

## Helper Functions

### `floor-transform.ts`

Utility functions for computing 3D transforms from 2D floor detection:

```ts
import { calculatePlaneTransform, extractFloorPolygon, estimateFloorAngle } from '@lib/floor-transform'

// From OpenCV detection result
const floorPolygon = extractFloorPolygon(detectionResult)
if (floorPolygon) {
  const transform = calculatePlaneTransform(floorPolygon, 800, 600)
  const angle = estimateFloorAngle(floorPolygon)
  console.log('Floor angle:', angle, '°')
}
```

## Performance Optimizations

### Current Optimizations

- Texture loading with `THREE.TextureLoader` (async)
- Contact shadows use low-res blur (2.0) for performance
- Shadow map size: 1024×1024 (balance quality/speed)

### Recommended for Production

1. **Lazy Loading**:
```tsx
const ThreeCarpetPlacer = dynamic(
  () => import('@modules/products/components/carpet-placer/ThreeCarpetPlacer'),
  { ssr: false }
)
```

2. **Texture Compression**:
- Convert carpet images to WebP format
- Use lower resolution for mobile (max 1024×1024)
- Enable mipmaps: `texture.generateMipmaps = true`

3. **Canvas Size Limits**:
```tsx
<ThreeCarpetPlacer
  {...props}
  canvasSize={window.innerWidth > 768 ? 800 : 400}
/>
```

4. **Debounce Transform Updates**:
```tsx
const debouncedOnChange = useMemo(
  () => debounce(onTransformChange, 100),
  [onTransformChange]
)
```

## Testing

### Manual Test

1. Start dev server:
```bash
npm run dev
```

2. Navigate to a product page and click "Try in Your Room"

3. Upload a room photo with visible floor

4. Verify:
   - Carpet renders on detected floor area
   - Sliders adjust opacity, scale, rotation
   - Transform mode allows dragging carpet
   - Settings persist after page refresh

### Build Test

```bash
npm run build
```

Check for:
- No TypeScript errors
- Three.js bundle size (~500KB gzipped)
- No missing dependencies

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 15+)
- Mobile: ✅ Touch controls work

## Troubleshooting

### "Cannot find module 'three'"
Run `npm install` to install dependencies.

### Carpet not visible
- Check `carpetImageUrl` is accessible (CORS enabled)
- Verify texture loads in Network tab
- Try increasing opacity slider to 100%

### Poor performance on mobile
- Reduce canvas size: `<Canvas style={{ maxWidth: 400 }}>` 
- Lower shadow quality: `ContactShadows blur={1}`
- Disable shadows: Remove `castShadow` prop

### Floor mask not applied
- Mask image must be PNG with alpha channel
- White/opaque areas = visible carpet
- Black/transparent areas = hidden carpet

## Next Steps

- Integrate with existing `carpet-placer/index.tsx` component
- Add "Save Configuration" button to export transform data
- Support video/AR preview on mobile devices
- Add presets for common room types (living room, bedroom, etc.)
