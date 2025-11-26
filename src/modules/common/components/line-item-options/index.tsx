import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type Props = {
  variant?: HttpTypes.StoreProductVariant | HttpTypes.StoreCartLineItem["variant"]
  "data-testid"?: string
}

export default function LineItemOptions({ variant, "data-testid": testId }: Props) {
  if (!variant) {
    return null
  }

  return (
    <Text className="txt-medium text-ui-fg-subtle inline-flex flex-col" data-testid={testId}>
      {variant.title && variant.title !== "Default" && (
        <span>Variant: {variant.title}</span>
      )}
      {variant.options?.map((option) => {
        const value = option.value
        return (
          <span key={option.id}>
            {option.option?.title}: {value}
          </span>
        )
      })}
    </Text>
  )
}
