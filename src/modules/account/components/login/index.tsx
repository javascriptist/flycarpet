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
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center rounded-card bg-surface-raised p-6 shadow-card small:p-8"
      data-testid="login-page"
    >
      <h1 className="mb-2 text-title-2 text-ink">
        {t({ uz: 'Xush kelibsiz', ru: 'Добро пожаловать', en: 'Welcome back' }, countryCode)}
      </h1>
      <p className="mb-6 text-center text-callout text-ink-muted">
        {t({ uz: 'Buyurtmalaringizni ko\u02bcrish va tezroq rasmiylashtirish uchun kiring.', ru: 'Войдите, чтобы видеть заказы и оформлять быстрее.', en: 'Sign in to see your orders and check out faster.' }, countryCode)}
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
        <SubmitButton data-testid="sign-in-button" className="mt-6 small:w-full">
          {t({ uz: 'Kirish', ru: 'Войти', en: 'Sign in' }, countryCode)}
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-callout text-ink-muted">
        {t({ uz: 'Yoki', ru: 'Или', en: 'Or' }, countryCode)}
        {" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="no-press font-medium text-brand-accent-strong hover:underline"
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
