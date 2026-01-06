﻿import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Settings, KeyRound, LogOut } from "lucide-react";
import CompanyRegistrationModal from "../Company/company-registration-modal";
import PreferencesForm from "../preferences/preferences_form";
import { useTranslations } from "next-intl";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const t = useTranslations();

  // --- SỬA ĐỔI 1: Lấy thêm 'status' để kiểm tra trạng thái loading ---
  const { data: session, status } = useSession();
  // ------------------------------------------------------------------

  const [scroll, setScroll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to check if menu item is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [avatarReady, setAvatarReady] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const role = session?.user?.roles;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  }, [scroll]);

  // Load avatar from backend when session changes
  useEffect(() => {
    // Chỉ chạy khi đã xác thực xong để tránh gọi API lỗi
    if (status !== "authenticated") return;

    const loadUserInfo = async () => {
      const userId = (session as any)?.user?.id;
      const token = (session as any)?.accessToken;
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const user = await res.json();
        const url =
          user?.avatarUrl ||
          user?.avatar ||
          "/assets/imgs/avatar/logoLogin.jpg";
        setAvatarSrc(url);
        setAvatarReady(true);
        setBalance(user?.balance || "0");
      } catch {
        setAvatarSrc("/assets/imgs/avatar/logoLogin.jpg");
        setAvatarReady(true);
        setBalance("0");
      }
    };
    loadUserInfo();
  }, [session, status]); // Thêm status vào dependency

  useEffect(() => {
    const handleCustom = async (evt: CustomEvent) => {
      if (evt?.detail) {
        const val = String(evt.detail);
        setAvatarSrc(val.startsWith("http") ? `${val}?t=${Date.now()}` : val);
        setAvatarReady(true);
        return;
      }
      const userId = (session as any)?.user?.id;
      const token = (session as any)?.accessToken;
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const user = await res.json();
        const url = user?.avatarUrl || user?.avatar;
        setAvatarSrc(
          url ? `${url}?t=${Date.now()}` : "/assets/imgs/avatar/logoLogin.jpg"
        );
        setAvatarReady(true);
        setBalance(user?.balance || "0");
      } catch {}
    };
    window.addEventListener("avatar-updated", handleCustom as any);
    return () => {
      window.removeEventListener("avatar-updated", handleCustom as any);
    };
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const [openModal, setOpenModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const handleOpen2 = async () => {
    const userId = (session as any)?.user?.id;
    const token = (session as any)?.accessToken;
    
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}/is-pending`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const isPending = await res.json();
      
      if (isPending === true) {
        setShowPendingModal(true);
      } else {
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error checking pending status:", error);
      setOpenModal(true); // Mặc định mở form đăng ký nếu có lỗi
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setShowPendingModal(false);
  };

  return (
    <>
      <header
        className={scroll ? "header sticky-bar stick" : "header sticky-bar"}
      >
        <div className="container">
          <div className="main-header">
            {/* Logo */}
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex">
                    <img
                      alt="jobBox"
                      src="/assets/imgs/template/jobhub-logo.svg"
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* Menu */}
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  
                  {/* --- SỬA ĐỔI 2: Dùng check status thay vì !session.user --- */}
                  {/* Menu cho khách (chưa login) - Chỉ hiện khi chắc chắn là unauthenticated */}
                  {status === "unauthenticated" && (
                    <>
                      <li className={isActive("/") ? "active" : ""}>
                        <Link href="/">
                          <span style={isActive("/") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Home</span>
                        </Link>
                      </li>
                      <li className={isActive("/jobs-grid") ? "active" : ""}>
                        <Link href="/jobs-grid">
                          <span style={isActive("/jobs-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Find a Job</span>
                        </Link>
                      </li>
                      <li className={isActive("/companies-grid") ? "active" : ""}>
                        <Link href="/companies-grid">
                          <span style={isActive("/companies-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Recruiters</span>
                        </Link>
                      </li>
                      <li className={isActive("/page-about") ? "active" : ""}>
                        <Link href="/page-about">
                          <span style={isActive("/page-about") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>About Us</span>
                        </Link>
                      </li>
                      <li className={isActive("/blog-grid-2") ? "active" : ""}>
                        <Link href="/blog-grid-2">
                          <span style={isActive("/blog-grid-2") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Blog</span>
                        </Link>
                      </li>
                      <li className={isActive("/page-contact") ? "active" : ""}>
                        <Link href="/page-contact">
                          <span style={isActive("/page-contact") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Contact</span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* log với roles user */}
                  {status === "authenticated" && session?.user && role?.includes("Users") && (
                    <>
                      <li className={isActive("/") ? "active" : ""}>
                        <Link href="/">
                          <span style={isActive("/") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Home</span>
                        </Link>
                      </li>
                      <li className={isActive("/jobs-grid") ? "active" : ""}>
                        <Link href="/jobs-grid">
                          <span style={isActive("/jobs-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Find a Job</span>
                        </Link>
                      </li>
                      <li className={isActive("/companies-grid") ? "active" : ""}>
                        <Link href="/companies-grid">
                          <span style={isActive("/companies-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Recruiters</span>
                        </Link>
                      </li>
                      <li className={isActive("/candidate-profile") ? "active" : ""}>
                        <Link href="/candidate-profile">
                          <span style={isActive("/candidate-profile") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Candidates Profile</span>
                        </Link>
                      </li>
                      <li className={isActive("/page-about") ? "active" : ""}>
                        <Link href="/page-about">
                          <span style={isActive("/page-about") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>About Us</span>
                        </Link>
                      </li>
                      <li className={isActive("/blog-grid-2") ? "active" : ""}>
                        <Link href="/blog-grid-2">
                          <span style={isActive("/blog-grid-2") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Blog</span>
                        </Link>
                      </li>
                      <li className={isActive("/page-contact") ? "active" : ""}>
                        <Link href="/page-contact">
                          <span style={isActive("/page-contact") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Contact</span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* login với role là Employer */}
                  {status === "authenticated" && session?.user && role?.includes("Employers") && (
                    <>
                      <li className={isActive("/") ? "active" : ""}>
                        <Link href="/">
                          <span style={isActive("/") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Home</span>
                        </Link>
                      </li>
                      <li className={isActive("/jobs-grid") ? "active" : ""}>
                        <Link href="/jobs-grid">
                          <span style={isActive("/jobs-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}> Manager Job</span>
                        </Link>
                      </li>
                      <li className={isActive("/companies-grid") ? "active" : ""}>
                        <Link href="/companies-grid">
                          <span style={isActive("/companies-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Manager Recruiters</span>
                        </Link>
                      </li>
                      <li className={isActive("/page-about") ? "active" : ""}>
                        <Link href="/page-about">
                          <span style={isActive("/page-about") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>About Us</span>
                        </Link>
                      </li>
                      <li className={isActive("/blog-grid-2") ? "active" : ""}>
                        <Link href="/blog-grid-2">
                          <span style={isActive("/blog-grid-2") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Blog</span>
                        </Link>
                      </li>
                      <li className={isActive("/page-contact") ? "active" : ""}>
                        <Link href="/page-contact">
                          <span style={isActive("/page-contact") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Contact</span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* log voi role admin */}
                  {status === "authenticated" && session?.user && role?.includes("Administrators") && (
                    <>
                      <>
                        <li className={isActive("/") ? "active" : ""}>
                          <Link href="/">
                            <span style={isActive("/") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Home</span>
                          </Link>
                        </li>
                        <li className={isActive("/jobs-grid") ? "active" : ""}>
                          <Link href="/jobs-grid">
                            <span style={isActive("/jobs-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Find a Job</span>
                          </Link>
                        </li>
                        <li className={isActive("/companies-grid") ? "active" : ""}>
                          <Link href="/companies-grid">
                            <span style={isActive("/companies-grid") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Recruiters</span>
                          </Link>
                        </li>
                        <li className={`has-children ${isActive("/candidates-grid") || isActive("/page-resume") || isActive("/candidate-profile") ? "active" : ""}`}>
                          <Link href="/candidates-grid">
                            <span style={isActive("/candidates-grid") || isActive("/page-resume") || isActive("/candidate-profile") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Candidates</span>
                          </Link>
                          <ul className="sub-menu">
                            <li className={isActive("/page-resume") ? "active" : ""}>
                              <Link href="/page-resume">
                                <span style={isActive("/page-resume") ? { color: '#3C65F5' } : {}}>Create Cv</span>
                              </Link>
                            </li>
                            <li className={isActive("/candidate-profile") ? "active" : ""}>
                              <Link href="/candidate-profile">
                                <span style={isActive("/candidate-profile") ? { color: '#3C65F5' } : {}}>Candidate Profile</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className={isActive("/page-about") ? "active" : ""}>
                          <Link href="/page-about">
                            <span style={isActive("/page-about") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>About Us</span>
                          </Link>
                        </li>
                        <li className={isActive("/blog-grid-2") ? "active" : ""}>
                          <Link href="/blog-grid-2">
                            <span style={isActive("/blog-grid-2") || isActive("/blog-details") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Blog</span>
                          </Link>
                        </li>
                        <li className={isActive("/page-contact") ? "active" : ""}>
                          <Link href="/page-contact">
                            <span style={isActive("/page-contact") ? { color: '#3C65F5', borderBottom: '2px solid #3C65F5', paddingBottom: '2px' } : {}}>Contact</span>
                          </Link>
                        </li>
                      </>
                    </>
                  )}
                </ul>
              </nav>
            </div>

            {/* Right side */}
            <div className="header-right">
              <div
                className="block-signin"
                style={{ display: "flex", alignItems: "center" }}
              >
                <PreferencesForm />
                
                {/* --- SỬA ĐỔI 3: Xử lý 3 trạng thái: Loading, Authenticated, Unauthenticated --- */}
                
                {/* 1. Đang Loading: Ẩn hoặc hiện khung trống để không bị giật */}
                {status === "loading" ? (
                    <div style={{ width: 50, height: 50 }}></div> // Giữ chỗ tránh nhảy layout
                ) : 
                
                /* 2. Đã Login: Hiện Avatar và Menu User */
                status === "authenticated" && session?.user ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                    ref={dropdownRef}
                  >
                    {/* Avatar user */}
                    <img
                      src={
                        avatarReady
                          ? avatarSrc
                          : "/assets/imgs/avatar/logoLogin.jpg"
                      }
                      alt="Avatar"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        background: "#eee",
                        border: "2px solid #e0e0e0",
                      }}
                      onClick={() => setDropdownOpen((v) => !v)}
                    />
                    {session?.user && role?.includes("Users") && (
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpen2();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          textDecoration: "none",
                          background: "transparent",
                          padding: "4px 8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div style={{ lineHeight: 1.2 }}>
                          <div style={{ fontSize: 13, color: "#888" }}>
                            Are you an employer?
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "blue",
                            }}
                          >
                            Post a job now »
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Hiển thị tên nếu là Employers */}
                    {session?.user && role?.includes("Employers") && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 180,
                          padding: "8px 16px",
                          background: "rgba(245,248,255,0.7)",
                          borderRadius: 16,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                          marginLeft: 16,
                          marginRight: 50,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#1976d2",
                            marginBottom: 2,
                          }}
                        >
                          Hi, {session.user.username}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#43a047",
                            fontWeight: 600,
                            letterSpacing: 1,
                            display: "inline",
                          }}
                        >
                          {Number(balance).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    )}

                    {/* Modal đăng ký */}
                    <CompanyRegistrationModal
                      isOpen={openModal}
                      onClose={handleClose}
                    />

                    {/* Modal thông báo pending */}
                    {showPendingModal && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 9999,
                        }}
                        onClick={handleClose}
                      >
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: 32,
                            maxWidth: 480,
                            width: "90%",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "#fff3cd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                                fontSize: 32,
                              }}
                            >
                              ⏳
                            </div>
                            <h3
                              style={{
                                fontSize: 22,
                                fontWeight: 600,
                                marginBottom: 12,
                                color: "#333",
                              }}
                            >
                              Application Under Review
                            </h3>
                            <p
                              style={{
                                fontSize: 16,
                                color: "#666",
                                lineHeight: 1.6,
                                marginBottom: 24,
                              }}
                            >
                              Your employer registration is currently being reviewed by our team. You will be notified once the review process is complete.
                            </p>
                            <button
                              onClick={handleClose}
                              style={{
                                background: "#3C65F5",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "12px 32px",
                                fontSize: 16,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "background 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#2451D9")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "#3C65F5")
                              }
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "110%",
                          minWidth: 360,
                          background: "#fff",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          zIndex: 100,
                          padding: 24,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 18,
                          }}
                        >
                          <img
                            src={
                              avatarReady
                                ? avatarSrc
                                : "/assets/imgs/avatar/logoLogin.jpg"
                            }
                            alt="Avatar"
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              objectFit: "cover",
                              background: "#eee",
                              border: "2px solid #e0e0e0",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 17,
                                marginBottom: 2,
                              }}
                            >
                              {session.user.fullName ||
                                session.user.username ||
                                session.user.email}
                            </div>
                            <div style={{ fontSize: 14, color: "#888" }}>
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid #f0f0f0",
                            marginBottom: 12,
                          }}
                        />
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          <li>
                            <Link href="/page-account">
                              <span
                                className="dropdown-link"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 0",
                                  color: "#333",
                                  fontWeight: 500,
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  transition: "background 0.2s, color 0.2s",
                                }}
                              >
                                <Settings size={18} />
                                <span>Account Management</span>
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/page-reset-password">
                              <span
                                className="dropdown-link"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 0",
                                  color: "#333",
                                  fontWeight: 500,
                                  borderRadius: 8,
                                  cursor: "pointer",
                                  transition: "background 0.2s, color 0.2s",
                                }}
                              >
                                <KeyRound size={18} />
                                <span>Reset Password</span>
                              </span>
                            </Link>
                          </li>
                        </ul>
                        <button
                          className="btn-logout w-100"
                          style={{
                            marginTop: 18,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            background: "#ff4d4f",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 16,
                            padding: "10px 0",
                            cursor: "pointer",
                          }}
                          onClick={handleLogout}
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                        <style>{`
                          .dropdown-link:hover {
                            background: #e6f0fa;
                            color: #1976d2;
                          }
                          .btn-logout:hover {
                            background: #d32f2f;
                          }
                        `}</style>
                      </div>
                    )}
                  </div>
                ) : (
                  
                  /* 3. Chưa Login (và không loading): Hiện nút Register/Sign in */
                  <>
                    <Link href="/page-register">
                      <span className="hover-up" style={{ textDecoration: "none" }}>
                        Register
                      </span>
                    </Link>
                    <Link href="/page-signin">
                      <span className="btn btn-default btn-shadow ml-40 hover-up" style={{ whiteSpace: "nowrap" }}>
                        Sign in
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;