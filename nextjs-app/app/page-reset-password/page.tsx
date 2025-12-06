"use client"
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { useState } from "react";

export default function Reset() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu không khớp");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setMessage("Vui lòng kiểm tra email để lấy mã xác nhận!");
                setStep(2); // chuyển sang bước nhập mã xác nhận
            } else {
                setMessage("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch {
            setMessage("Không thể kết nối đến server.");
        }
        setLoading(false);
    };

    const handleVerify = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/api/auth/verify-reset-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, newPassword }),
            });
            if (res.ok) {
                setMessage("Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.");
            } else {
                setMessage("Mã xác nhận hoặc mật khẩu không hợp lệ.");
            }
        } catch {
            setMessage("Không thể kết nối đến server.");
        }
        setLoading(false);
    };

    return (
        <>
            <Layout>
                <section className="pt-100 login-register">
                    <div className="container">
                        <div className="row login-register-cover">
                            <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                                <div className="text-center">
                                    <p className="font-sm text-brand-2">Forgot Password</p>
                                    <h2 className="mt-10 mb-5 text-brand-1">Reset Your Password</h2>
                                </div>

                                {step === 1 ? (
                                    // Bước 1: nhập email
                                    <form className="login-register text-start mt-20" onSubmit={handleSubmit}>
                                        <p className="font-sm text-muted mb-30">
                                            Enter email address associated with your account and we ll send you a link to reset your password
                                        </p>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="input-1">
                                                Email address *
                                            </label>
                                            <input
                                                className="form-control"
                                                id="input-1"
                                                type="email"
                                                required
                                                name="email"
                                                placeholder="stevenjob@gmail.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-brand-1 hover-up w-100" type="submit" disabled={loading}>
                                                {loading ? "Đang gửi..." : "Continue"}
                                            </button>
                                        </div>
                                        {message && <div className="alert alert-info text-center">{message}</div>}
                                        <div className="text-muted text-center">
                                            Don't have an Account?{" "}
                                            <Link href="/page-signin">
                                                <span>Sign up</span>
                                            </Link>
                                        </div>
                                    </form>
                                ) : (
                                    // Bước 2: nhập mã xác nhận + mật khẩu mới
                                    <form className="login-register text-start mt-20" onSubmit={handleVerify}>
                                        <p className="font-sm text-muted mb-30">
                                            Nhập mã xác nhận đã gửi tới email và mật khẩu mới
                                        </p>
                                        <div className="form-group">
                                            <label className="form-label">Mã xác nhận *</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                required
                                                value={code}
                                                onChange={e => setCode(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Mật khẩu mới *</label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                required
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Nhập lại mật khẩu mới *</label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <button className="btn btn-brand-1 hover-up w-100" type="submit" disabled={loading}>
                                                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                            </button>
                                        </div>
                                        {message && <div className="alert alert-info text-center">{message}</div>}
                                    </form>
                                )}
                            </div>

                            <div className="img-1 d-none d-lg-block">
                                <img className="shape-1" src="assets/imgs/page/login-register/img-5.svg" alt="JobBox" />
                            </div>
                            <div className="img-2">
                                <img src="assets/imgs/page/login-register/img-3.svg" alt="JobBox" />
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}
