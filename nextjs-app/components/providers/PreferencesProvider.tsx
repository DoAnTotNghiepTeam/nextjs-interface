"use client";

import { useRouter } from "next/navigation"; // <--- QUAN TRỌNG: Import từ next/navigation
import {
  Language,
  PreferencesContext,
  Theme,
} from "../../lib/contexts/PreferenceContext"; // Sửa đường dẫn import cho đúng với project của bạn
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter(); // <--- Khởi tạo router
  const storedTheme = useTheme();
  
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>(
    (storedTheme.theme as Theme) || "system"
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // --- HÀM XỬ LÝ CHÍNH ---
  const setLanguage = async (newLang: Language) => {
    if (newLang === language) return;

    // 1. Cập nhật state nội bộ ngay lập tức để UI (như lá cờ) đổi ngay
    setLanguageState(newLang);

    try {
      // 2. Gọi API để set cookie phía server
      await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: newLang }),
      });

      // 3. Refresh mềm: Yêu cầu server render lại nội dung mới
      // Trình duyệt KHÔNG load lại hoàn toàn, user không thấy bị chớp trang
      router.refresh();
      
    } catch (error) {
      console.error("Failed to update locale:", error);
      // Nếu lỗi thì có thể revert state lại ngôn ngữ cũ nếu muốn
    }
  };

  const value = {
    language,
    theme,
    setLanguage, // Truyền hàm setLanguage đã sửa xuống dưới
    setTheme,
  };

  // --- CÁC USE EFFECT KHỞI TẠO ---

  // 1. Load ngôn ngữ từ cookie khi F5 hoặc vào trang lần đầu
  useEffect(() => {
    async function initializeLanguage() {
      try {
        const response = await fetch("/api/preferences");
        const data = await response.json();
        if (data.locale) {
          setLanguageState(data.locale as Language);
        }
      } catch {
        setLanguageState("en");
      } finally {
        setIsInitialized(true);
      }
    }

    initializeLanguage();
  }, []);

  // 2. Đồng bộ theme
  useEffect(() => {
    storedTheme.setTheme(theme);
  }, [theme, storedTheme]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;