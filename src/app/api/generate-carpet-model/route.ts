import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint to generate a 3D carpet model for AR viewing
 * Carpets are FLAT items where dimensions mean:
 * - width x length (e.g., 3m x 2m) - main dimensions
 * - height/thickness - minimal (0.5cm - 5cm)
 * 
 * Example: 3x2 carpet = 3m wide, 2m long, ~2cm thick
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const image = searchParams.get('image')
    const width = parseFloat(searchParams.get('width') || '4') // Default 4m
    const length = parseFloat(searchParams.get('length') || '3') // Default 3m  
    const height = 0.03 // Default 3cm thickness
    const productId = searchParams.get('productId')

    // Use placeholder carpet image if none provided
    const carpetImage = image || 'https://images2.naintrading.com/data/carpets/91-9248-388x289-01.jpg'
    
    if (!carpetImage) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    console.log('Generating 3D model for carpet:', { 
      productId, 
      width: `${width}m`, 
      length: `${length}m`,
      height: `${height}m (${height * 100}cm thickness)`,
      image: carpetImage 
    })

    // Fetch the image and convert to base64 to avoid CORS issues
    let imageDataUri = carpetImage
    try {
      if (carpetImage.startsWith('http')) {
        console.log('Fetching image to convert to base64...')
        const imageResponse = await fetch(carpetImage)
        const imageBuffer = await imageResponse.arrayBuffer()
        const base64 = Buffer.from(imageBuffer).toString('base64')
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
        imageDataUri = `data:${contentType};base64,${base64}`
        console.log(`✅ Image converted to base64 (${(base64.length / 1024).toFixed(2)} KB)`)
      }
    } catch (error) {
      console.warn('Failed to fetch image, using URL directly:', error)
      // Fallback to direct URL if fetch fails
    }

    // Generate GLB (binary) format for AR compatibility
    // iOS Quick Look and Android Scene Viewer require GLB for embedded textures
    const glbBuffer = generateCarpetGLB(imageDataUri, width, length, height)
    const glbBase64 = glbBuffer.toString('base64')
    const glbDataUrl = `data:model/gltf-binary;base64,${glbBase64}`
    
    console.log(`✅ GLB generated (${(glbBase64.length / 1024).toFixed(2)} KB)`)
    
    const modelData = {
      model_url: glbDataUrl,
      dimensions: { 
        width, 
        length, 
        thickness: height,
        description: `${width}m × ${length}m flat carpet, ${height * 100}cm thick`
      },
      image: carpetImage,
      type: 'flat-plane'
    }

    return NextResponse.json(modelData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating carpet model:', error)
    return NextResponse.json(
      { error: 'Failed to generate 3D model' },
      { status: 500 }
    )
  }
}

/**
 * Create a data URL for a simple GLB model
 * This returns a URL to a generic carpet model for now
 * 
 * @param imageUrl - Carpet texture image URL
 * @param width - Carpet width in meters (x-axis)
 * @param length - Carpet length in meters (z-axis)
 * @param height - Carpet thickness in meters (y-axis, typically 0.03m = 3cm)
 */
function createInlineGLB(imageUrl: string, width: number, length: number, height: number): string {
  // For now, use a simple procedural carpet model
  // The demo box is being replaced with actual carpet geometry
  
  // Simple carpet GLB (this would be your generated model)
  // For immediate testing, we'll generate it inline
  const carpetGLTF = generateCarpetGLTF(imageUrl, width, length, height)
  const gltfString = JSON.stringify(carpetGLTF)
  
  // Return as data URL
  return `data:model/gltf+json;charset=utf-8,${encodeURIComponent(gltfString)}`
}

/**
 * Generate a simple GLTF model for the carpet
 * This creates a FLAT PLANE geometry (single surface, not a box!)
 * 
 * Carpet representation:
 * - Single flat quad (4 vertices forming a rectangle)
 * - Lies on the ground at Y=0 (XZ plane)
 * - Width extends along X-axis (e.g., 3m)
 * - Length extends along Z-axis (e.g., 2m)
 * - No height/thickness dimension (it's a 2D surface in 3D space)
 * - Texture applied to the visible top surface
 */
