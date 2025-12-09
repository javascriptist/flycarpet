import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { t } from '@lib/util/translations'

const SignInPrompt = (
  props: {
    countryCode: string
  }
) => {
  const { countryCode } = props
  const isLang = countryCode === "uz"
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {t({ uz: 'Ro\u02bcyxatdan o\u02bcting', ru: 'Зарегистрируйтесь', en: 'Register' }, countryCode)}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {t({ uz: 'Savatchangizni davom ettirish uchun iltimos, hisobingizga kiring.', ru: 'Пожалуйста, войдите в свою учетную запись, чтобы продолжить покупки.', en: 'Please sign in to your account to continue shopping.' }, countryCode)}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10 bg-transparent rounded-3xl py-4 px-8 text-md border-2 border-brand-peach text-brand-peach hover:bg-brand-peach hover:text-white transition-colors"
           data-testid="sign-in-button">
            {t({ uz: 'Kirish', ru: 'Войти', en: 'Sign in' }, countryCode)}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
