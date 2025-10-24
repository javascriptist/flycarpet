import { Heading } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = ({ countryCode }: { countryCode?: string }) => {
  const isLang = countryCode === "uz"
  
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h2"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {isLang ? "Savatcha" : "Корзина"}
      </Heading>
      <p className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {isLang 
          ? "Savatchada hech narsa yo'q. Keling, buni o'zgartiramiz, mahsulotlarni ko'rishni boshlash uchun quyidagi havoladan foydalaning."
          : "В вашей корзине ничего нет. Давайте это изменим, используйте ссылку ниже, чтобы начать просмотр наших товаров."
        }
      </p>
      <div>
        <InteractiveLink href="/store">
          {isLang ? "Mahsulotlarni ko'rish" : "Посмотреть товары"}
        </InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
