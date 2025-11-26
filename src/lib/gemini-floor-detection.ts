/**
 * Gemini AI Floor Detection for Room Visualizer
 * Detects floor boundaries in room images to automatically position carpets
 */

export interface FloorCorners {
  topLeft: { x: number; y: number }
  topRight: { x: number; y: number }
  bottomRight: { x: number; y: number }
  bottomLeft: { x: number; y: number }
}

export async function detectFloorCorners(
  imageBase64: string,
  canvasWidth: number = 800,
  canvasHeight: number = 600
): Promise<FloorCorners | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (!apiKey) {
      console.warn('Gemini API key not configured - using fallback positioning')
      return null
    }

    console.log('Using Gemini API key:', apiKey.substring(0, 10) + '...')

    // Remove data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, '')

    const prompt = `Analyze this room image and identify the floor area. 
    
Return ONLY a JSON object with the four corner coordinates of the floor visible in the image.
The coordinates should be normalized to a ${canvasWidth}x${canvasHeight} canvas.

Expected format:
{
  "topLeft": {"x": number, "y": number},
  "topRight": {"x": number, "y": number},
  "bottomRight": {"x": number, "y": number},
  "bottomLeft": {"x": number, "y": number}
}

Guidelines:
- topLeft and topRight should be the back edge of the floor (furthest from camera)
- bottomLeft and bottomRight should be the front edge (closest to camera)
- Coordinates must be within 0-${canvasWidth} for x and 0-${canvasHeight} for y
- Consider perspective: floor appears larger at the bottom (foreground)
- If floor is not clearly visible, estimate a reasonable rectangular area in the lower 60% of the image

Return ONLY the JSON, no additional text.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, response.statusText, errorText)
      return null
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('No response from Gemini')
      return null
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }

    const corners = JSON.parse(jsonText)

    // Validate the response structure
    if (
      corners.topLeft &&
      corners.topRight &&
      corners.bottomRight &&
      corners.bottomLeft &&
      typeof corners.topLeft.x === 'number' &&
      typeof corners.topLeft.y === 'number'
    ) {
      return corners
    }

    console.error('Invalid corner data from Gemini')
    return null
  } catch (error) {
    console.error('Error detecting floor:', error)
    return null
  }
}

/**
 * Fallback floor detection using simple heuristics
 * Used when Gemini API is unavailable or fails
 */
export function getFallbackFloorCorners(
  canvasWidth: number = 800,
  canvasHeight: number = 600
): FloorCorners {
  // Default to lower 60% of image with perspective
  const topY = canvasHeight * 0.4
  const bottomY = canvasHeight * 0.95
  const topInset = canvasWidth * 0.3
  const bottomInset = canvasWidth * 0.05

  return {
    topLeft: { x: topInset, y: topY },
    topRight: { x: canvasWidth - topInset, y: topY },
    bottomRight: { x: canvasWidth - bottomInset, y: bottomY },
    bottomLeft: { x: bottomInset, y: bottomY },
  }
}
