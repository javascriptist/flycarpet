import React from "react"

type Image = {
  url?: string
  [key: string]: any
}

type Props = {
  thumbnail?: string | null
  images?: Image[] | string[]
  size?: "square" | "full" | "small"
  isFeatured?: boolean
  className?: string
}

const placeholder = "/rug-hero.jpg"

export default function Thumbnail({
  thumbnail,
  images,
  size = "square",
  isFeatured,
  className = "",
}: Props) {
  // Resolve image source from props
  let src = thumbnail || undefined

  if (!src && images && images.length > 0) {
    const first = images[0]
    src = typeof first === "string" ? first : (first as Image).url
  }

  if (!src) {
    src = placeholder
  }

  const baseClasses = "object-cover rounded-md bg-ui-surface"

  const sizeClasses =
    size === "full"
      ? "w-full h-48"
      : size === "small"
      ? "w-10 h-10"
      : "w-16 h-16 small:w-24 small:h-24"

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={"product thumbnail"}
      className={`${baseClasses} ${sizeClasses} ${isFeatured ? "shadow-lg border" : ""} ${className}`.trim()}
      loading="lazy"
    />
  )
}
