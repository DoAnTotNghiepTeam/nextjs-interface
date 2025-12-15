
import "@/public/assets/css/style.css";
import "@/styles/globals.css";
import { NextAuthProvider } from "@/components/providers/authProviders";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import PreferencesProvider from "@/components/providers/PreferencesProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobbox - Job Portal HTML Template",
  description: "Jobbox - Job Portal HTML Template",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Job Search App</title>
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
          integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
          crossOrigin="anonymous" referrerPolicy="no-referrer" />
        {/* Boxicons */}
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className={`${plusJakartaSans.className}`}>
        <NextIntlClientProvider>
          <PreferencesProvider>

            <NextAuthProvider>
              {children}
            </NextAuthProvider>
          </PreferencesProvider>
        </NextIntlClientProvider>

        <ToastContainer position="top-right" autoClose={4000} />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
