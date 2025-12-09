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
      className="max-w-sm flex flex-col items-center p-8 rounded-3xl shadow-lg border border-gray-100"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6 text-brand-brown">
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
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          {t({ uz: "Ro\u02bcyxatdan o\u02bctish orqali", ru: "Зарегистрировавшись,", en: "By signing up, you agree to our" }, countryCode)}
          {" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            {t({ uz: "Maxfiylik siyosati", ru: "Политика конфиденциальности", en: "Privacy Policy" }, countryCode)}
          </LocalizedClientLink>{" "}
          {t({ uz: "va", ru: "и", en: "and" }, countryCode)}{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            {t({ uz: "Foydalanish shartlariga", ru: "Условия использования", en: "Terms of Use" }, countryCode)}
          </LocalizedClientLink>
          {t({ uz: " rozi bo\u02bcasiz.", ru: " вы соглашаетесь.", en: "." }, countryCode)}
        </span>
        <SubmitButton className="w-full mt-6 rounded-3xl liquid-glass" data-testid="register-button">
          {t({ uz: "Ro\u02bcyxatdan o\u02bctish", ru: "Зарегистрироваться", en: "Sign Up" }, countryCode)}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t({ uz: "Yoki", ru: "Или", en: "Or" }, countryCode)}
        {" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline hover:text-brand-peach transition-colors"
        >
          {t({ uz: "kiring", ru: "войдите", en: "sign in" }, countryCode)}
        </button>
        .
      </span>
    </div>
  )
}

export default Register
