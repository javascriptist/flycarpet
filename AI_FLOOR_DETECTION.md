# AI-Powered Floor Detection with Hugging Face Grounded-SAM

This implementation uses Hugging Face's Inference API with the Grounded-SAM model to automatically detect floor areas in room photos.

## Setup

1. **Get a Hugging Face API Key:**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token with "Read" permissions
   - Copy the token

2. **Add to `.env.local`:**
   ```bash
   HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## How It Works

### 1. User Uploads Room Photo
- Frontend: `image-uploader` component handles file upload
- Converts image to Base64
- Sends to `/api/detect-floor` endpoint

### 2. Backend Calls Grounded-SAM
- Model: `IDEA-Research/grounded-sam`
- Prompt: "floor" or "floor area"
- Grounding DINO identifies floor regions
- SAM creates precise segmentation mask

### 3. Returns Floor Mask
- **mask**: Base64-encoded binary mask (white = floor)
- **polygon**: Corner coordinates for easy rendering
- **boundingBox**: [x1, y1, x2, y2]
- **confidence**: 0.0 to 1.0 score

### 4. Frontend Displays Result
- Overlay mask on room photo (semi-transparent)
- User can confirm or adjust
- Place carpet texture within mask area

### 5. Carpet Placement with Three.js
- Carpet as plane geometry
- Floor mask applied as alpha channel
- User can move/rotate/scale
- Perspective transformation for realism

## API Endpoints

### POST `/api/detect-floor`
Detect floor area in uploaded image.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "prompt": "floor" // optional
}
```

**Response (Success):**
```json
{
  "success": true,
  "floor": {
    "mask": "data:image/png;base64,iVBOR...",
    "polygon": {
      "topLeft": { "x": 100, "y": 200 },
      "topRight": { "x": 700, "y": 200 },
      "bottomRight": { "x": 700, "y": 500 },
      "bottomLeft": { "x": 100, "y": 500 }
    },
    "boundingBox": [100, 200, 700, 500],
    "confidence": 0.87,
    "label": "floor"
  },
  "alternatives": []
}
```

**Response (Fallback):**
```json
{
  "error": "No floor detected",
  "fallback": true,
  "message": "Using OpenCV fallback detection"
}
```

### GET `/api/detect-floor`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "model": "IDEA-Research/grounded-sam",
  "apiKeyConfigured": true
}
```

## Fallback Strategy

If Hugging Face API fails or is unavailable:
1. **OpenCV Detection** (current implementation)
2. **Manual Selection** (user draws floor area)

## Model Information

**Grounded-SAM** combines two models:
- **Grounding DINO**: Detects objects from text prompts
- **SAM (Segment Anything)**: Creates precise segmentation masks

Advantages:
- ✅ Accurate floor detection
- ✅ Works with text prompts
- ✅ Handles complex scenes
- ✅ Multiple floor candidates

Limitations:
- ⚠️ Requires internet connection
- ⚠️ ~2-5 second processing time
- ⚠️ Model may need "warm-up" (first request slower)
- ⚠️ Free tier has rate limits

## Cost Considerations

**Hugging Face Inference API:**
- **Free Tier**: 1,000 requests/month
- **Pro**: $9/month for 10,000 requests
- **Enterprise**: Custom pricing

For high traffic, consider:
- Self-hosting the model
- Caching results
- Using OpenCV as primary with HF as enhancement

## Testing

```bash
# Test the API directly
curl -X POST http://localhost:8000/api/detect-floor \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,..."}'

# Health check
curl http://localhost:8000/api/detect-floor
```

## Performance Tips

1. **Resize images** before sending (max 1024px)
2. **Cache results** for same room photos
3. **Show loading state** (2-5 seconds)
4. **Handle "model loading"** error gracefully
5. **Implement retry logic** with exponential backoff

## Next Steps

- [ ] Add Three.js carpet placement
- [ ] Implement mask editing tools
- [ ] Add lighting simulation
- [ ] Create shadow rendering
- [ ] Support multiple floor types (wood, tile, carpet)
- [ ] Add AR camera view option
