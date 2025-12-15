﻿import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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

  const [scroll, setScroll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: session } = useSession();
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
  }, [session]);

  useEffect(() => {
    const handleCustom = async (evt: CustomEvent) => {
      // Update immediately if payload is provided (base64/new url)
      if (evt?.detail) {
        const val = String(evt.detail);
        setAvatarSrc(val.startsWith("http") ? `${val}?t=${Date.now()}` : val);
        setAvatarReady(true);
        return;
      }
      // Re-fetch from backend when avatar updated elsewhere
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
      } catch { }
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

  const handleOpen2 = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
                  {/* chưa log */}
                  {!session?.user && (
                    <>
                      <li>
                        <Link href="/">
                          <span>Home</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/jobs-grid">
                          <span>Find a Job</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/companies-grid">
                          <span>Recruiters</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-about">
                          <span>About Us</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/blog-grid-2">
                          <span>Blog</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/page-contact">
                          <span>Contact</span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* log với roles user */}
                  {session?.user && role?.includes("Users") && (
                    <>
                      <li>
                        <Link href="/">
                          <span>Home</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/jobs-grid">
                          <span>Find a Job</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/companies-grid">
                          <span>Recruiters</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/candidate-profile">
                          <span>Candidates Profile</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/page-about">
                          <span>About Us</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/blog-grid-2">
                          <span>Blog</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/page-contact">
                          <span>Contact</span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* login với role  là Employer */}
                  {session?.user && role?.includes("Employers") && (
                    <>
                      <li>
                        <Link href="/">
                          <span>Home</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/jobs-grid">
                          <span> Manager Job</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/companies-grid">
                          <span>Manager Recruiters</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/page-about">
                          <span>About Us</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/blog-grid-2">
                          <span>Blog</span>
                        </Link>
                      </li>

                      <li>
                        <Link href="/page-contact">
                          <span>Contact</span>
                        </Link>
                      </li>
                    </>
                  )}

                  {/* log voi role  admin */}
                  {session?.user && role?.includes("Administrators") && (
                    <>
                      <>
                        <li>
                          <Link href="/">
                            <span>Home</span>
                          </Link>
                        </li>

                        <li>
                          <Link href="/jobs-grid">
                            <span>Find a Job</span>
                          </Link>
                        </li>

                        <li>
                          <Link href="/companies-grid">
                            <span>Recruiters</span>
                          </Link>
                        </li>

                        <li className="has-children">
                          <Link href="/candidates-grid">
                            <span>Candidates</span>
                          </Link>
                          <ul className="sub-menu">
                            <li>
                              <Link href="/page-resume">
                                <span>Create Cv</span>
                              </Link>
                            </li>
                            <li>
                              <Link href="/candidate-profile">
                                <span>Candidate Profile</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <Link href="/page-about">
                            <span>About Us</span>
                          </Link>
                        </li>

                        <li>
                          <Link href="/blog-grid-2">
                            <span>Blog</span>
                          </Link>
                        </li>

                        <li>
                          <Link href="/page-contact">
                            <span>Contact</span>
                          </Link>
                        </li>
                      </>
                    </>
                  )}
                </ul>
              </nav>
            </div>

            {/* Right side */}
            <div className="header-right" >
              <div className="block-signin" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <PreferencesForm />
                {session?.user ? (
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
                          e.preventDefault(); // không chuyển trang
                          handleOpen2();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          textDecoration: "none",
                          background: "transparent",
                          padding: "4px 8px",
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
                        <span style={{
                          fontSize: 11,
                          color: "#43a047",
                          fontWeight: 600,
                          letterSpacing: 1,
                          display: "inline"
                        }}>
                          {Number(balance).toLocaleString("vi-VN")} VNĐ
                        </span>

                      </div>
                    )}

                    {/* Modal đăng ký */}
                    <CompanyRegistrationModal
                      isOpen={openModal}
                      onClose={handleClose}
                    />

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
                        {/* CSS đơn giản cho hover và nút logout */}
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
                  <>

                    <Link href="/page-register">
                      <span className="text-link-bd-btom hover-up">
                        Register
                      </span>
                    </Link>
                    <Link href="/page-signin">
                      <span className="btn btn-default btn-shadow ml-40 hover-up">
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