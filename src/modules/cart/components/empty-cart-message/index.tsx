import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { t } from "@lib/util/translations"

const EmptyCartMessage = ({ countryCode }: { countryCode?: string }) => {
  return (
    <div
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 py-16 text-center"
      data-testid="empty-cart-message"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-linen text-ink-muted" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7h12l-1 13H7L6 7Z" />
          <path d="M9 7V5a3 3 0 0 1 6 0v2" />
        </svg>
      </span>
      <h1 className="text-title-2 text-ink">
        {t({ uz: "Savatcha boʼsh", ru: "Корзина пуста", en: "Your cart is empty" }, countryCode)}
      </h1>
      <p className="max-w-sm text-callout text-ink-muted">
        {t(
          {
            uz: "Gilamlar katalogini koʼrib chiqing va yoqqanini savatchaga qoʼshing.",
            ru: "Загляните в каталог и добавьте понравившийся ковёр.",
            en: "Browse the catalogue and add a rug you love.",
          },
          countryCode
        )}
      </p>
      <LocalizedClientLink href="/store" className="btn-primary mt-2">
        {t({ uz: "Katalogga oʼtish", ru: "Перейти в каталог", en: "Browse rugs" }, countryCode)}
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
