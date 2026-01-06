"use client";
import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import BackToTop from "../elements/BackToTop";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MultiChatWidget, { MultiChatHandle } from "../MultiChatWidget";
import JobChatBot from "../../app/ChatBotJob/page";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [openClass, setOpenClass] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatWidgetRef = useRef<MultiChatHandle>(null);
  const { data: session } = useSession();

  const handleOpen = () => {
    document.body.classList.add("mobile-menu-active");
    setOpenClass("sidebar-visible");
  };

  const handleRemove = () => {
    if (openClass === "sidebar-visible") {
      setOpenClass("");
      document.body.classList.remove("mobile-menu-active");
    }
  };
  
  // Kiểm tra xem có nên hiển thị chat widget không (chỉ cho Users role)
  const shouldShowChat = session?.user?.id && 
    (Array.isArray(session?.user?.roles) 
      ? session.user.roles.includes("Users")
      : session?.user?.roles === "Users");
      
  return (
    <>
      <div className="body-overlay-1" onClick={handleRemove} />
      <Header handleOpen={handleOpen} handleRemove={handleRemove} openClass={openClass} />
      <Sidebar openClass={openClass} />
      <main className="main">{children}</main>
      <Footer />
      <BackToTop />
      
      {/* Chat widgets - hiển thị trên tất cả các trang */}
      {shouldShowChat && (
        <MultiChatWidget 
          ref={chatWidgetRef}
          applicantId={session.user.id}
          applicantName={session?.user?.fullName ?? session?.user?.name ?? undefined}
          iconBottomOffset={160}
          popupBottomOffset={40}
          hideIcon={isChatOpen}
        />
      )}
      <JobChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
};

export default Layout;
