import type React from "react";

import "./globals.css";

// export default function RootLayout({
export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="resume-layout">{children}</div>;
}
