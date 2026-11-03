"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { t } from "@lib/util/translations"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void,
  countryCode: string
}

const Register = ({ setCurrentView, countryCode }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center rounded-card bg-surface-raised p-6 shadow-card small:p-8"
      data-testid="register-page"
    >
      <h1 className="mb-6 text-title-2 text-ink">
        {t({ uz: "Ro\u02bcyxatdan o\u02bctish", ru: "Регистрация", en: "Sign Up" }, countryCode)}
      </h1>
      
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t({ uz: "Ismingiz", ru: "Имя", en: "First Name" }, countryCode)}
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label={t({ uz: "Familiyangiz", ru: "Фамилия", en: "Last Name" }, countryCode)}
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label={t({ uz: "Telefon raqamingiz", ru: "Телефон", en: "Phone Number" }, countryCode)}
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label={t({ uz: "Parol", ru: "Пароль", en: "Password" }, countryCode)}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <SubmitButton className="mt-6 small:w-full" data-testid="register-button">
          {t({ uz: "Ro\u02bcyxatdan o\u02bctish", ru: "Зарегистрироваться", en: "Sign Up" }, countryCode)}
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-callout text-ink-muted">
        {t({ uz: "Yoki", ru: "Или", en: "Or" }, countryCode)}
        {" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="no-press font-medium text-brand-accent-strong hover:underline"
        >
          {t({ uz: "kiring", ru: "войдите", en: "sign in" }, countryCode)}
        </button>
        .
      </span>
    </div>
  )
}

export default Register
