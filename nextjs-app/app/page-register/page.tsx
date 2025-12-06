"use client";

import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    repassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter(); // chuyển hướng

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.repassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        email: form.email,
        fullName: form.fullname,
        repassword: form.repassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || data.message || "Đăng ký thất bại");
      return;
    }
    setSuccess("Đăng ký thành công!");
    router.push("/page-signin"); // Chuyển hướng sang trang login
  };

  return (
    <Layout>
      <section className="pt-100 login-register">
        <div className="container">
          <div className="row login-register-cover">
            <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
              <div className="text-center">
                <p className="font-sm text-brand-2">Register </p>
                <h2 className="mt-10 mb-5 text-brand-1">
                  Start for free Today
                </h2>
                <p className="font-sm text-muted mb-30">
                  Access to all features. No credit card required.
                </p>
                <button
                  className="btn social-login hover-up mb-20"
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  <img
                    src="assets/imgs/template/icons/icon-google.svg"
                    alt="jobbox"
                  />
                  <strong>Sign up with Google</strong>
                </button>
                <div className="divider-text-center">
                  <span>Or continue with</span>
                </div>
              </div>
              <form
                className="login-register text-start mt-20"
                onSubmit={handleRegister}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="input-1">
                    Full Name *
                  </label>
                  <input
                    className="form-control"
                    id="input-1"
                    type="text"
                    required
                    name="fullname"
                    placeholder="Steven Job"
                    value={form.fullname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-2">
                    Email *
                  </label>
                  <input
                    className="form-control"
                    id="input-2"
                    type="email"
                    required
                    name="email"
                    placeholder="stevenjob@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-3">
                    Username *
                  </label>
                  <input
                    className="form-control"
                    id="input-3"
                    type="text"
                    required
                    name="username"
                    placeholder="stevenjob"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-4">
                    Password *
                  </label>
                  <input
                    className="form-control"
                    id="input-4"
                    type="password"
                    required
                    name="password"
                    placeholder="************"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-5">
                    Re-Password *
                  </label>
                  <input
                    className="form-control"
                    id="input-5"
                    type="password"
                    required
                    name="repassword"
                    placeholder="************"
                    value={form.repassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="login_footer form-group d-flex justify-content-between">
                  <label className="cb-container">
                    <input type="checkbox" />
                    <span className="text-small">
                      Agree our terms and policy
                    </span>
                    <span className="checkmark" />
                  </label>
                  <Link href="/page-contact">
                    <span className="text-muted">Lean more</span>
                  </Link>
                </div>
                {error && <div className="text-danger">{error}</div>}
                {success && <div className="text-success">{success}</div>}
                <div className="form-group">
                  <button
                    className="btn btn-brand-1 hover-up w-100"
                    type="submit"
                    name="login"
                  >
                    Submit &amp; Register
                  </button>
                </div>
                <div className="text-muted text-center">
                  Already have an account?
                  <Link href="/page-signin">
                    <span>Sign in</span>
                  </Link>
                </div>
              </form>
            </div>
            <div className="img-1 d-none d-lg-block">
              <img
                className="shape-1"
                src="assets/imgs/page/login-register/img-1.svg"
                alt="JobBox"
              />
            </div>
            <div className="img-2">
              <img
                src="assets/imgs/page/login-register/img-2.svg"
                alt="JobBox"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
