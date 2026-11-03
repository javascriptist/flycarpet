"use client"

import { cx } from "@lib/util/cx"
import React, { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"

/**
 * Bottom sheet on phones, centred dialog on desktop.
 *
 * Phone behaviour follows the apple-design skill:
 * - enters and leaves along the same path (from / to the bottom edge)
 * - the handle tracks the finger 1:1 and respects where it was grabbed
 * - release velocity is projected forward to decide dismiss vs. snap back
 * - dragging up past the top rubber-bands instead of stopping hard
 * - a grab mid-animation starts from the on-screen position (interruptible)
 */

type SheetProps = {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  /** Accessible label for the close button */
  closeLabel?: string
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}

const DRAWER_MS = 400
const FADE_MS = 200
const DESKTOP_QUERY = "(min-width: 1024px)"

// Apple's momentum projection (Designing Fluid Interfaces, WWDC 2018)
const project = (velocity: number, decelerationRate = 0.998) =>
  ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)

const rubberband = (overshoot: number, dimension: number, constant = 0.55) =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))

const readTranslateY = (el: HTMLElement) => {
  const t = getComputedStyle(el).transform
  if (!t || t === "none") return 0
  return new DOMMatrixReadOnly(t).m42
}

export default function Sheet({
  open,
  onClose,
  title,
  closeLabel = "Close",
  children,
  className,
  "data-testid": dataTestId,
}: SheetProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [dragY, setDragY] = useState<number | null>(null)
  const drag = useRef<{ startY: number; history: { y: number; t: number }[] } | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // Mount -> next frame visible (so the enter transition runs); close -> wait, then unmount
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      setMounted(true)
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      )
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    setDragY(null)
    const id = window.setTimeout(() => setMounted(false), DRAWER_MS)
    return () => window.clearTimeout(id)
  }, [open])

  // Focus, Escape and scroll lock while open
  useEffect(() => {
    if (!mounted) return
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    panelRef.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current()
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = prevOverflow
      document.removeEventListener("keydown", onKey)
      restoreFocusRef.current?.focus?.({ preventScroll: true })
    }
  }, [mounted])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isDesktop || !panelRef.current) return
      if ((e.target as HTMLElement).closest("button, a, input")) return
      e.currentTarget.setPointerCapture(e.pointerId)
      // Interruptible: start from wherever the panel is on screen right now
      const current = readTranslateY(panelRef.current)
      drag.current = {
        startY: e.clientY - current,
        history: [{ y: current, t: performance.now() }],
      }
      setDragY(current)
    },
    [isDesktop]
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current || !panelRef.current) return
    let y = e.clientY - drag.current.startY
    if (y < 0) y = rubberband(y, panelRef.current.offsetHeight)
    const now = performance.now()
    drag.current.history = [...drag.current.history, { y, t: now }].filter(
      (p) => now - p.t < 100
    )
    setDragY(y)
  }, [])

  const onPointerUp = useCallback(() => {
    if (!drag.current || !panelRef.current) return
    const { history } = drag.current
    const first = history[0]
    const last = history[history.length - 1]
    const dt = Math.max(1, last.t - first.t)
    const velocity = ((last.y - first.y) / dt) * 1000 // px/s
    const projected = last.y + project(velocity)
    drag.current = null

    if (projected > panelRef.current.offsetHeight * 0.5) {
      onCloseRef.current()
    } else {
      setDragY(null) // snap back with the drawer curve
    }
  }, [])

  if (!mounted || typeof document === "undefined") return null

  const dragging = drag.current !== null
  const panelStyle: React.CSSProperties = isDesktop
    ? {
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.96})`,
        transition: `opacity ${FADE_MS}ms var(--ease-out), transform ${FADE_MS}ms var(--ease-out)`,
      }
    : {
        transform:
          dragY !== null
            ? `translateY(${Math.round(dragY)}px)`
            : visible
            ? "translateY(0)"
            : "translateY(100%)",
        transition: dragging ? "none" : `transform ${DRAWER_MS}ms var(--ease-drawer)`,
      }

  return createPortal(
    <div className="fixed inset-0 z-[80]" data-testid={dataTestId}>
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms var(--ease-out)`,
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={panelStyle}
        className={cx(
          "absolute flex flex-col bg-surface-raised shadow-float outline-none overflow-hidden",
          "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-card",
          "small:inset-x-auto small:bottom-auto small:left-1/2 small:top-1/2 small:w-[min(56rem,calc(100vw-4rem))] small:max-h-[85dvh] small:rounded-card",
          className
        )}
      >
        <div
          className="shrink-0 touch-none select-none small:touch-auto"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="flex justify-center pt-2 small:hidden" aria-hidden>
            <span className="h-1.5 w-10 rounded-full bg-line-strong" />
          </div>
          <div className="flex items-center justify-between gap-4 px-5 pt-3 pb-3 small:px-6 small:pt-5">
            <h2 id={titleId} className="text-headline text-ink">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:bg-brand-linen hover:text-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-safe small:px-6 small:pb-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
