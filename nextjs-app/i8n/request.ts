import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "vi", "ko", "jp"];

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale,
  };
});