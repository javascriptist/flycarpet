"use client"

import { HttpTypes } from "@medusajs/types"
import { cx } from "@lib/util/cx"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
}

/**
 * Phone: full-bleed swipe carousel (native scroll-snap, so momentum and
 * rubber-banding come from the OS) with a counter.
 * Desktop: hero image + two-column grid, everything visible while the
 * buy panel stays sticky beside it.
 */
const ImageGallery = ({ images, title = "" }: ImageGalleryProps) => {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const list = images.filter((i) => !!i.url)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth))
      setIndex(Math.min(list.length - 1, Math.max(0, i)))
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [list.length])

  if (!list.length) {
    return <div className="aspect-[4/5] w-full rounded-card bg-brand-linen" />
  }

  const alt = (i: number) => (title ? `${title} — ${i + 1}` : `Product image ${i + 1}`)

  return (
    <div className="relative">
      {/* Phone carousel */}
      <div className="relative -mx-6 small:hidden">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-roledescription="carousel"
        >
          {list.map((image, i) => (
            <div
              key={image.id}
              className="relative aspect-[4/5] w-full shrink-0 snap-center bg-brand-linen"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${list.length}`}
            >
              <Image
                src={image.url}
                alt={alt(i)}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
        {list.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center" aria-hidden>
            <div className="glass flex items-center gap-1.5 rounded-full px-3 py-2">
              {list.map((image, i) => (
                <span
                  key={image.id}
                  className={cx(
                    "h-1.5 rounded-full transition-[width,background-color] duration-200",
                    i === index ? "w-4 bg-ink" : "w-1.5 bg-ink/30"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop grid */}
      <div className="hidden small:grid grid-cols-2 gap-3">
        {list.map((image, i) => (
          <div
            key={image.id}
            id={image.id}
            className={cx(
              "relative overflow-hidden rounded-card bg-brand-linen",
              // first image wide; a leftover last image also goes wide (no orphan)
              i === 0 || (i === list.length - 1 && list.length % 2 === 0)
                ? "col-span-2 aspect-[4/3]"
                : "aspect-[4/5]"
            )}
          >
            <Image
              src={image.url}
              alt={alt(i)}
              fill
              priority={i <= 2}
              sizes="(min-width: 1440px) 860px, 60vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
