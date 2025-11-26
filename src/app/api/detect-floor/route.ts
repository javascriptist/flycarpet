import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

/**
 * API Route: Floor Detection using Replicate.com
 * 
 * Uses Grounded SAM - combines object detection with segmentation
 * Perfect for detecting floor areas with text prompts!
 * Cost: ~$0.001 per image (very cheap!)
 * Model: schananas/grounded_sam
 */

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

interface ReplicateOutput {
  masks?: string[] // Base64 encoded masks
  boxes?: number[][] // Bounding boxes
  scores?: number[] // Confidence scores
}

export async function POST(request: NextRequest) {
  try {
    // Check if Replicate API token is configured
    if (!REPLICATE_API_TOKEN) {
      console.log('⚠️  Replicate API token not configured, using OpenCV fallback')
      return NextResponse.json(
        { 
          error: 'Replicate API key not configured',
          fallback: true,
          message: 'Add REPLICATE_API_TOKEN to .env.local for AI detection'
        },
        { status: 200 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    console.log('🔍 Calling Replicate API for floor detection...')
    console.log('  Model: meta/sam (Segment Anything)')
    
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    })

    // Convert base64 to data URI if needed
    let imageDataURI = image
    if (!image.startsWith('data:')) {
      imageDataURI = `data:image/jpeg;base64,${image}`
    }

    console.log('  Image size:', image.length, 'bytes')
    console.log('  Running Grounded SAM for floor segmentation...')

    // Run Grounded SAM - no version hash, uses latest
    // Let Replicate auto-select the working version
    const output = await replicate.run(
      "schananas/grounded_sam",
      {
        input: {
          image: imageDataURI,
          prompt: "floor. ground. flooring.",
          box_threshold: 0.25,
          text_threshold: 0.25,
        }
      }
    ) as any

    console.log('✅ Received segmentation results from Replicate')
    console.log('  Output type:', typeof output, Array.isArray(output) ? 'array' : 'object')

    // Grounded SAM returns object with masks, boxes, labels, scores
    if (!output) {
      console.log('⚠️ No output from model, using OpenCV fallback')
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'No floor detected in image'
      }, { status: 200 })
    }

    // Check if we have segmentation results
    const hasResults = output.masks && output.masks.length > 0
    
    if (!hasResults) {
      console.log('⚠️ No floor segments detected, using OpenCV fallback')
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'No floor area detected'
      }, { status: 200 })
    }

    console.log('🎯 Floor segmentation successful!')
    console.log('  Segments found:', output.masks.length)
    console.log('  Labels:', output.labels)
    console.log('  Scores:', output.scores?.map((s: number) => (s * 100).toFixed(1) + '%'))

    // Get the best mask (first one is usually best)
    const bestMask = output.masks[0]
    const bestBox = output.boxes ? output.boxes[0] : null
    const bestScore = output.scores ? output.scores[0] : 0.9
    const bestLabel = output.labels ? output.labels[0] : 'floor'
    
    // Convert box to polygon if available
    let polygon = null
    if (bestBox) {
      polygon = [
        [bestBox[0], bestBox[1]], // top-left
        [bestBox[2], bestBox[1]], // top-right
        [bestBox[2], bestBox[3]], // bottom-right
        [bestBox[0], bestBox[3]], // bottom-left
      ]
    }

    return NextResponse.json({
      success: true,
      floor: {
        mask: bestMask, // Base64 encoded mask image
        polygon,
        boundingBox: bestBox,
        confidence: bestScore,
        label: bestLabel,
        method: 'ai'
      },
      alternatives: output.masks.slice(1, 3).map((mask: string, i: number) => ({
        mask,
        polygon: output.boxes?.[i + 1] ? [
          [output.boxes[i + 1][0], output.boxes[i + 1][1]],
          [output.boxes[i + 1][2], output.boxes[i + 1][1]],
          [output.boxes[i + 1][2], output.boxes[i + 1][3]],
          [output.boxes[i + 1][0], output.boxes[i + 1][3]],
        ] : null,
        confidence: output.scores?.[i + 1] || 0.8,
        label: output.labels?.[i + 1] || 'floor'
      }))
    })

  } catch (error) {
    console.error('❌ Replicate API error:', error)
    return NextResponse.json(
      {
        error: 'AI detection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      },
      { status: 200 } // Return 200 to trigger OpenCV fallback
    )
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Replicate AI Floor Detection',
    model: 'Grounded SAM (schananas/grounded_sam)',
    version: '141a6077c5ec4791daef94c18dbba833f87fb8c72d8c8c10c3bc8e6301103877',
    configured: !!REPLICATE_API_TOKEN,
    cost: '~$0.001 per image',
    note: 'POST an image (base64) to /api/detect-floor for AI floor segmentation. Falls back to OpenCV if not configured.'
  })
}
