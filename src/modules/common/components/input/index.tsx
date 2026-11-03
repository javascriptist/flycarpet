"use client"

import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import { useParams } from "next/navigation"
import { tUi } from "@lib/util/ui-strings"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)
    const countryCode = (useParams()?.countryCode as string | undefined) ?? undefined

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 text-callout text-ink">{tUi(topLabel, countryCode)}</Label>
        )}
        <div className="relative z-0 flex w-full text-body">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            id={props.id ?? name}
            className="mt-0 block h-12 w-full appearance-none rounded-control border-0 bg-surface-raised px-4 pt-4 pb-1 text-ink shadow-hairline outline-none transition focus:ring-2 focus:ring-brand-accent-strong"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={props.id ?? name}
            onClick={() => inputRef.current?.focus()}
            className="pointer-events-none absolute top-3.5 mx-3 flex origin-0 items-center justify-center px-1 text-ink-subtle transition duration-200"
          >
            {tUi(label, countryCode)}
            {required && <span className="ml-0.5 text-ink-subtle">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="no-press absolute right-0 top-3.5 px-4 text-ink-subtle outline-none transition duration-150 focus:text-ink"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
