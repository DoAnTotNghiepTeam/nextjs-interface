"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";
import { X, Building2, MapPin, ImageIcon } from "lucide-react";
import Image from "next/image";
import "./company-registration-modal.css";
import { useSession } from "next-auth/react";

interface CompanyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  companyName: string;
  minEmployee?: number;
  maxEmployee?: number;
  email: string;
  phone: string;
  logo: string;
  banner: string;
  address: string;
  location: string;
  website: string;
  industry: string;
  description: string;
  foundedYear?: string;
  facebook?: string;
  linkedin?: string;
}

export default function CompanyRegistrationModal({
  isOpen,
  onClose,
}: CompanyRegistrationModalProps) {
  // single-step flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id || "default-user-id"; // replace with actual user ID logic

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    minEmployee: undefined,
    maxEmployee: undefined,
    email: "",
    phone: "",
    logo: "",
    banner: "",
    address: "",
    location: "",
    website: "",
    industry: "",
    description: "",
    foundedYear: "",
    facebook: "",
    linkedin: "",
  });

  const [selectedCompanySizeIdx, setSelectedCompanySizeIdx] = useState<
    number | null
  >(null);

  // company size options (min/max for backend)
  const companySizeOptions = [
    { label: "1 - 10", min: 1, max: 10 },
    { label: "11 - 50", min: 11, max: 50 },
    { label: "51 - 200", min: 51, max: 200 },
    { label: "201 - 500", min: 201, max: 500 },
    { label: "501 - 1000", min: 501, max: 1000 },
    { label: "1000+", min: 1001, max: 9999999 },
  ];

  const handleCompanySizeSelect = (idx: number) => {
    const opt = companySizeOptions[idx];
    if (!opt) return;
    setFormData((p) => ({ ...p, minEmployee: opt.min, maxEmployee: opt.max }));
    setSelectedCompanySizeIdx(idx);
  };

  // single-step validation (required fields)
  const isValid = Boolean(
    formData.companyName &&
      formData.industry &&
      formData.email &&
      formData.phone
  );

  useEffect(() => {
    // when modal closes, revoke previews
    if (!isOpen) {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    }
  }, [isOpen, logoPreview, bannerPreview]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [logoPreview, bannerPreview]);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "description") setDescriptionLength(value.length);
    if (field === "logo") setLogoPreview(value || null);
    if (field === "banner") setBannerPreview(value || null);
  };

  // Chuyển file upload thành base64 string lưu vào formData.logo và formData.banner
  const handleFileChange = async (type: "logo" | "banner", file?: File) => {
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    if (type === "logo") {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (file) {
        setLogoPreview(URL.createObjectURL(file));
        const base64 = await toBase64(file);
        setFormData((p) => ({ ...p, logo: base64 }));
      } else {
        setLogoPreview(null);
        setFormData((p) => ({ ...p, logo: "" })); // truyền chuỗi rỗng thay vì null
      }
    } else {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      if (file) {
        setBannerPreview(URL.createObjectURL(file));
        const base64 = await toBase64(file);
        setFormData((p) => ({ ...p, banner: base64 }));
      } else {
        setBannerPreview(null);
        setFormData((p) => ({ ...p, banner: "" })); // truyền chuỗi rỗng thay vì null
      }
    }
  };

  // single-step: no step navigation functions

  const handleCancel = () => {
    setFormData({
      companyName: "",
      email: "",
      phone: "",
      logo: "",
      banner: "",
      address: "",
      location: "",
      website: "",
      industry: "",
      description: "",
      foundedYear: "",
      facebook: "",
      linkedin: "",
    });
    setSelectedCompanySizeIdx(null);
    setDescriptionLength(0);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setLogoPreview(null);
    setBannerPreview(null);
    onClose();
  };

  const triggerLogoInput = () => logoInputRef.current?.click();
  const triggerBannerInput = () => bannerInputRef.current?.click();

  const onDropLogo = (file?: File) => {
    if (file) handleFileChange("logo", file);
    else handleFileChange("logo");
  };
  const onDropBanner = (file?: File) => {
    if (file) handleFileChange("banner", file);
    else handleFileChange("banner");
  };

  const removeLogo = () => handleFileChange("logo", undefined);
  const removeBanner = () => handleFileChange("banner", undefined);

  // Sửa lại handleSubmit để không ép logo/banner thành chuỗi rỗng nếu null
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      alert("Vui lòng hoàn thành đầy đủ thông tin bắt buộc trước khi gửi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new window.FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          if (k === "minEmployee" || k === "maxEmployee") return;
          if (k === "logo") payload.append("logo", v);
          else if (k === "banner") payload.append("banner", v);
          else payload.append(k, String(v));
        }
      });
      // append numeric min/max explicitly for backend
      if (formData.minEmployee !== undefined)
        payload.append("minEmployee", String(formData.minEmployee));
      if (formData.maxEmployee !== undefined)
        payload.append("maxEmployee", String(formData.maxEmployee));

      // Đảm bảo các trường address, location, website luôn có mặt
      if (!formData.address) payload.append("address", "");
      if (!formData.location) payload.append("location", "");
      if (!formData.website) payload.append("website", "");

      const response = await fetch(
        `http://localhost:8080/api/employers/${userId}/upgrade-to-employer`,
        {
          method: "POST",
          body: payload,
        }
      );

      if (response.ok) {
        alert("🎉 Gửi Đăng ký thông tin công ty thành công!");
        handleCancel();
      } else {
        const err = await response.json().catch(() => null);
        alert(`❌ Lỗi: ${err?.message || "Có lỗi xảy ra"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Có lỗi xảy ra khi gửi thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="crm-overlay">
      <div className="crm-center">
        <div className="crm-modal">
          <div className="crm-header">
            <div className="crm-header-top">
              <div className="crm-brand">
                <div className="crm-brand-icon">
                  <Building2 />
                </div>
                <div>
                  <h2 className="crm-title">Register company information</h2>
                  <p className="crm-sub">
                    Create a professional company profile on JobBox
                  </p>
                </div>
              </div>
              <button onClick={handleCancel} className="crm-close">
                <X />
              </button>
            </div>

            {/* single-step flow: no step tracker */}
          </div>

          <div className="crm-body">
            <div className="crm-preview">
              <div className="crm-preview-inner">
                <h3 className="crm-preview-title">Preview profile</h3>

                <div className="crm-banner">
                  {bannerPreview ? (
                    <Image
                      src={bannerPreview || "/placeholder.svg"}
                      alt="Banner preview"
                      fill
                      className="crm-banner-img"
                    />
                  ) : (
                    <div className="crm-banner-empty">
                      <ImageIcon />
                      <span>Banner company</span>
                    </div>
                  )}
                </div>

                <div className="crm-logo-row">
                  <div className="crm-logo">
                    {logoPreview ? (
                      <Image
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        width={160}
                        height={160}
                        className="crm-logo-img"
                      />
                    ) : (
                      <Building2 />
                    )}
                  </div>
                  <div className="crm-meta">
                    <h4 className="crm-company">
                      {formData.companyName || "Company name"}
                    </h4>
                    <p className="crm-industry">
                      {formData.industry || "Industry"}
                    </p>
                    <p className="crm-location">
                      <MapPin /> <span>{formData.location || "Location"}</span>
                    </p>
                  </div>
                </div>

                <div className="crm-note">
                  💡 Company profile will be displayed after approval by admin
                </div>
              </div>
            </div>

            <div className="crm-form-panel">
              <form onSubmit={handleSubmit} className="crm-form">
                <div className="crm-form-scroll">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm">
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          Company Information
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                          Enter company information and upload images
                        </p>
                      </div>
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          {/* left & right columns (inputs and uploads) */}
                          <div className="space-y-2">
                            <label
                              htmlFor="companyName"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Company name *
                            </label>
                            <input
                              id="companyName"
                              type="text"
                              value={formData.companyName}
                              onChange={(e) =>
                                handleInputChange("companyName", e.target.value)
                              }
                              placeholder="Enter company name"
                              required
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />
                            <label
                              htmlFor="industry"
                              className="block text-sm font-semibold text-gray-700 mt-3"
                            >
                              Industry *
                            </label>
                            <input
                              id="industry"
                              type="text"
                              value={formData.industry}
                              onChange={(e) =>
                                handleInputChange("industry", e.target.value)
                              }
                              placeholder="IT, Finance, Healthcare..."
                              required
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />
                            <label
                              htmlFor="description"
                              className="block text-sm font-semibold text-gray-700 mt-3"
                            >
                              Description
                            </label>
                            <textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) =>
                                handleInputChange("description", e.target.value)
                              }
                              placeholder="A few sentences about the company"
                              className="w-full h-20 sm:h-24 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base resize-none"
                            />
                            <div className="text-xs text-gray-500 text-right">
                              {descriptionLength} / 200 characters
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="companySize"
                              className="block text-sm font-semibold text-gray-700"
                            >
                              Company size *
                            </label>
                            <select
                              id="companySize"
                              value={
                                selectedCompanySizeIdx !== null
                                  ? selectedCompanySizeIdx
                                  : ""
                              }
                              onChange={(e) => {
                                const idx = Number(e.target.value);
                                if (!Number.isNaN(idx))
                                  handleCompanySizeSelect(idx);
                              }}
                              required
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            >
                              <option value="">Choose company size</option>
                              {companySizeOptions.map((o, i) => (
                                <option key={o.label} value={i}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                            <label
                              htmlFor="email"
                              className="block text-sm font-semibold text-gray-700 mt-3"
                            >
                              Email contract *
                            </label>
                            <input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              placeholder="contact@company.com"
                              required
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />
                            <label
                              htmlFor="phone"
                              className="block text-sm font-semibold text-gray-700 mt-3"
                            >
                              Phone number *
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              placeholder="0123 456 789"
                              required
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />
                            <label
                              htmlFor="foundedYear"
                              className="block text-sm font-semibold text-gray-700 mt-3"
                            >
                              Year Established
                            </label>
                            <input
                              id="foundedYear"
                              type="text"
                              value={formData.foundedYear}
                              onChange={(e) =>
                                handleInputChange("foundedYear", e.target.value)
                              }
                              placeholder="Enter the year the company was established"
                              className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            />

                            {/* Thêm input cho address, location, website vào form */}
                            <div className="space-y-2">
                              <label
                                htmlFor="address"
                                className="block text-sm font-semibold text-gray-700 mt-3"
                              >
                                Company address
                              </label>
                              <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                  handleInputChange("address", e.target.value)
                                }
                                placeholder="Enter company address"
                                className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                              />

                              <label
                                htmlFor="location"
                                className="block text-sm font-semibold text-gray-700 mt-3"
                              >
                                City/Province
                              </label>
                              <input
                                id="location"
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                  handleInputChange("location", e.target.value)
                                }
                                placeholder="Enter province/city"
                                className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                              />

                              <label
                                htmlFor="website"
                                className="block text-sm font-semibold text-gray-700 mt-3"
                              >
                                Company website
                              </label>
                              <input
                                id="website"
                                type="text"
                                value={formData.website}
                                onChange={(e) =>
                                  handleInputChange("website", e.target.value)
                                }
                                placeholder="https://company.com"
                                className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                              />
                            </div>

                            <div className="crm-upload-grid mt-4">
                              <div className="crm-upload-card">
                                <input
                                  ref={logoInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="crm-file-input-hidden"
                                  onChange={(e) =>
                                    onDropLogo(e.target.files?.[0])
                                  }
                                />
                                {logoPreview ? (
                                  <div className="crm-upload-preview-card">
                                    <Image
                                      src={logoPreview}
                                      alt="logo"
                                      width={120}
                                      height={120}
                                      unoptimized
                                      className="crm-upload-preview-img"
                                    />
                                    <button
                                      type="button"
                                      onClick={removeLogo}
                                      className="crm-upload-remove"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={triggerLogoInput}
                                    className="crm-upload-placeholder"
                                  >
                                    Add logo
                                  </button>
                                )}
                              </div>

                              <div className="crm-upload-card">
                                <input
                                  ref={bannerInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="crm-file-input-hidden"
                                  onChange={(e) =>
                                    onDropBanner(e.target.files?.[0])
                                  }
                                />
                                {bannerPreview ? (
                                  <div className="crm-upload-preview-card banner">
                                    <Image
                                      src={bannerPreview}
                                      alt="banner"
                                      width={360}
                                      height={120}
                                      unoptimized
                                      className="crm-upload-preview-img"
                                    />
                                    <button
                                      type="button"
                                      onClick={removeBanner}
                                      className="crm-upload-remove"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={triggerBannerInput}
                                    className="crm-upload-placeholder"
                                  >
                                    Add banner
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="crm-footer">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="crm-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`crm-btn ${
                        isValid && !isSubmitting ? "primary" : "disabled"
                      }`}
                      disabled={!isValid || isSubmitting}
                    >
                      {isSubmitting ? "Loading..." : "Register company"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