function generateCarpetGLTF(imageUrl: string, width: number, length: number, height: number = 0.02) {
  // Simple GLTF structure for a textured plane (carpet)
  const gltf = {
    asset: {
      version: "2.0",
      generator: "Urgaz Carpet Store"
    },
    scene: 0,
    scenes: [
      {
        nodes: [0]
      }
    ],
    nodes: [
      {
        mesh: 0,
        name: "Carpet"
      }
    ],
    meshes: [
      {
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1,
              TEXCOORD_0: 2
            },
            indices: 3,
            material: 0
          }
        ]
      }
    ],
    materials: [
      {
        name: "CarpetMaterial",
        pbrMetallicRoughness: {
          baseColorTexture: {
            index: 0
          },
          baseColorFactor: [1.0, 1.0, 1.0, 1.0], // White (shows texture as-is)
          metallicFactor: 0.0,  // Not metallic (carpet is fabric)
          roughnessFactor: 0.9  // Rough surface (typical for carpets)
        },
        doubleSided: true,  // Show both sides since it's a flat plane
        alphaMode: "OPAQUE"
      }
    ],
    textures: [
      {
        source: 0,
        sampler: 0
      }
    ],
    samplers: [
      {
        magFilter: 9729, // LINEAR
        minFilter: 9987, // LINEAR_MIPMAP_LINEAR
        wrapS: 10497,    // REPEAT
        wrapT: 10497     // REPEAT
      }
    ],
    images: [
      {
        uri: imageUrl  // Now using base64 data URI (no CORS!)
      }
    ],
    accessors: [
      // POSITION
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: 4,
        type: "VEC3",
        // Carpet as FLAT PLANE: width (X) x length (Z), Y=0 (flat on ground)
        // This is a 2D surface in 3D space, not a 3D box!
        max: [width/2, 0, length/2],
        min: [-width/2, 0, -length/2]
      },
      // NORMAL
      {
        bufferView: 1,
        componentType: 5126, // FLOAT
        count: 4,
        type: "VEC3"
      },
      // TEXCOORD_0
      {
        bufferView: 2,
        componentType: 5126, // FLOAT
        count: 4,
        type: "VEC2"
      },
      // INDICES
      {
        bufferView: 3,
        componentType: 5123, // UNSIGNED_SHORT
        count: 6,
        type: "SCALAR"
      }
    ],
    bufferViews: [
      // Positions
      {
        buffer: 0,
        byteOffset: 0,
        byteLength: 48, // 4 vertices * 3 components * 4 bytes
        target: 34962 // ARRAY_BUFFER
      },
      // Normals
      {
        buffer: 0,
        byteOffset: 48,
        byteLength: 48, // 4 vertices * 3 components * 4 bytes
        target: 34962 // ARRAY_BUFFER
      },
      // Texture coordinates
      {
        buffer: 0,
        byteOffset: 96,
        byteLength: 32, // 4 vertices * 2 components * 4 bytes
        target: 34962 // ARRAY_BUFFER
      },
      // Indices
      {
        buffer: 0,
        byteOffset: 128,
        byteLength: 12, // 6 indices * 2 bytes
        target: 34963 // ELEMENT_ARRAY_BUFFER
      }
    ],
    buffers: [
      {
        uri: `data:application/octet-stream;base64,${generateCarpetBufferData(width, length)}`,
        byteLength: 140  // Restored: 48 + 48 + 32 + 12
      }
    ]
  }

  return gltf
}

/**
 * Generate binary buffer data for the carpet geometry
 * Creates a FLAT PLANE (single quad surface, not a 3D box!)
 * 
 * @param width - Carpet width in meters (X-axis)
 * @param length - Carpet length in meters (Z-axis)
 * @param height - Unused parameter (kept for compatibility)
 * 
 * Result: 4 vertices forming a flat rectangle at Y=0
 * This is a 2D surface rendered in 3D space
 */
