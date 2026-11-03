import { getLang } from "./translations"

/**
 * Translations for the generic form labels and buttons inherited from the
 * Medusa starter ("First name", "Postal code", "Edit"…). Shared components
 * (Input, AccountInfo) pass their English label through `tUi` so every
 * form is translated without touching each call site. Unknown strings are
 * returned unchanged.
 */
const UI: Record<string, { uz: string; ru: string }> = {
  "First name": { uz: "Ism", ru: "Имя" },
  "Last name": { uz: "Familiya", ru: "Фамилия" },
  Name: { uz: "Ism", ru: "Имя" },
  Company: { uz: "Kompaniya", ru: "Компания" },
  Address: { uz: "Manzil", ru: "Адрес" },
  "Apartment, suite, etc.": { uz: "Xonadon, ofis va h.k.", ru: "Квартира, офис и т.д." },
  "Postal code": { uz: "Pochta indeksi", ru: "Почтовый индекс" },
  City: { uz: "Shahar", ru: "Город" },
  Province: { uz: "Viloyat", ru: "Область" },
  "Province / State": { uz: "Viloyat", ru: "Область" },
  Phone: { uz: "Telefon", ru: "Телефон" },
  Email: { uz: "Email", ru: "Эл. почта" },
  Password: { uz: "Parol", ru: "Пароль" },
  Country: { uz: "Mamlakat", ru: "Страна" },
  "Billing address": { uz: "Hisob-kitob manzili", ru: "Платёжный адрес" },
  "No billing address": { uz: "Hisob-kitob manzili yoʼq", ru: "Платёжный адрес не указан" },
  Edit: { uz: "Tahrirlash", ru: "Изменить" },
  Cancel: { uz: "Bekor qilish", ru: "Отмена" },
  "Save changes": { uz: "Saqlash", ru: "Сохранить" },
  Save: { uz: "Saqlash", ru: "Сохранить" },
  "New address": { uz: "Yangi manzil", ru: "Новый адрес" },
  "Add address": { uz: "Manzil qoʼshish", ru: "Добавить адрес" },
  "Edit address": { uz: "Manzilni tahrirlash", ru: "Изменить адрес" },
  Remove: { uz: "Oʼchirish", ru: "Удалить" },
  Default: { uz: "Asosiy", ru: "Основной" },
  "updated succesfully": { uz: "yangilandi", ru: "обновлено" },
}

export const tUi = (text: string, countryCode?: string): string => {
  const lang = getLang(countryCode)
  if (lang === "en") return text
  return UI[text]?.[lang] ?? text
}
