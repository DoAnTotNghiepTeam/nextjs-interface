"use client";
import Link from "next/link";
import { useState } from "react";

interface SidebarProps {
  openClass: string;
}

const Sidebar = ({ openClass }: SidebarProps) => {
  const [isActive, setIsActive] = useState({
    status: false,
    key: 0,
  });

  const handleToggle = (key: number) => {
    if (isActive.key === key) {
      setIsActive({
        status: false,
        key: 0,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };

  return (
    <>
      <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}>
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li className={isActive.key == 1 ? "has-children active" : "has-children"}>
                      <span onClick={() => handleToggle(1)} className="menu-expand">
                        <i className="fi-rr-angle-small-down"></i>
                      </span>

                      <Link href="/">
                        <span className="active">Home</span>
                      </Link>

                      <ul className={isActive.key == 1 ? "sub-menu d-block" : "sub-menu d-none"}>
                        <li>
                          <Link href="/">
                            <span>Home 1</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-2">
                            <span>Home 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-3">
                            <span>Home 3</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-4">
                            <span>Home 4</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-5">
                            <span>Home 5</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-6">
                            <span>Home 6</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className={isActive.key == 2 ? "has-children active" : "has-children"}>
                      <span onClick={() => handleToggle(2)} className="menu-expand">
                        <i className="fi-rr-angle-small-down"></i>
                      </span>

                      <Link href="/jobs-grid">
                        <span>Find a Job</span>
                      </Link>

                      <ul className={isActive.key == 2 ? "sub-menu d-block" : "sub-menu d-none"}>
                        <li>
                          <Link href="/jobs-grid">
                            <span>Jobs Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/jobs-list">
                            <span>Jobs List</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details">
                            <span>Jobs Details</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details-2">
                            <span>Jobs Details 2 </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className={isActive.key == 3 ? "has-children active" : "has-children"}>
                      <span onClick={() => handleToggle(3)} className="menu-expand">
                        <i className="fi-rr-angle-small-down"></i>
                      </span>

                      <Link href="/companies-grid">
                        <span>Recruiters</span>
                      </Link>

                      <ul className={isActive.key == 3 ? "sub-menu d-block" : "sub-menu d-none"}>
                        <li>
                          <Link href="/companies-grid">
                            <span>Recruiters</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/company-details">
                            <span>Company Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className={isActive.key == 4 ? "has-children active" : "has-children"}>
                      <span onClick={() => handleToggle(4)} className="menu-expand">
                        <i className="fi-rr-angle-small-down"></i>
                      </span>

                      <Link href="/candidates-grid">
                        <span>Candidates</span>
                      </Link>

                      <ul className={isActive.key == 4 ? "sub-menu d-block" : "sub-menu d-none"}>
                        <li>
                          <Link href="/candidates-grid">
                            <span>Candidates Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/candidate-details">
                            <span>Candidate Details</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className={isActive.key == 5 ? "has-children active" : "has-children"}>
                      <span onClick={() => handleToggle(5)} className="menu-expand">
                        <i className="fi-rr-angle-small-down"></i>
                      </span>

                      <Link href="/blog-grid">
                        <span>Pages</span>
                      </Link>

                      <ul className={isActive.key == 5 ? "sub-menu d-block" : "sub-menu d-none"}>
                        <li>
                          <Link href="/page-about">
                            <span>About Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-pricing">
                            <span>Pricing Plan</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-contact">
                            <span>Contact Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-register">
                            <span>Register</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-signin">
                            <span>Signin</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-reset-password">
                            <span>Reset Password</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-content-protected">
                            <span>Content Protected</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className={isActive.key == 6 ? "has-children active" : "has-children"}>
                      <span onClick={() => handleToggle(6)} className="menu-expand">
                        <i className="fi-rr-angle-small-down"></i>
                      </span>

                      <Link href="/blog-grid">
                        <span>Blog</span>
                      </Link>

                      <ul className={isActive.key == 6 ? "sub-menu d-block" : "sub-menu d-none"}>
                        <li>
                          <Link href="/blog-grid">
                            <span>Blog Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-grid-2">
                            <span>Blog Grid 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-details">
                            <span>Blog Single</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/page-contact">
                        <span>Contact</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  <li>
                    <Link href="#">
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Work Preferences</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Go Pro</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/page-signin">
                      <span>Sign Out</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2022 © JobBox. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