function generateCarpetBufferData(width: number, length: number, height: number = 0.02): string {
  const buffer = new ArrayBuffer(140) // Restored: 48 (pos) + 48 (norm) + 32 (tex) + 12 (ind)
  const view = new DataView(buffer)
  let offset = 0

  // Vertex positions (4 corners of the carpet as a FLAT PLANE)
  // Carpet lies flat on the ground (Y≈0), extends in X and Z
  // This creates a single flat surface, not a box!
  const positions = [
    [-width/2, 0, -length/2], // Bottom-left corner (flat on ground)
    [width/2, 0, -length/2],  // Bottom-right corner (flat on ground)
    [width/2, 0, length/2],   // Top-right corner (flat on ground)
    [-width/2, 0, length/2]   // Top-left corner (flat on ground)
  ]

  positions.forEach(pos => {
    view.setFloat32(offset, pos[0], true); offset += 4
    view.setFloat32(offset, pos[1], true); offset += 4
    view.setFloat32(offset, pos[2], true); offset += 4
  })

  // Normals (all pointing up)
  for (let i = 0; i < 4; i++) {
    view.setFloat32(offset, 0, true); offset += 4 // x
    view.setFloat32(offset, 1, true); offset += 4 // y (up)
    view.setFloat32(offset, 0, true); offset += 4 // z
  }

  // Texture coordinates (map carpet image to surface)
  const texCoords = [
    [0, 0], // Bottom-left
    [1, 0], // Bottom-right
    [1, 1], // Top-right
    [0, 1]  // Top-left
  ]

  texCoords.forEach(uv => {
    view.setFloat32(offset, uv[0], true); offset += 4
    view.setFloat32(offset, uv[1], true); offset += 4
  })

  // Indices (flipped winding order for correct face orientation)
  // Counter-clockwise winding so texture shows on top
  const indices = [0, 2, 1, 0, 3, 2]
  indices.forEach(index => {
    view.setUint16(offset, index, true); offset += 2
  })

  // Convert to base64
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  
  return btoa(binary)
}

/**
 * Generate GLB (binary GLTF) format for AR compatibility
 * iOS Quick Look and Android Scene Viewer require GLB format for textures
 * 
 * GLB Structure:
 * - 12-byte header
 * - JSON chunk (GLTF structure)
 * - BIN chunk (geometry + image data)
 */
