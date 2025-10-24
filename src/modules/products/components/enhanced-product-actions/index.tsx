"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "../product-actions/mobile-actions"
import { RollCarpetSelector } from "../roll-carpet-selector"
import { RollCarpetAddToCart } from "../roll-carpet-add-to-cart"
import { ARToggleButton } from "../ar-toggle-button"
import { isRollCarpet, getCarpetWidth, getStockLength } from "@lib/util/carpet-helpers"
import { getExchangeRate } from "@lib/data/exchange-rate"

type EnhancedProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  exchangeRate?: number
  cartId?: string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function EnhancedProductActions({
  product,
  region,
  disabled,
  exchangeRate,
  cartId,
}: EnhancedProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [customLength, setCustomLength] = useState<number>(1)
  const [customPrice, setCustomPrice] = useState<number>(0)
  
  const countryCode = useParams().countryCode as string
  const isLang = countryCode === "uz"
  const isRoll = isRollCarpet(product)

  // Debug logging
  console.log('EnhancedProductActions - cartId:', cartId)
  console.log('EnhancedProductActions - isRoll:', isRoll)
  console.log('EnhancedProductActions - product.metadata:', product.metadata)

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart (regular products)
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  // handle success for roll carpet
  const handleRollCarpetSuccess = () => {
    // Optionally redirect or show success message
    window.location.reload() // Simple approach to refresh cart
  }

  if (isRoll) {
    // Roll Carpet Product - Custom Interface with AR
    const carpetWidth = parseFloat(getCarpetWidth(product)) || 3
    const stockLength = getStockLength(product)
    const carpetLength = customLength || stockLength || 2
    const carpetSize = { 
      width: carpetWidth, 
      length: carpetLength 
    }
    const carpetImage = product.thumbnail || product.images?.[0]?.url || ''

    return (
      <div className="flex flex-col gap-y-6" ref={actionsRef}>
        {/* AR Viewer Button */}
        <ARToggleButton
          product={product}
          carpetImage={carpetImage}
          carpetSize={carpetSize}
        />
        
        <RollCarpetSelector
          product={product}
          countryCode={countryCode}
          exchangeRate={exchangeRate}
          onPriceChange={(price) => setCustomPrice(price)}
          onLengthChange={(length) => setCustomLength(length)}
        />
        
        <RollCarpetAddToCart
          product={product}
          customLength={customLength}
          totalPrice={customPrice}
          countryCode={countryCode}
          exchangeRate={exchangeRate}
          cartId={cartId}
          onSuccess={handleRollCarpetSuccess}
        />
      </div>
    )
  }

  // Regular Product - Standard Interface with AR
  const regularCarpetSize = { 
    width: parseFloat(getCarpetWidth(product)) || 3, 
    length: getStockLength(product) || 2 
  }
  const regularCarpetImage = product.thumbnail || product.images?.[0]?.url || ''

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {/* AR Viewer for Regular Products */}
        <ARToggleButton
          product={product}
          carpetImage={regularCarpetImage}
          carpetSize={regularCarpetSize}
          className="mb-4"
        />
        
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4 mb-4 ">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id} >
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} exchangeRate={exchangeRate} />

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="secondary"
          className="w-full h-10 rounded-3xl liquid-glass text-black hover:bg-[#D4682D] hover:text-white transition-all duration-200 border-transparent outline-none focus:outline-none focus:ring-2 focus:ring-[#FF6A1A] focus:ring-offset-2 focus:ring-offset-white"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? (isLang ? "Tanlang" : "Выберите")
            : !inStock || !isValidVariant
            ? (isLang ? "Mavjud emas" : "Недоступно")
            : (isLang ? "Savatchaga qo'shish" : "Добавить в корзину")
          }
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          isLang={isLang}
          exchangeRate={exchangeRate}
        />
      </div>
    </>
  )
}