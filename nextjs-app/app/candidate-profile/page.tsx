/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout/Layout";
import ApplicantsTable from "@/features/applicants/components/ApplicantsTable";

import { useRouter, useSearchParams } from "next/navigation";
// import "../../styles/CandidateProfile.css";
import SavedJobsList from "@/features/applicants/components/SavedJobsList";
import { CVDashboard } from "@/components/cv-dashboard";
import { CVSuccessModal } from "@/components/jobRecommend/cv-success-modal";
import type { ResumeData } from "@/components/resume-builder";
import Image from "next/image";
import styles from "../../styles/CandidateProfileTabs.module.css";
import RecommendedJobsList from "@/features/applicants/components/RecommendedJobsList";
export default function CandidateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>(
    "/assets/imgs/avatar/logoLogin.jpg"
  );

  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resume_id");

  // Modal hiển thị sau khi lưu CV
  const [showModal, setShowModal] = useState(false);

   // ---------- redirect nếu chưa login ----------
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/page-signin");
    }
  }, [status, router]);

  // Lấy resume từ URL nếu có
  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/resumes/${resumeId}`
        );
        const data = await res.json();
        setResume(data);
      } catch (err) {
        console.error("Failed to fetch resume", err);
      }
    };

    fetchResume();
  }, [resumeId]);

  useEffect(() => {
    if (searchParams.get("cv_saved") === "true") {
      setShowModal(true);
    }
  }, [searchParams]);

  // Tabs cấu hình
  const tabs = [
    { id: 1, key: "profile", label: "My CV" },
    { id: 2, key: "apply", label: "My Apply" },
    { id: 3, key: "saved", label: "Saved Jobs" },
    { id: 4, key: "recommended", label: "Recommended Jobs" },
  ];

  // Lấy tab từ URL, mặc định = profile
  const activeTab = searchParams.get("tab") || "profile";

  // Cập nhật URL khi click tab
  const handleOnClick = (tabKey: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tabKey);
    // 👇 Nếu tab là apply thì reset page = 1
    if (tabKey === "apply") {
      params.set("page", "1");
    } else {
      params.delete("page"); // tab khác thì bỏ page đi cho sạch URL
    }

    router.replace(`?${params.toString()}`);
  };

  // Xử lý tạo CV: điều hướng sang trang tạo CV trong danh sách CV
  const handleCreateNew = () => {
    router.push("/page-resume?action=create&source=candidate-profile");
  };

  // Lấy avatar trực tiếp từ backend khi session thay đổi
  useEffect(() => {
      if (!session) return; 
    const loadAvatar = async () => {
      const userId = (session as any)?.user?.id;
      const token = (session as any)?.accessToken;
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const user = await res.json();
        setAvatarSrc(
          user?.avatarUrl || user?.avatar || "/assets/imgs/avatar/logoLogin.jpg"
        );
      } catch {}
    };
    loadAvatar();
  }, [session]);

  useEffect(() => {
    const handleCustom = async () => {
      const userId = (session as any)?.user?.id;
      const token = (session as any)?.accessToken;
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const user = await res.json();
        setAvatarSrc(
          user?.avatarUrl || user?.avatar || "/assets/imgs/avatar/logoLogin.jpg"
        );
      } catch {}
    };
    window.addEventListener("avatar-updated", handleCustom as any);
    return () =>
      window.removeEventListener("avatar-updated", handleCustom as any);
  }, [session]);

  
  // ---------- fallback UI khi loading hoặc chưa login ----------
  if (status === "loading") {
    return <Layout><div className="text-center py-20">Loading...</div></Layout>;
  }

  if (!session) {
    // session chưa có nhưng hook vẫn đã gọi ở trên
    return <Layout><div className="text-center py-20">Redirecting to login...</div></Layout>;
  }

  return (
    <>
      <Layout>
        {/* Modal hiển thị khi cv_saved=true */}
        <CVSuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          resumeId={resumeId}
          resume={resume}
        />

        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-image-single">
                <Image
                  src="assets/imgs/page/candidates/img.png"
                  alt="jobbox"
                  width={1000}
                  height={300}
                  unoptimized
                />
                <a className="btn-editor" href="#" />
              </div>
              <div className="box-company-profile">
                <div className="image-compay">
                  <Image
                    src={avatarSrc}
                    alt="jobbox"
                    width={90}
                    height={100}
                    unoptimized
                    style={{
                      marginBottom: 10,
                      objectFit: "cover",
                      borderRadius: 8,
                      backgroundColor: "#f5f5f5",
                      display: "block",
                                }}
                  />
                </div>
                <div className="row mt-10">
                  <div className="col-lg-8 col-md-12">
                    <h5 className="f-18">
                      {(session as any)?.user?.fullName}{" "}
                    </h5>
                  </div>
                  <div className="col-lg-4 col-md-12 text-lg-end">
                    <button
                      className="btn btn-preview-icon btn-apply btn-apply-big"
                      onClick={handleCreateNew}
                    >
                      Create CV
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-bottom pt-10 pb-10" />
            </div>
          </section>
          <section className="section-box mt-50">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12">
                  <div className="box-nav-tabs nav-tavs-profile mb-5">
                      <ul className={styles.tabList} role="tablist">
                      {tabs.map((tab) => (
                        <li key={tab.key} className={styles.tabItem}>
                          <span
                            className={`${styles.tabButton} ${
                              activeTab === tab.key
                                ? styles.tabButtonActive
                                : ""
                            }`}
                            onClick={() => handleOnClick(tab.key)}
                          >
                            {tab.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-bottom pt-10 pb-10" />
                    
                  </div>
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12 col-12 mb-50">
                  <div className="content-single">
                    <div className="tab-content">
                      {activeTab === "profile" && <CVDashboard />}
                      {/* Apply */}
                      {activeTab === "apply" && (
                        <div className="tab-pane show active">
                          {/* <h3 className="mt-0 color-brand-1 mb-50">My Apply</h3> */}
                          <ApplicantsTable />
                        </div>
                      )}
                      {/* Saved Jobs */}
                      {activeTab === "saved" && (
                        <div className="tab-pane fade show active">
                          {/* <h3 className="mt-0 color-brand-1 mb-50">
                            Saved Jobs
                          </h3> */}
                          <SavedJobsList />
                        </div>
                      )}
                      {/* Recommended Jobs */}
                      {activeTab === "recommended" && (
                        <div className="tab-pane fade show active">
                          {/* <h3 className="mt-0 color-brand-1 mb-50">
                            Saved Jobs
                          </h3> */}
                          <RecommendedJobsList />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <Image
                      src="assets/imgs/template/newsletter-left.png"
                      alt="joxBox"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input
                          className="input-newsletter"
                          type="text"
                          placeholder="Enter your email here"
                        />
                        <button className="btn btn-default font-heading icon-send-letter">
                          Subscribe
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <Image
                      src="assets/imgs/template/newsletter-right.png"
                      alt="joxBox"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
