import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId, productId, length, quantity = 1, customerNote, metadata } = body

    console.log('Custom carpet API called with:', { cartId, productId, length, quantity, customerNote, metadata })

    if (!cartId || !productId || !length || length <= 0) {
      console.log('Validation failed:', { cartId, productId, length })
      return NextResponse.json(
        { success: false, message: 'Cart ID, Product ID, and valid length are required' },
        { status: 400 }
      )
    }

    // TODO: In a real implementation, you would:
    // 1. Fetch the product from Medusa to get base price
    // 2. Calculate total price based on length
    // 3. Add the custom item to the cart with metadata
    // 4. Update inventory if needed

    // For now, we'll return a success response
    // This endpoint should integrate with your Medusa backend
    
    const pricePerMeter = 45.00 // Should come from product
    const totalPrice = pricePerMeter * length

    // This is a mock response - replace with actual Medusa cart update
    const response = {
      success: true,
      message: `Custom carpet (${length}m) added to cart`,
      data: {
        cartId,
        item: {
          productId,
          length,
          quantity,
          totalPrice,
          metadata: {
            ...metadata,
            carpet_type: "roll_custom",
            custom_length: length,
            customer_specifications: customerNote
          }
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Add custom carpet to cart error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}