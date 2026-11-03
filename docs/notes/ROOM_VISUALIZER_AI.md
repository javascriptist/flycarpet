# Room Visualizer with AI Floor Detection

## Overview

The Room Visualizer feature allows customers to see how carpets would look in their own rooms by uploading a photo. It now includes **AI-powered floor detection** using Google's Gemini Pro API.

## Features

✅ **AI Floor Detection** - Automatically detects floor boundaries using Gemini vision model  
✅ **Manual Adjustment** - 4 draggable corner points for fine-tuning  
✅ **Real-time Preview** - See carpet placement with adjustable opacity  
✅ **Download Result** - Save the visualization as PNG  
✅ **Fallback Mode** - Works without API key using smart heuristics  
✅ **Bilingual UI** - Full support for Uzbek and Russian languages

## Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated API key

### 2. Add to Environment Variables

Open your `.env.local` file and add:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Replace `your_actual_gemini_api_key_here` with the key you just copied.

### 3. Restart Dev Server

```bash
npm run dev
```

## How It Works

### AI Detection Flow

1. **User uploads room image** → ImageUploader component
2. **Image sent to Gemini Pro** → Vision model analyzes the image
3. **AI identifies floor area** → Returns 4 corner coordinates
4. **Carpet auto-positioned** → Placed on detected floor area
5. **User fine-tunes** → Drag corners if needed
6. **Download result** → Export as PNG

### Prompt Engineering

The system uses a carefully crafted prompt to guide Gemini:

```
Analyze this room image and identify the floor area.

Return ONLY a JSON object with the four corner coordinates of the floor visible in the image.
The coordinates should be normalized to a 800x600 canvas.

Guidelines:
- topLeft and topRight should be the back edge of the floor (furthest from camera)
- bottomLeft and bottomRight should be the front edge (closest to camera)
- Consider perspective: floor appears larger at the bottom (foreground)
- If floor is not clearly visible, estimate a reasonable rectangular area
```

### Fallback Strategy

If the Gemini API:
- Is not configured (no API key)
- Fails to respond
- Returns invalid data

The system automatically falls back to heuristic-based positioning:
- Places carpet in lower 60% of image
- Applies realistic perspective (narrower at top, wider at bottom)
- Still fully adjustable by user

## Usage

### For Customers

1. Navigate to any product page
2. Click **"Xonangizda ko'ring"** (View in your room)
3. Upload a room photo (drag & drop or click)
4. Wait for AI to detect floor (~2-3 seconds)
5. Adjust corners if needed
6. Download the result

### For Developers

```typescript
import { detectFloorCorners, getFallbackFloorCorners } from "@lib/gemini-floor-detection"

// Detect floor with AI
const corners = await detectFloorCorners(imageBase64, 800, 600)

// Or use fallback
const fallbackCorners = getFallbackFloorCorners(800, 600)
```

## API Usage & Costs

### Gemini 1.5 Flash Pricing (as of Nov 2024)

- **Input**: Free for first 15 requests/minute
- **Images**: ~$0.00025 per image (1.5 Flash)
- **Very affordable** for production use

### Rate Limits

- 15 requests per minute (free tier)
- 1500 requests per day (free tier)
- Upgrade available if needed

## File Structure

```
src/
├── lib/
│   └── gemini-floor-detection.ts       # AI detection logic
└── modules/
    └── products/
        └── components/
            ├── room-visualizer-button/  # Main button & modal
            ├── image-uploader/          # Photo upload UI
            └── carpet-placer/           # Canvas visualization
```

## Troubleshooting

### "API Key Not Configured"

**Solution**: Add `NEXT_PUBLIC_GEMINI_API_KEY` to `.env.local`

### "Floor Detection Failed"

**Solution**: System automatically uses fallback positioning. User can still adjust manually.

### CORS Errors with Product Images

**Solution**: Already handled via Next.js image proxy (`/_next/image`)

### Canvas Not Updating

**Solution**: 
1. Clear browser cache
2. Restart dev server
3. Check console for errors

## Browser Compatibility

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Image load**: ~500ms
- **AI detection**: 2-3 seconds
- **Canvas rendering**: 60 FPS
- **Download**: Instant

## Future Enhancements

- [ ] Shadow generation for realistic placement
- [ ] Lighting adjustment
- [ ] Multiple carpets in one room
- [ ] Touch optimization for mobile
- [ ] Undo/redo functionality
- [ ] Save to favorites

## Credits

- **AI Model**: Google Gemini 1.5 Flash
- **Canvas API**: HTML5 Canvas
- **Image Processing**: Next.js Image Optimization
- **UI Components**: Radix UI + Tailwind CSS

## Support

For issues or questions:
1. Check console logs for detailed errors
2. Verify API key is correctly set
3. Test with fallback mode (remove API key temporarily)
4. Contact support if problem persists
