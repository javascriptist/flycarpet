import { Heading } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import { t } from '@lib/util/translations'

const EmptyCartMessage = ({ countryCode }: { countryCode?: string }) => {
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h2"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {t({ uz: 'Savatcha', ru: 'Корзина', en: 'Cart' }, countryCode)}
      </Heading>
      <p className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {t({ uz: 'Savatchada hech narsa yo\u02bcq. Keling, buni o\u02bczgartiramiz, mahsulotlarni ko\u02bcrishni boshlash uchun quyidagi havoladan foydalaning.', ru: 'В вашей корзине ничего нет. Давайте это изменим, используйте ссылку ниже, чтобы начать просмотр наших товаров.', en: 'Your cart is empty. Let\'s change that, use the link below to start browsing our products.' }, countryCode)}
      </p>
      <div>
        <InteractiveLink href="/store">
          {t({ uz: 'Mahsulotlarni ko\u02bcrish', ru: 'Посмотреть товары', en: 'View products' }, countryCode)}
        </InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
