import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { t } from '@lib/util/translations'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void,
  countryCode: string
}

const Login = ({ setCurrentView , countryCode }: Props) => {
  const isLang = countryCode === "uz"
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center p-8 rounded-3xl shadow-lg border border-gray-100"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6 text-brand-brown">
        {t({ uz: 'Xush kelibsiz', ru: 'Вас приветствует', en: 'Welcome' }, countryCode)}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t({ uz: 'Roʼyxatdan oʼting va xarid qilish tajribangizni yaxshilang.', ru: 'Зарегистрируйтесь и улучшите свой опыт покупок.', en: 'Sign up and improve your shopping experience.' }, countryCode)}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t({ uz: 'Email', ru: 'Электронная почта', en: 'Email' }, countryCode)}
            name="email"
            type="email"
            title={t({ uz: 'Emailingizni kiriting', ru: 'Электронная почта', en: 'Enter your email' }, countryCode)}
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={t({ uz: 'Parol', ru: 'Пароль', en: 'Password' }, countryCode)}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 rounded-3xl liquid-glass">
          {t({ uz: 'Kirish', ru: 'Войти', en: 'Sign in' }, countryCode)}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t({ uz: 'Yoki', ru: 'Или', en: 'Or' }, countryCode)}
        {" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline hover:text-brand-peach transition-colors"
          data-testid="register-button"
        >
          {t({ uz: 'roʼyxatdan oʼting', ru: 'Зарегистрируйтесь', en: 'register' }, countryCode)}
        </button>
        .
      </span>
    </div>
  )
}

export default Login
