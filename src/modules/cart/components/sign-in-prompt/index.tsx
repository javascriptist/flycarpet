import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { t } from "@lib/util/translations"

const SignInPrompt = ({ countryCode }: { countryCode: string }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-card bg-brand-linen px-5 py-4">
      <p className="text-callout text-ink-muted">
        {t(
          {
            uz: "Hisobingiz bormi? Tezroq rasmiylashtirish uchun kiring.",
            ru: "Есть аккаунт? Войдите, чтобы оформить быстрее.",
            en: "Have an account? Sign in for a faster checkout.",
          },
          countryCode
        )}
      </p>
      <LocalizedClientLink
        href="/account"
        className="shrink-0 text-callout font-medium text-brand-accent-strong hover:underline"
        data-testid="sign-in-button"
      >
        {t({ uz: "Kirish", ru: "Войти", en: "Sign in" }, countryCode)}
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
