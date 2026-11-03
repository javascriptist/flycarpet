import LocalizedClientLink from "@modules/common/components/localized-client-link"

/** Title + optional subtitle on the left, an optional "see all" link on the right. */
export default function SectionHeader({
  id,
  title,
  subtitle,
  linkHref,
  linkLabel,
}: {
  id?: string
  title: string
  subtitle?: string
  linkHref?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-6 small:mb-8">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-title-1 text-ink text-balance">
          {title}
        </h2>
        {subtitle && <p className="max-w-[60ch] text-callout text-ink-muted">{subtitle}</p>}
      </div>
      {linkHref && linkLabel && (
        <LocalizedClientLink
          href={linkHref}
          className="shrink-0 text-callout font-medium text-brand-accent-strong hover:underline"
        >
          {linkLabel} →
        </LocalizedClientLink>
      )}
    </div>
  )
}
