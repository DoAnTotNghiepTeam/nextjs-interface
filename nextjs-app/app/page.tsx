"use client";
/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/Layout/Layout";
import CategorySlider from "@/components/sliders/Category";
import TopRekruterSlider from "@/components/sliders/TopRekruter";
import BlogSlider from "@/components/sliders/Blog";
import CategoryTab from "@/components/elements/CategoryTab";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobChatBot from "./ChatBotJob/page";
import JobPostingVip from "@/components/sliders/JobPostingVip";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [salary, setSalary] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Banner VIP active
  const [vipBanner, setVipBanner] = useState<any>(null);
  // Banner Featured active
  const [featuredBanner, setFeaturedBanner] = useState<any>(null);

  // Banner Standard active
  const [standardBanner, setStandardBanner] = useState<any>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL_BANNER || "http://localhost:8080";
    // VIP Banner
    fetch(`${API_URL}/api/banners/active?bannerType=Vip`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVipBanner(data[0]);
        } else {
          setVipBanner(null);
        }
      })
      .catch(() => setVipBanner(null));

    // Featured Banner
    fetch(`${API_URL}/api/banners/active?bannerType=Featured`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedBanner(data[0]);
        } else {
          setFeaturedBanner(null);
        }
      })
      .catch(() => setFeaturedBanner(null));

    // Standard Banner
    fetch(`${API_URL}/api/banners/active?bannerType=Standard`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStandardBanner(data[0]);
        } else {
          setStandardBanner(null);
        }
      })
      .catch(() => setStandardBanner(null));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (keyword) params.set("keyword", keyword);
    if (salary) params.set("salary", salary);
    router.push(`/jobs-grid?${params.toString()}`);
  };

  const t = useTranslations();

  return (
    <>
      <Layout>
        <section className="section-box" style={{
          position: 'relative',
          minHeight: '700px',
          backgroundImage: 'url(assets/imgs/page/homepage1/bannefull2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: 0,
          paddingTop: '75px'
        }}>
          <div className="banner-hero hero-1" style={{ background: 'transparent' }}>
            <div className="banner-inner">
              <div className="row">
                <div className="col-xl-8 col-lg-12">
                  <div className="block-banner">
                    <h1 className="heading-banner wow animate__animated animate__fadeInUp" style={{ color: 'black', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                      {t('App_Page.the')}<span style={{ color: '#3C65F5' }}>{t('App_Page.easiest-way')}</span>
                      <br className="d-none d-lg-block" />
                      {t('App_Page.to-get-your-new-job')}
                    </h1>
                    <div
                      className="banner-description mt-20 wow animate__animated animate__fadeInUp"
                      data-wow-delay=".1s"
                      style={{ color: 'black', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                    >
                      {t('App_Page.each-month-more-than-3-million-job-seekers-turn-to')}{" "}
                      <br className="d-none d-lg-block" />
                      {t('App_Page.website-in-their-search-for-work-making-over-140-000')}{" "}
                      <br className="d-none d-lg-block" />
                      {t('App_Page.applications-every-single-day')}
                    </div>
                    <div
                      className="form-find mt-40 wow animate__animated animate__fadeIn"
                      data-wow-delay=".2s"
                    >
                      <form onSubmit={handleSearch}>
                        <div className="box-industry">
                          <select
                            className="form-input mr-10 select-active  input-location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          >
                            <option value="">Location</option>
                            <option value="Hà Nội">Ha Noi</option>
                            <option value="Hải Phòng">Hai Phong</option>
                            <option value="Đà Nẵng">Da Nang</option>
                            <option value="Huế">Hue</option>
                            <option value="Cần Thơ">Can Tho</option>
                            <option value="HCM">Thanh pho Ho Chi Minh</option>
                            <option value="An Giang">An Giang</option>
                            <option value="Bắc Ninh">Bac Ninh</option>
                            <option value="Cà Mau">Ca Mau</option>
                            <option value="Cao Bằng">Cao Bang</option>
                            <option value="Đắk Lắk">Dak Lak</option>
                            <option value="Điện Biên">Dien Bien</option>
                            <option value="Đồng Nai">Dong Nai</option>
                            <option value="Đồng Tháp">Dong Thap</option>
                            <option value="Gia Lai">Gia Lai</option>
                            <option value="Hà Tĩnh">Ha Tinh</option>
                            <option value="Hưng Yên">Hung Yen</option>
                            <option value="Khánh Hòa">Khanh Hoa</option>
                            <option value="Lai Châu">Lai Chau</option>
                            <option value="Lạng Sơn">Lang Son</option>
                            <option value="Lào Cai">Lao Cai</option>
                            <option value="Lâm Đồng">Lam Dong</option>
                            <option value="Nghệ An">Nghe An</option>
                            <option value="Ninh Bình">Ninh Binh</option>
                            <option value="Phú Thọ">Phu Tho</option>
                            <option value="Quảng Ngãi">Quang Ngai</option>
                            <option value="Quảng Ninh">Quang Ninh</option>
                            <option value="Quảng Trị">Quang Tri</option>
                            <option value="Sơn La">Son La</option>
                            <option value="Tây Ninh">Tay Ninh</option>
                            <option value="Thái Nguyên">Thai Nguyen</option>
                            <option value="Thanh Hóa">Thanh Hoa</option>
                            <option value="Tuyên Quang">Tuyen Quang</option>
                            <option value="Vĩnh Long">Vinh Long</option>
                          </select>
                        </div>
                        <div className="box-industry">
                          <select
                            className="form-input mr-10 select-active input-location"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                          >
                            <option value="">Salary</option>
                            <option value="Dưới 20 triệu">Duoi 20 trieu</option>
                            <option value="Từ 20 triệu trở lên">Tu 20 trieu tro len</option>
                            <option value="Từ 50 triệu trở lên">Tu 50 trieu tro len</option>
                            <option value="Từ 70 triệu trở lên">Tu 70 trieu tro len</option>
                            <option value="Trên 100 triệu">Tren 100 trieu</option>
                          </select>
                        </div>
                        <input
                          className="form-input input-keysearch mr-10"
                          type="text"
                          placeholder="Your keyword... "
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button className="btn btn-default btn-find font-sm">
                          Search
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-80">
          <div className="section-box wow animate__animated animate__fadeIn">
            <div className="container">
              <div className="text-center">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp" style={{ color: 'black' }}>
                  Browse by category
                </h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                  Find the job that’s perfect for you. about 800+ new jobs
                  everyday
                </p>
              </div>
              <div className="box-swiper mt-50">
                <CategorySlider />
              </div>
            </div>
          </div>
        </section>
        <div className="section-box mb-30">
          <div className="container">
            {featuredBanner ? (
              <div className="featured-banner" style={{
                position: 'relative',
                width: '100%',
                backgroundImage: `url(${featuredBanner.bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 16,
                color: '#fff',
                display: 'flex',
                // flexDirection: 'row',
                justifyContent: 'center',
                padding: '41px 0px',
                boxSizing: 'border-box',
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', maxWidth: 500 }}>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>WE ARE</div>
                    <div style={{ fontWeight: 900, fontSize: 36, marginBottom: 4 }}>HIRING</div>
                  </div>

                  <div style={{ fontSize: 18, marginBottom: 4, marginLeft: 16 }}>
                    Let’s <span style={{ color: '#ffd600', fontWeight: 700 }}>Work</span> Together<br />
                    &amp; <span style={{ color: '#ffd600', fontWeight: 700 }}>Explore</span> Opportunities
                  </div>
                </div>
                <a
                  href={featuredBanner.bannerLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: 'absolute',
                    right: 48,
                    bottom: 43,
                    fontSize: 20,
                    padding: '14px 32px',
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  Apply now
                </a>
              </div>

            ) : (
              <div className="box-we-hiring">
                <div className="text-1">
                  <span className="text-we-are">We are</span>
                  <span className="text-hiring">Hiring</span>
                </div>
                <div className="text-2">
                  Let’s <span className="color-brand-1">Work</span> Together
                  <br /> &amp; <span className="color-brand-1">Explore</span>{" "}
                  Opportunities
                </div>
                <div className="text-3">
                  <div
                    className="btn btn-apply btn-apply-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#ModalApplyJobForm"
                  >
                    Apply now
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                Premium Job Opportunities
              </h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                Search and connect with the right candidates faster.{" "}
              </p>
            </div>
            <div className="mt-70">
              <JobPostingVip />
            </div>
          </div>
        </section>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                New jobs of the day
              </h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                Search and connect with the right candidates faster.{" "}
              </p>
            </div>
            <div className="mt-70">
              <CategoryTab />
            </div>
          </div>
        </section>
        <section className="section-box overflow-visible mt-100 mb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                {/* Banner Standard logic: nếu có banner active thì thay thế block này */}
                {standardBanner ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '77%',
                    minHeight: '320px',
                    maxHeight: '320px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    padding: 0,
                    overflow: 'hidden',
                    border: '6px solid #7c3aed',
                    marginTop: '48px',
                  }}>
                    <img
                      src={standardBanner.bannerImage}
                      alt={standardBanner.bannerTitle || "Banner"}
                      style={{
                        width: '100%',
                        height: '320px',
                        objectFit: 'cover',
                        margin: 0,
                        display: 'block',
                        borderRadius: 0,
                      }}
                    />
                  </div>
                ) : (
                  <div className="box-image-job">
                    <figure className="wow animate__animated animate__fadeIn">
                      <img
                        alt="jobBox"
                        src="assets/imgs/page/homepage1/img1.png"
                      />
                    </figure>
                  </div>
                )}
              </div>

              <div className="col-lg-6 col-sm-12">
                <div className="content-job-inner">
                  <span className="color-text-mutted text-32">
                    Your Career, Your Future
                  </span>
                  <h2 className="text-52 wow animate__animated animate__fadeInUp">
                    Discover <span className="color-brand-2">Opportunities</span> That
                    Matter
                  </h2>
                  <div className="mt-40 pr-50 text-md-lh28 wow animate__animated animate__fadeInUp">
                    Thousands of companies are hiring right now. Explore open positions,
                    compare offers, and take the next step in your career journey — all in
                    one place.
                  </div>
                  <div className="mt-40">
                    <div className="wow animate__animated animate__fadeInUp">
                      <Link href="/jobs-grid">
                        <span className="btn btn-default">Search Jobs</span>
                      </Link>

                      <Link href="/page-about">
                        <span className="btn btn-link">Learn More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* <section className="section-box overflow-visible mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">25</span>
                    <span> K+</span>
                  </h1>
                  <h5>Completed Cases</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a{" "}
                    <br className="d-none d-lg-block" />
                    complete solution upon focused of
                    <br className="d-none d-lg-block" /> any business
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">17</span>
                    <span> +</span>
                  </h1>
                  <h5>Our Office</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a{" "}
                    <br className="d-none d-lg-block" />
                    complete solution upon focused of{" "}
                    <br className="d-none d-lg-block" />
                    any business
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">86</span>
                    <span> +</span>
                  </h1>
                  <h5>Skilled People</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a{" "}
                    <br className="d-none d-lg-block" />
                    complete solution upon focused of{" "}
                    <br className="d-none d-lg-block" />
                    any business
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">28</span>
                    <span> +</span>
                  </h1>
                  <h5>CHappy Clients</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a{" "}
                    <br className="d-none d-lg-block" />
                    complete solution upon focused of{" "}
                    <br className="d-none d-lg-block" />
                    any business
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                Top Recruiters
              </h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                Discover your next career move, freelance gig, or internship
              </p>
            </div>
          </div>
          <div className="container">
            <div className="box-swiper mt-50">
              <TopRekruterSlider />
            </div>
          </div>
        </section>

        <section className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                News and Blog
              </h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
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
                <Link href="/blog-grid-2">
                  <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">
                    Load More Posts
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-20">
          <div className="container">
            <div className="box-newsletter">
              <div className="row">
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img
                    src="assets/imgs/template/newsletter-left.png"
                    alt="joxBox"
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
                  <img
                    src="assets/imgs/template/newsletter-right.png"
                    alt="joxBox"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
      <JobChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
}