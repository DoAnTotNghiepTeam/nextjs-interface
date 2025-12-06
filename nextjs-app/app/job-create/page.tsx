"use client";

import Layout from "@/components/Layout/Layout";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

const initialState = {
  title: "",
  description: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "",
  category: "",
  requiredSkills: "",
  minExperience: "",
  requiredDegree: "",
  endAt: "",
  status: "active",
  postType: "normal", // default
};

export default function JobCreate() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy token và employerId từ session
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const employerId = session?.user?.id;

  console.log("Session:", session);
  console.log("AccessToken:", accessToken);

  // Danh sách bằng cấp dropdown
  const degreeOptions = ["Đại học", "Cao đẳng", "Trung cấp"];

  // Danh sách loại bài đăng
  const postTypeOptions = [
    {
      value: "vip",
      label: "Post VIP",
      price: 2,
      priceLabel: "2$/day",
      description:
        "Bạn có thể đăng tin với hiển thị nổi bật và đề xuất hàng đầu.",
    },
    {
      value: "normal",
      label: "Post Normal",
      price: 1,
      priceLabel: "1$/day",
      description: "Bạn chỉ có thể đăng tin với hiển thị đơn giản.",
    },
  ];

  // Danh sách location
  const locationOptions = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
  ];

  // Ngày hiện tại để validate endAt
  const minDate = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate ngày hết hạn
    if (form.endAt && form.endAt < minDate) {
      setMessage("Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại!");
      setLoading(false);
      return;
    }

    if (!employerId) {
      setMessage("Bạn cần đăng nhập bằng tài khoản nhà tuyển dụng!");
      setLoading(false);
      return;
    }

    // Validate salary inputs: require both or none, and max > min
    const salaryMinStr = String((form as any).salaryMin || "").trim();
    const salaryMaxStr = String((form as any).salaryMax || "").trim();
    if ((salaryMinStr && !salaryMaxStr) || (!salaryMinStr && salaryMaxStr)) {
      setMessage("Vui lòng nhập cả mức lương .");
      setLoading(false);
      return;
    }
    if (salaryMinStr && salaryMaxStr) {
      const min = Number(salaryMinStr);
      const max = Number(salaryMaxStr);
      if (isNaN(min) || isNaN(max) || max <= min) {
        setMessage("Giá trị lương không hợp lệ: Max phải lớn hơn Min.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...form,
      requiredSkills: form.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      minExperience: form.minExperience ? Number(form.minExperience) : null,
      employerId,
      endAt: form.endAt ? `${form.endAt}T00:00:00` : "",
      salaryRange:
        salaryMinStr && salaryMaxStr ? `${salaryMinStr}-${salaryMaxStr} triệu` : "",
      postType: form.postType,
    };

    try {
      const res = await fetch("http://localhost:8080/api/job-postings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log("Request payload:", payload);

      if (res.ok) {
        setMessage("Đăng việc thành công!");
        setForm(initialState);
      } else {
        const err = await res.json();
        setMessage(
          "Lỗi: " +
            (err.message || JSON.stringify(err) || "Không thể đăng việc")
        );
      }
    } catch {
      setMessage("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="mx-auto" style={{ maxWidth: 1200, minWidth: 400 }}>
          <h2 className="mb-4 text-center fw-bold" style={{ color: "#2a3b6a" }}>
            <span style={{ fontSize: 32, marginRight: 8 }}>📝</span> Create New
            Job
          </h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-4 shadow-sm border"
          >
            <div className="row g-3">
              {/* Loại bài đăng */}
              <div className="col-12">
                <label className="form-label fw-semibold">Loại bài đăng *</label>
                <select
                  className="form-select rounded-3"
                  name="postType"
                  value={form.postType}
                  onChange={handleChange}
                  required
                  style={{
                    fontWeight: 500,
                    fontSize: "1.05rem",
                    padding: "0.7rem 1rem",
                  }}
                >
                  {postTypeOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      style={{
                        fontWeight: opt.value === "vip" ? 600 : 400,
                        color: opt.value === "vip" ? "#e01d20" : "#290bd6",
                      }}
                    >
                      {opt.label} ({opt.priceLabel})
                    </option>
                  ))}
                </select>

                {/* Hiển thị mô tả loại post */}
                <div className="mt-2" style={{ minHeight: 32 }}>
                  <span
                    className="badge me-2"
                    style={{
                      fontSize: "1rem",
                      verticalAlign: "middle",
                      backgroundColor:
                        form.postType === "vip" ? "#ef4444" : "#facc15",
                      color: form.postType === "vip" ? "#fff" : "#1e293b",
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "0.5rem 1.2rem",
                    }}
                  >
                    {
                      postTypeOptions.find(
                        (opt) => opt.value === form.postType
                      )?.label
                    }
                  </span>
                  <div
                    className="text-muted mt-1"
                    style={{ fontSize: "0.98rem" }}
                  >
                    {
                      postTypeOptions.find(
                        (opt) => opt.value === form.postType
                      )?.description
                    }
                  </div>
                </div>
              </div>

              {/* Job Title */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Job Title *</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="e.g. ReactJS Developer"
                />
              </div>

              {/* Category */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Category</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Information Technology"
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label fw-semibold">Job Description</label>
                <textarea
                  className="form-control rounded-3"
                  name="description"
                  rows={7}
                  style={{ minHeight: 180 }}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detailed job description..."
                />
              </div>

              {/* Location */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Location</label>
                <select
                  className="form-select rounded-3"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select province/city</option>
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              {/* Salary (min - max) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Salary Range</label>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="form-control rounded-3"
                    name="salaryMin"
                    value={(form as any).salaryMin}
                    onChange={handleChange}
                    min={0}
                    placeholder="Min"
                    style={{ maxWidth: 140 }}
                  />
                  <div style={{ padding: "0 10px", fontWeight: 700 }}>-</div>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    name="salaryMax"
                    value={(form as any).salaryMax}
                    onChange={handleChange}
                    min={0}
                    placeholder="Max"
                    style={{ maxWidth: 140 }}
                  />
                  <div style={{ marginLeft: 10, color: "#6b7280" }}>triệu</div>
                </div>
              </div>

              {/* Job Type */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Job Type *</label>
                <select
                  className="form-select rounded-3"
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              {/* Degree */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Required Degree</label>
                <select
                  className="form-select rounded-3"
                  name="requiredDegree"
                  value={form.requiredDegree}
                  onChange={handleChange}
                >
                  <option value="">Select degree</option>
                  {degreeOptions.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Minimum Experience (years)
                </label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  name="minExperience"
                  value={form.minExperience}
                  onChange={handleChange}
                  min={0}
                  placeholder="e.g. 1"
                />
              </div>

              {/* Expiration Date */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Expiration Date</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  name="endAt"
                  value={form.endAt}
                  onChange={handleChange}
                  min={minDate}
                  required
                />
              </div>

              {/* Required Skills */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Required Skills{" "}
                  <span className="text-muted">(comma separated)</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="requiredSkills"
                  value={form.requiredSkills}
                  onChange={handleChange}
                  placeholder="React, Node.js, SQL"
                />
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Status</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  name="status"
                  value="Active"
                  disabled
                  readOnly
                />
              </div>

              {/* Tổng phí */}
              <div className="col-12 position-relative" style={{ minHeight: 60 }}>
                {(() => {
                  if (!form.endAt) return null;

                  const startDate = new Date();
                  const endDate = new Date(form.endAt);
                  startDate.setHours(0, 0, 0, 0);
                  endDate.setHours(0, 0, 0, 0);

                  const diffTime = endDate.getTime() - startDate.getTime();
                  const diffDays = Math.max(
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
                    1
                  );

                  const price =
                    postTypeOptions.find(
                      (opt) => opt.value === form.postType
                    )?.price || 0;

                  const total = price * diffDays;

                  return (
                    <div
                      style={{
                        position: "absolute",
                        right: 51,
                        bottom: 26,
                        transform: "translateY(-110%)",
                        background:
                          "linear-gradient(90deg,#e0e7ff 0%,#f0fdfa 100%)",
                        boxShadow: "0 2px 12px #2a3b6a22",
                        borderRadius: 16,
                        padding: "0.7rem 8.5rem",
                        minWidth: 160,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "1.5rem", marginRight: 8 }}>
                        💸
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#2563eb",
                          fontSize: "1.1rem",
                          letterSpacing: 1,
                        }}
                      >
                        Tổng phí:
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          color: "#059669",
                          fontSize: "1.5rem",
                          marginLeft: 8,
                        }}
                      >
                        {total}$
                      </span>
                    </div>
                  );
                })()}

                {/* Nút submit */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-5 py-2 rounded-3 fw-bold"
                    style={{
                      fontSize: "1.1rem",
                      boxShadow: "0 2px 8px #2a3b6a33",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Posting..." : "Create Job"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {message && (
            <div className="mt-3 text-center text-success fw-semibold">
              {message}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
