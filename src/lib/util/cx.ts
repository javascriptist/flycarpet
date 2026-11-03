/**
 * Join class names. Unlike `clx` from @medusajs/ui (tailwind-merge), this
 * doesn't treat our custom font-size tokens (text-title-2, text-callout…)
 * as conflicting with colour classes (text-ink…) and silently drop them.
 */
export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")
