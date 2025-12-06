"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSession } from "next-auth/react";
import { ResumeData } from "../resume-builder";
import { fetchCandidateById } from "../../lib/candidates-api";

export function PersonalInfoStep() {
  const { data: session } = useSession();
  // Demo: fetch candidates on mount
  useEffect(() => {
    if (!session?.user?.id) return;
    fetchCandidateById(session.user.id)
      .then((data) => {
        console.log("Fetched candidates:", data);
        if (data.user.fullName) {
          setValue("personalInfo.fullName", data.user.fullName);
        }
        if (data.user.email) {
          setValue("personalInfo.email", data.user.email);
        }
      })
      .catch((err) => {
        console.error("Error fetching candidates:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ResumeData>();

  const [imagePreview, setImagePreview] = useState<string | null>(
    watch("personalInfo.profileImage") || null
  );

  const profileImage = watch("personalInfo.profileImage");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setValue("personalInfo.profileImage", base64String, {
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("personalInfo.profileImage", "", { shouldValidate: true });
  };

  return (
    <div className="d-flex flex-column gap-4 personal-info-form">
      {/* Ảnh đại diện */}
      <div className="card shadow-sm">
        <div className="card-body d-flex flex-column align-items-center text-center">
          <img
            src={profileImage || "/placeholder.svg"}
            alt="avatar"
            className="rounded-circle border mb-3"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />

          <div className="d-flex align-items-center gap-2">
            {!imagePreview && (
              <>
                <label
                  htmlFor="profile-image"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-upload me-1"></i> Upload
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </>
            )}
            {imagePreview && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={handleRemoveImage}
              >
                Delete
              </button>
            )}
          </div>

          <div className="form-text mt-2">
            Recommended: Square image, minimum size 200x200px
          </div>
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="fullName" className="form-label">
            Full name *
          </label>
          <input
            id="fullName"
            className="form-control"
            {...register("personalInfo.fullName", {
              required: "Please enter your full name",
            })}
            placeholder="Nguyen Van A"
          />
          {errors.personalInfo?.fullName && (
            <div className="text-danger small">
              {errors.personalInfo.fullName.message}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            {...register("personalInfo.email", {
              required: "Please enter your email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="example@email.com"
          />
          {errors.personalInfo?.email && (
            <div className="text-danger small">
              {errors.personalInfo.email.message}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="phone" className="form-label">
            Phone number *
          </label>
          <input
            id="phone"
            className="form-control"
            {...register("personalInfo.phone", {
              required: "Please enter your phone number",
            })}
            placeholder="0123456789"
          />
          {errors.personalInfo?.phone && (
            <div className="text-danger small">
              {errors.personalInfo.phone.message}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="jobTitle" className="form-label">
            Address *
          </label>
          <input
            id="jobTitle"
            className="form-control"
            {...register("personalInfo.jobTitle", {
              required: "Please enter your address",
            })}
            placeholder="Please enter your current address"
          />
          {errors.personalInfo?.jobTitle && (
            <div className="text-danger small">
              {errors.personalInfo.jobTitle.message}
            </div>
          )}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label htmlFor="summary" className="form-label">
          Describe yourself
        </label>
        <textarea
          id="summary"
          className="form-control"
          style={{ minHeight: 240 }}
          {...register("personalInfo.summary")}
          placeholder="Brief description of yourself, career goals..."
          rows={8}
        />
        <div className="form-text">
          Write 2-3 short sentences about your experience and goals
        </div>
      </div>

      {/* CSS inline cho placeholder nhỏ */}
      <style jsx>{`
        .personal-info-form .form-control::placeholder {
          font-size: 0.875rem; /* 14px */
          color: #6c757d;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
