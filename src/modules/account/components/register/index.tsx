"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void,
  countryCode: string
}

const Register = ({ setCurrentView, countryCode }: Props) => {
  const isLang = countryCode === "uz"
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {isLang ? "Ro'yxatdan o'tish" : "Регистрация"}
      </h1>
      
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={ isLang ? "Ismingiz" : "Имя" }
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label={ isLang ? "Familiyangiz" : "Фамилия" }
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
            label={ isLang ? "Telefon raqamingiz" : "Телефон" }
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label={ isLang ? "Parol" : "Пароль" }
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          {isLang ? "Ro'yxatdan o'tish orqali" : "Зарегистрировавшись,"}
          {" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            {isLang ? "Maxfiylik siyosati" : "Политика конфиденциальности"}
          </LocalizedClientLink>{" "}
            {isLang ? "va" : "и"}{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            {isLang ? "Foydalanish shartlariga" : "Условия использования"}
          </LocalizedClientLink>
          { isLang ? " rozi bo'lasiz." : " вы соглашаетесь." }
        </span>
        <SubmitButton className="w-full mt-6 rounded-3xl" data-testid="register-button">
          {isLang ? "Ro'yxatdan o'tish" : "Зарегистрироваться"}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {isLang ? "Yoki" : "Или"}
        {" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          {isLang ? "kiring" : "войдите"}
        </button>
        .
      </span>
    </div>
  )
}

export default Register
