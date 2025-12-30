"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Loader2, User, Shield, Wallet, Check } from "lucide-react";
import Header from "@/components/Layout/Header";
import CompanyRegistrationModal from "@/components/Company/company-registration-modal";
import styles from "./page.module.css";

interface UserData {
  id: number;
  username: string;
  email: string;
  fullName: string;
  status: string;
  avatarUrl: string;
  roles: string[];
  balance: string;
  phone?: string;
}

export default function AccountManagementPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Backend URL - tên biến riêng để không conflict
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  
  // Get role từ session
  const role = session?.user?.roles;

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    avatar: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isJobSearching, setIsJobSearching] = useState(false);
  const [allowEmployerSearch, setAllowEmployerSearch] = useState(true);
  
  // For CompanyRegistrationModal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  
  // For Header component
  const [openClass, setOpenClass] = useState("");
  
  const handleOpen = () => setOpenClass("menu-mobile-active");
  const handleRemove = () => setOpenClass("");

  // Fetch user data on mount
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/page-signin");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Fetching user data for ID:", session?.user?.id);
      
      const response = await fetch(
        `${BACKEND_URL}/api/users/${session?.user?.id}`
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Không thể tải thông tin người dùng");
      }

      const data = await response.json();
      console.log("User data received:", data);
      
      setUserData(data);
      
      // Set form data
      setFormData({
        username: data.username || "",
        fullName: data.fullName || "",
        avatar: null,
      });
      
      // Đơn giản hóa: Dùng relative path vì đã có proxy trong next.config.js
      // Nếu backend trả /uploads/... thì giữ nguyên, Next.js sẽ proxy sang port 8080
      let avatarUrl = "";
      if (data.avatarUrl) {
        if (data.avatarUrl.startsWith('http://') || data.avatarUrl.startsWith('https://')) {
          // Nếu đã là absolute URL, chuyển về relative để dùng proxy
          avatarUrl = data.avatarUrl.replace('http://localhost:8080', '');
        } else {
          // Đã là relative path
          avatarUrl = data.avatarUrl;
        }
      }
      console.log("Final avatar path:", avatarUrl);
      setPreviewUrl(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setFormData({ ...formData, avatar: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("fullname", formData.fullName);
      
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const response = await fetch(
        `${BACKEND_URL}/api/users/${session?.user?.id}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật thông tin");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setSuccess("Cập nhật thông tin thành công!");
      
      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          fullName: updatedData.fullName,
        },
      });

      // Refresh user data
      setTimeout(() => {
        fetchUserData();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <p>{error || "Không tìm thấy thông tin người dùng"}</p>
          <button onClick={() => router.push("/")} className={styles.submitButton}>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header handleOpen={handleOpen} handleRemove={handleRemove} openClass={openClass} />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {/* Left Column - Form */}
            <div className={styles.formSection}>
            <h2 className={styles.formTitle}>Cài đặt thông tin cá nhân</h2>
            <p className={styles.formSubtitle}>(*) Các thông tin bắt buộc</p>

            {error && (
              <div className={`${styles.alert} ${styles.error}`}>
                <span className={styles.alertIcon}>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className={`${styles.alert} ${styles.success}`}>
                <span className={styles.alertIcon}>✅</span>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tên đăng nhập <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className={styles.formInput}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={`${styles.formInput} ${styles.uppercase}`}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  className={styles.formInput}
                  disabled
                  readOnly
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className={styles.submitButton}
              >
                {updating ? "Đang lưu..." : "Lưu"}
              </button>
            </form>
          </div>

          {/* Right Column - Profile Card */}
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Avatar"
                      className={styles.avatarImage}
                      style={{ width: '112px', height: '112px', objectFit: 'cover', borderRadius: '50%' }}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <User size={56} />
                    </div>
                  )}
                </div>

                <div className={styles.verifiedBadge}>VERIFIED</div>

                <label htmlFor="avatar-upload" className={styles.cameraButton}>
                  <Camera className={styles.cameraIcon} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={styles.hiddenInput}
                  />
                </label>
              </div>

              <div className={styles.userInfo}>
                <p className={styles.greeting}>Chào bạn trở lại,</p>
                <h3 className={styles.userName}>
                  {userData?.fullName || "..."}
                </h3>
                <span className={styles.verifiedStatus}>
                  Tài khoản đã xác thực
                </span>
              </div>

              {/* Chỉ hiện nút nâng cấp với role Users          {/* Toggle Section - Chỉ hiện cho Users  */}
              {role?.includes("Users") && (
                <button 
                  className={styles.upgradeButton}
                  onClick={handleOpenModal}
                >
                  <span>⬆️</span>
                  <span>Nâng cấp tài khoản</span>
                </button>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={`${styles.infoCard} ${styles.blue}`}>
                <div className={styles.infoLeft}>
                  <Shield className={`${styles.infoIcon} ${styles.blue}`} />
                  <span className={styles.infoLabel}>Vai trò:</span>
                </div>
                <span className={`${styles.infoValue} ${styles.blue}`}>
                  {userData?.roles.join(", ") || "..."}
                </span>
              </div>
  {role?.includes("Employers") && (
              <div className={`${styles.infoCard} ${styles.green}`}>

                <div className={styles.infoLeft}>
                  <Wallet className={`${styles.infoIcon} ${styles.green}`} />
                  <span className={styles.infoLabel}>Số dư:</span>
                </div>

                <span className={`${styles.infoValue} ${styles.green}`}>
                  {userData?.balance || "0"}₫
                </span>
              </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Modal đăng ký công ty */}
    <CompanyRegistrationModal 
      isOpen={openModal} 
      onClose={handleCloseModal} 
    />
    </>
  );
}
