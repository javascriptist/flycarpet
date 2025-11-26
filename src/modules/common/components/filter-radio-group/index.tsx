"use client"

import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@medusajs/ui"
import React from "react"

type FilterRadioGroupProps = {
  title: React.ReactNode
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
      <div className="flex items-center gap-x-2">
        {typeof title === "string" ? (
          <Text className="txt-compact-small-plus text-ui-fg-muted">{title}</Text>
        ) : (
          title
        )}
      </div>
      <RadioGroup>
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx("flex gap-x-2 items-center", {
              "ml-[-1.75rem]": i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid />}
            <RadioGroup.Item
              checked={i.value === value}
              onClick={(e) => handleChange(i.value)}
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                "!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer",
                {
                  "text-ui-fg-base": i.value === value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