function generateCarpetGLB(imageDataUri: string, width: number, length: number, height: number = 0.03): Buffer {
  // Extract base64 image data
  const base64Match = imageDataUri.match(/^data:image\/\w+;base64,(.+)$/)
  if (!base64Match) {
    throw new Error('Invalid image data URI')
  }
  const imageBase64 = base64Match[1]
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  
  console.log(`Image buffer size: ${(imageBuffer.length / 1024).toFixed(2)} KB`)
  
  // Generate geometry buffer (positions + normals + texcoords + indices)
  const geometryBuffer = generateGeometryBuffer(width, length)
  
  // Build binary buffer (BIN chunk): geometry + image
  const binBuffer = Buffer.concat([geometryBuffer, imageBuffer] as any)
  
  // Pad to 4-byte alignment
  const binPadding = (4 - (binBuffer.length % 4)) % 4
  const paddedBinBuffer = Buffer.concat([
    binBuffer,
    Buffer.alloc(binPadding, 0x00)
  ] as any)
  
  // Build GLTF JSON structure
  const gltfJson = {
    asset: {
      version: "2.0",
      generator: "Urgaz Carpet Store GLB"
    },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "Carpet" }],
    meshes: [{
      primitives: [{
        attributes: {
          POSITION: 0,
          NORMAL: 1,
          TEXCOORD_0: 2
        },
        indices: 3,
        material: 0
      }]
    }],
    materials: [{
      name: "CarpetMaterial",
      pbrMetallicRoughness: {
        baseColorTexture: { index: 0 },
        baseColorFactor: [1.0, 1.0, 1.0, 1.0],
        metallicFactor: 0.0,
        roughnessFactor: 0.9
      },
      doubleSided: true,
      alphaMode: "OPAQUE"
    }],
    textures: [{ source: 0, sampler: 0 }],
    samplers: [{
      magFilter: 9729,
      minFilter: 9987,
      wrapS: 10497,
      wrapT: 10497
    }],
    images: [{
      bufferView: 4,  // Image data in buffer
      mimeType: "image/jpeg"
    }],
    accessors: [
      // POSITION
      {
        bufferView: 0,
        componentType: 5126,
        count: 4,
        type: "VEC3",
        max: [width/2, 0, length/2],
        min: [-width/2, 0, -length/2]
      },
      // NORMAL
      {
        bufferView: 1,
        componentType: 5126,
        count: 4,
        type: "VEC3"
      },
      // TEXCOORD_0
      {
        bufferView: 2,
        componentType: 5126,
        count: 4,
        type: "VEC2"
      },
      // INDICES
      {
        bufferView: 3,
        componentType: 5123,
        count: 6,
        type: "SCALAR"
      }
    ],
    bufferViews: [
      // Positions
      { buffer: 0, byteOffset: 0, byteLength: 48, target: 34962 },
      // Normals
      { buffer: 0, byteOffset: 48, byteLength: 48, target: 34962 },
      // Texture coordinates
      { buffer: 0, byteOffset: 96, byteLength: 32, target: 34962 },
      // Indices
      { buffer: 0, byteOffset: 128, byteLength: 12, target: 34963 },
      // Image data
      { buffer: 0, byteOffset: 140, byteLength: imageBuffer.length }
    ],
    buffers: [{
      byteLength: paddedBinBuffer.length
    }]
  }
  
  const jsonString = JSON.stringify(gltfJson)
  const jsonBuffer = Buffer.from(jsonString)
  
  // Pad JSON to 4-byte alignment
  const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4
  const paddedJsonBuffer = Buffer.concat([
    jsonBuffer,
    Buffer.alloc(jsonPadding, 0x20) // Space padding
  ] as any)
  
  // GLB header
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546C67, 0)  // Magic: 'glTF'
  header.writeUInt32LE(2, 4)           // Version: 2
  header.writeUInt32LE(
    12 + 8 + paddedJsonBuffer.length + 8 + paddedBinBuffer.length,
    8
  )  // Total length
  
  // JSON chunk header
  const jsonChunkHeader = Buffer.alloc(8)
  jsonChunkHeader.writeUInt32LE(paddedJsonBuffer.length, 0)
  jsonChunkHeader.writeUInt32LE(0x4E4F534A, 4)  // 'JSON'
  
  // BIN chunk header
  const binChunkHeader = Buffer.alloc(8)
  binChunkHeader.writeUInt32LE(paddedBinBuffer.length, 0)
  binChunkHeader.writeUInt32LE(0x004E4942, 4)  // 'BIN\0'
  
  // Combine all parts
  const glbBuffer = Buffer.concat([
    header,
    jsonChunkHeader,
    paddedJsonBuffer,
    binChunkHeader,
    paddedBinBuffer
  ] as any)
  
  console.log(`✅ GLB total size: ${(glbBuffer.length / 1024).toFixed(2)} KB`)
  
  return glbBuffer
}

/**
 * Generate geometry buffer (not base64, raw binary)
 */
function generateGeometryBuffer(width: number, length: number): Buffer {
  const buffer = Buffer.alloc(140)
  let offset = 0
  
  // Positions
  const positions = [
    [-width/2, 0, -length/2],
    [width/2, 0, -length/2],
    [width/2, 0, length/2],
    [-width/2, 0, length/2]
  ]
  
  positions.forEach(pos => {
    buffer.writeFloatLE(pos[0], offset); offset += 4
    buffer.writeFloatLE(pos[1], offset); offset += 4
    buffer.writeFloatLE(pos[2], offset); offset += 4
  })
  
  // Normals (all pointing up)
  for (let i = 0; i < 4; i++) {
    buffer.writeFloatLE(0, offset); offset += 4  // x
    buffer.writeFloatLE(1, offset); offset += 4  // y (up)
    buffer.writeFloatLE(0, offset); offset += 4  // z
  }
  
  // Texture coordinates
  const texCoords = [[0, 0], [1, 0], [1, 1], [0, 1]]
  texCoords.forEach(uv => {
    buffer.writeFloatLE(uv[0], offset); offset += 4
    buffer.writeFloatLE(uv[1], offset); offset += 4
  })
  
  // Indices (flipped winding order for correct face orientation)
  // Counter-clockwise winding so texture shows on top
  const indices = [0, 2, 1, 0, 3, 2]
  indices.forEach(index => {
    buffer.writeUInt16LE(index, offset); offset += 2
  })
  
  return buffer
}