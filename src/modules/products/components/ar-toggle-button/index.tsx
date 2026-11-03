"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { cx } from "@lib/util/cx"
import Sheet from "@modules/common/components/sheet"
import { t } from "@lib/util/translations"
import { ARCarpetViewer } from "../ar-carpet-viewer"

interface ARToggleButtonProps {
  product: any
  carpetImage: string
  carpetSize?: { width: number; length: number }
  className?: string
}

/**
 * Secondary action: "View in your room". Opens the 3D / AR viewer in a
 * bottom sheet (phone) or a dialog (desktop). The sheet only renders its
 * content while open, so nothing heavy loads until it's asked for.
 */
export const ARToggleButton: React.FC<ARToggleButtonProps> = ({
  product,
  carpetImage,
  carpetSize,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const countryCode = useParams().countryCode as string

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cx("btn-secondary w-full", className)}
        aria-haspopup="dialog"
        data-testid="ar-button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
          <path d="M4 7.5 12 12l8-4.5M12 12v9" />
        </svg>
        {t({ uz: "Xonangizda koʼring", ru: "Посмотреть в комнате", en: "View in your room" }, countryCode)}
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={t({ uz: "Xonangizda koʼring", ru: "Посмотреть в комнате", en: "View in your room" }, countryCode)}
        closeLabel={t({ uz: "Yopish", ru: "Закрыть", en: "Close" }, countryCode)}
        data-testid="ar-sheet"
      >
        <ARCarpetViewer
          product={product}
          carpetImage={carpetImage}
          carpetSize={carpetSize}
        />
      </Sheet>
    </>
  )
}
