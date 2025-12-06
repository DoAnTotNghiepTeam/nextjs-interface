"use client";
import Layout from "@/components/Layout/Layout";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface JobForm {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  category: string;
  requiredSkills: string;
  minExperience: string | number;
  requiredDegree: string;
  endAt: string;
  status: string;
}

export default function JobEdit() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const { id } = useParams();
  const [form, setForm] = useState<JobForm>({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    jobType: "",
    category: "",
    requiredSkills: "",
    minExperience: "",
    requiredDegree: "",
    endAt: "",
    status: "active",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(`http://localhost:8080/api/job-postings/${id}` , {
          headers: {
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            ...data,
            requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills.join(", ") : "",
            minExperience: data.minExperience ? String(data.minExperience) : "",
            endAt: data.endAt ? data.endAt.slice(0, 10) : "",
          });
        } else {
          setMessage("Lỗi khi lấy dữ liệu job");
        }
      } catch (err) {
        console.error(err);
        setMessage("Lỗi kết nối API!");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id, accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const payload = {
      ...form,
      status: form.status ? form.status.toUpperCase() : "ACTIVE",
      requiredSkills: form.requiredSkills.split(",").map((s: string) => s.trim()).filter(Boolean),
      minExperience: form.minExperience ? Number(form.minExperience) : null,
      endAt: form.endAt ? `${form.endAt}T00:00:00` : "",
    };
    try {
      const res = await fetch(`http://localhost:8080/api/job-postings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("Cập nhật việc làm thành công!");
      } else {
        const err = await res.json();
        setMessage("Lỗi: " + (err.message || "Không thể cập nhật việc làm"));
      }
    } catch (err) {
      console.error(err);
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
            <span style={{fontSize:32, marginRight:8}}>📝</span> Edit Job
          </h2>
          {message && <div className="mb-3 text-danger text-center">{message}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 shadow-sm border">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Job Title *</label>
                  <input type="text" className="form-control rounded-3" name="title" value={form.title} onChange={handleChange} required maxLength={150} placeholder="e.g. ReactJS Developer" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <input type="text" className="form-control rounded-3" name="category" value={form.category} onChange={handleChange} maxLength={100} placeholder="e.g. Information Technology" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Job Description</label>
                  <textarea className="form-control rounded-3" name="description" rows={7} style={{minHeight: 180}} value={form.description} onChange={handleChange} placeholder="Detailed job description..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Location</label>
                  <input type="text" className="form-control rounded-3" name="location" value={form.location} onChange={handleChange} maxLength={100} placeholder="e.g. Hanoi, Ho Chi Minh City" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Salary Range</label>
                  <input type="text" className="form-control rounded-3" name="salaryRange" value={form.salaryRange} onChange={handleChange} maxLength={100} placeholder="e.g. 15-20 million" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Job Type *</label>
                  <select className="form-select rounded-3" name="jobType" value={form.jobType} onChange={handleChange} required>
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="intern">Intern</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Required Degree</label>
                  <input type="text" className="form-control rounded-3" name="requiredDegree" value={form.requiredDegree} onChange={handleChange} placeholder="e.g. Bachelor, College, Certificate" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Minimum Experience (years)</label>
                  <input type="number" className="form-control rounded-3" name="minExperience" value={form.minExperience} onChange={handleChange} min={0} placeholder="e.g. 1" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Expiration Date</label>
                  <input type="date" className="form-control rounded-3" name="endAt" value={form.endAt} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Required Skills <span className="text-muted">(comma separated)</span></label>
                  <input type="text" className="form-control rounded-3" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="React, Node.js, SQL" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Status</label>
                  <select className="form-select rounded-3" name="status" value={form.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="col-12 text-center mt-4">
                  <button type="submit" className="btn btn-primary px-5 py-2 rounded-3 fw-bold" style={{ fontSize: "1.1rem", boxShadow: "0 2px 8px #2a3b6a33" }} disabled={loading}>
                    {loading ? "Updating..." : "Update Job"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
