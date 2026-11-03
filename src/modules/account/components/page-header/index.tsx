export default function AccountPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-title-1 text-ink">{title}</h1>
      {subtitle && <p className="max-w-[60ch] text-callout text-ink-muted">{subtitle}</p>}
    </div>
  )
}
