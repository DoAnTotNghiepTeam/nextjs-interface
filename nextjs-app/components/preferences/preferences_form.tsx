"use client";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectLabel,
} from "@/components/ui/select";
import {
  Language,
  Theme,
  usePreferences,
} from "@/lib/contexts/PreferenceContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type PreferencesFormValues = {
  language: Language;
  theme: Theme;
};

const PreferencesForm = ({ noLabel }: { noLabel?: boolean }) => {
  const pref = usePreferences();
  const themes = useTheme();

  const form = useForm<PreferencesFormValues>({
    defaultValues: {
      language: pref.language || "en",
      theme: themes.theme as Theme || "system",
    },
  });

  useEffect(() => {
    form.setValue("language", pref.language);
  }, [pref.language]);

  const t = useTranslations();

  return (
    <Form {...form}>
      <div className="flex flex-col lg:flex-row gap-2">
        <FormField
          name="language"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Select
                {...field}
                onValueChange={(value: Language) => {
                  form.setValue("language", value);
                  if (pref.setLanguage) {
                    pref.setLanguage(value);
                  }
                }}
              >

                {/* cấu hình cho lá cỡ chuyển đổi ngôn ngữ */}
                <SelectTrigger style={{ 
                  border: "none", 
                  boxShadow: "none", 
                  background: "none", 
                  padding: "6px", 
                  fontWeight: 500, 
                  fontSize: 16,
                  width: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  objectFit: "cover",
                  marginRight : 20,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {pref.language && (
                      <img
                        src={
                          pref.language === "en"
                            ? "assets/imgs/page/homepage1/en.jpg"
                            : pref.language === "vi"
                            ? "assets/imgs/page/homepage1/vi.jpg"
                            : pref.language === "ko"
                            ? "assets/imgs/page/homepage1/ko.png"
                            : ""
                        }
                        alt={pref.language}
                      />
                    )}
                  </div>
                </SelectTrigger>
                {/*điều chỉnh các ngôn ngữ trong khung chọn chuyển qua các ngôn ngữ khác */}
                <SelectContent style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "none", background: "#f8f9fa", minWidth: 140, zIndex: 9999,padding: 0 , marginTop : 10}}>
                 {/* end điều chỉnh */}
                  <SelectGroup>
                    <SelectItem
                      value="en"
                      style={{
                        background: field.value === "en" ? "#e6f0fa" : "transparent",
                        borderRadius: 6,
                        padding: "8px 12px",
                        margin: 2,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img src="assets/imgs/page/homepage1/en.jpg" alt="English" style={{ width: 22, height: 16, objectFit: "cover" }} />
                        {t('component_Preferences.eng')}
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="vi"
                      style={{
                        background: field.value === "vi" ? "#e6f0fa" : "transparent",
                        borderRadius: 6,
                        padding: "8px 12px",
                        margin: 2,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img src="assets/imgs/page/homepage1/vi.jpg" alt="Vietnamese" style={{ width: 22, height: 16, objectFit: "cover" }} />
                        {t('component_Preferences.vie')}
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="ko"
                      style={{
                        background: field.value === "ko" ? "#e6f0fa" : "transparent",
                        borderRadius: 6,
                        padding: "8px 12px",
                        margin: 2,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img src="assets/imgs/page/homepage1/ko.png" alt="Korean" style={{ width: 22, height: 16, objectFit: "cover" }} />
                        {t('component_Preferences.ko')}
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default PreferencesForm;