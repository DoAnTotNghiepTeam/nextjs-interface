/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";
import TestimonialSlider1 from "@/components/sliders/Testimonial1";
import { useEffect, useState } from "react";
import { ourTeamApi, OurTeamResponseDto } from "@/lib/ourTeam/api";

export default function Contact() {
  // State cho Our Team
  const [ourTeam, setOurTeam] = useState<OurTeamResponseDto[]>([]);
  const [featuredOurTeam, setFeaturedOurTeam] =
    useState<OurTeamResponseDto | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOurTeam = async () => {
      try {
        setLoadingTeam(true);
        const ourTeamData = await ourTeamApi.getAllOurTeam();
        setOurTeam(ourTeamData);

        if (ourTeamData.length > 0) {
          setFeaturedOurTeam(ourTeamData[0]);
        }
      } catch (err) {
        console.error("Error fetching our team:", err);
        setError("Không thể tải dữ liệu our team");
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchOurTeam();
  }, []);

  // State cho form liên hệ
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setResult("Gửi thành công 🎉");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setResult("Có lỗi xảy ra 🚨");
      }
    } catch {
      setResult("Có lỗi xảy ra 🚨");
    }
    setLoadingForm(false);
  };

  return (
    <>
      <Layout>
        <div>
          {/* Breadcrumb */}
          <section className="section-box">
            <div className="breacrumb-cover bg-img-about">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <h2 className="mb-10">About Us</h2>
                    <p className="font-lg color-text-paragraph-2">
                      Get the latest news, updates and tips
                    </p>
                  </div>
                  <div className="col-lg-6 text-lg-end">
                    <ul className="breadcrumbs mt-40">
                      <li>
                        <a className="home-icon" href="#">
                          Home
                        </a>
                      </li>
                      <li>Blog</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Thông tin liên hệ */}
          <section className="section-box mt-80">
            <div className="container">
              <div className="box-info-contact">
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-sm-12 mb-30">
                    <a href="#">
                      <img
                        src="assets/imgs/page/contact/logo.svg"
                        alt="jobBox"
                      />
                    </a>
                    <div className="font-sm color-text-paragraph">
                      205 Nguyen Hue Walking Street, Suite 810, District 1, Ho
                      Chi Minh City, Vietnam
                      <br /> Phone: (123) 456-7890
                      <br /> Email: contact@jobbox.com
                    </div>
                    <a
                      className="text-uppercase color-brand-2 link-map"
                      href="#"
                    >
                      View map
                    </a>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12 mb-30">
                    <h6>Hà Nội</h6>
                    <p className="font-sm color-text-paragraph mb-20">
                      3128 Tran Hung Dao St. Hoan Kiem, Hanoi
                    </p>
                    <h6>Ho Chi Minh City</h6>
                    <p className="font-sm color-text-paragraph mb-20">
                      2145 Nguyen Trai St. Binh Thanh, Ho Chi Minh City
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12 mb-30">
                    <h6>Da Nang</h6>
                    <p className="font-sm color-text-paragraph mb-20">
                      4519 Dien Bien Phu St. Hai Chau, Da Nang
                    </p>
                    <h6>Can Tho</h6>
                    <p className="font-sm color-text-paragraph mb-20">
                      3892 Hung Vuong Ave. Ninh Kieu, Can Tho
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12 mb-30">
                    <h6>Hai Phong</h6>
                    <p className="font-sm color-text-paragraph mb-20">
                      4170 Le Loi Rd. Ngo Quyen, Hai Phong
                    </p>
                    <h6>Hue</h6>
                    <p className="font-sm color-text-paragraph mb-20">
                      2786 Le Duan St. Phu Nhuan, Hue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form liên hệ */}
          <section className="section-box mt-70">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mb-40">
                  <span className="font-md color-brand-2 mt-20 d-inline-block">
                    Contact us
                  </span>
                  <h2 className="mt-5 mb-10">Get in touch</h2>
                  <p className="font-md color-text-paragraph-2">
                    The right move at the right time saves your investment.
                    <br className="d-none d-lg-block" /> Let’s expand your
                    business.
                  </p>

                  <form
                    className="contact-form-style mt-30"
                    onSubmit={handleSubmit}
                  >
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="input-style mb-20">
                          <input
                            name="name"
                            placeholder="Enter your name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-style mb-20">
                          <input
                            name="email"
                            placeholder="Your email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-style mb-20">
                          <input
                            name="phone"
                            placeholder="Phone number"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="textarea-style mb-30">
                          <textarea
                            name="message"
                            placeholder="Tell us about yourself"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button
                          className="submit btn btn-send-message"
                          type="submit"
                          disabled={loadingForm}
                        >
                          {loadingForm ? "Đang gửi..." : "Send message"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {result && (
                    <p
                      style={{
                        marginTop: 18,
                        fontSize: 16,
                        fontWeight: 500,
                        color: result.includes("thành công")
                          ? "#43a047"
                          : "#d32f2f",
                      }}
                    >
                      {result}
                    </p>
                  )}
                </div>

                <div className="col-lg-4 text-center d-none d-lg-block">
                  <img src="assets/imgs/page/contact/img.png" alt="jobBox" />
                </div>
              </div>
            </div>
          </section>

          {/* Team section */}
          <section className="section-box mt-80">
            <div className="post-loop-grid">
              <div className="container">
                <div className="text-center">
                  <h6 className="f-18 color-text-mutted text-uppercase">
                    {featuredOurTeam?.ourTeam}
                  </h6>
                  <h2 className="section-title mb-10">
                    {featuredOurTeam?.ourTeamTitle}
                  </h2>
                  <p className="font-sm color-text-paragraph w-lg-50 mx-auto">
                    {featuredOurTeam?.ourTeamDescription}
                  </p>
                </div>
                <div className="row mt-70">
                  {ourTeam.map((member, index) => (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-md-30"
                      key={index}
                    >
                      <div className="card-grid-4 text-center hover-up">
                        <div className="image-top-feature">
                          <figure>
                            <img
                              alt="jobBox"
                              src={
                                member.imageUrl ||
                                "assets/imgs/page/about/team1.png"
                              }
                            />
                          </figure>
                        </div>
                        <div className="card-grid-4-info">
                          <h5 className="mt-10">{member.name}</h5>
                          <p className="font-xs color-text-paragraph-2 mt-5 mb-5">
                            {member.viTri}
                          </p>
                          <span className="card-location">
                            {member.location}
                          </span>
                          <div className="text-center mt-30">
                            <a className="share-facebook social-share-link" />
                            <a className="share-twitter social-share-link" />
                            <a className="share-instagram social-share-link" />
                            <a className="share-linkedin social-share-link" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Blog */}
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
                <h2 className="section-title mb-10">News and Blog</h2>
                <p className="font-lg color-text-paragraph-2">
                  Get the latest news, updates and tips
                </p>
              </div>
            </div>
            <div className="container">
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <BlogSlider />
                </div>
                <div className="text-center">
                  <Link href="/blog-grid">
                    <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">
                      Load More Posts
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img
                      src="assets/imgs/template/newsletter-left.png"
                      alt="jobBox"
                    />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always <br /> Update Regularly
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
                    <img
                      src="assets/imgs/template/newsletter-right.png"
                      alt="jobBox"
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
