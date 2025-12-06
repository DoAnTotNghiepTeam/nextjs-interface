/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";

import React, { useEffect, useState } from "react";
import { aboutUsApi, AboutUsResponse } from "@/lib/aboutUs/api";
import { ourTeamApi, OurTeamResponseDto } from "@/lib/ourTeam/api";

export default function About() {
  const [aboutUs, setAboutUs] = React.useState<AboutUsResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [featureAboutUs, setFeatureAboutUs] =
    React.useState<AboutUsResponse | null>(null);
  const [ourTeam, setOurTeam] = useState<OurTeamResponseDto[]>([]);
  const [featuredOurTeam, setFeaturedOurTeam] =
    useState<OurTeamResponseDto | null>(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        setLoading(true);
        const aboutUsData = await aboutUsApi.getAboutUs();
        setAboutUs(aboutUsData);

        if (aboutUsData.length > 0) {
          setFeatureAboutUs(aboutUsData[0]);
        }
      } catch (error) {
        setError("Failed to fetch about us data");
      } finally {
        setLoading(false);
      }
    };
    fetchAboutUs();
  }, []);

  useEffect(() => {
    const fetchOurTeam = async () => {
      try {
        setLoading(true);
        const ourTeamData = await ourTeamApi.getAllOurTeam();
        setOurTeam(ourTeamData);

        // Lấy ourTeam đầu tiên làm featured ourTeam
        if (ourTeamData.length > 0) {
          setFeaturedOurTeam(ourTeamData[0]);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Không thể tải dữ liệu blog");
      } finally {
        setLoading(false);
      }
    };

    fetchOurTeam();
  }, []);
  return (
    <>
      <Layout>
        <div>
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
                      <li>About Us</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50">
            <div className="post-loop-grid">
              <div className="container">
                <div className="text-center">
                  <h6 className="f-18 color-text-mutted text-uppercase">
                    {`${featureAboutUs?.companyName}`}
                  </h6>
                  <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                    {`${featureAboutUs?.companyTitle}`}
                  </h2>
                  <p className="font-sm color-text-paragraph wow animate__animated animate__fadeInUp w-lg-50 mx-auto">
                    {`${featureAboutUs?.companyDescription}`}
                  </p>
                </div>
                <div className="row mt-70">
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <img
                      src={
                        featureAboutUs?.imageUrl ||
                        "assets/imgs/page/about/img-about2.png"
                      }
                      alt="joxBox"
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12">
                    <h3 className="mt-15">{`${featureAboutUs?.servicesSectionTitle}`}</h3>
                    <div className="mt-20">
                      <p className="font-md color-text-paragraph mt-20">
                        {`${featureAboutUs?.servicesSectionDescription}`}
                      </p>
                    </div>
                    {/* <div className="mt-30">
                      <a className="btn btn-brand-1" href="#">
                        Read More
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-80">
            <div className="post-loop-grid">
              <div className="container">
                <div className="text-center">
                  <h6 className="f-18 color-text-mutted text-uppercase">
                    {`${featuredOurTeam?.ourTeam}`}
                  </h6>
                  <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                    {`${featuredOurTeam?.ourTeamTitle}`}
                  </h2>
                  <p className="font-sm color-text-paragraph w-lg-50 mx-auto wow animate__animated animate__fadeInUp">
                    {`${featuredOurTeam?.ourTeamDescription}`}
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
                            {/* Assuming member.image contains the image path */}
                          </figure>
                        </div>
                        <div className="card-grid-4-info">
                          <h5 className="mt-10">{member.name}</h5>
                          <p className="font-xs color-text-paragraph-2 mt-5 mb-5">
                            {member.viTri}{" "}
                            {/* Assuming member.viTri holds the job title */}
                          </p>
                          <div className="rate-reviews-small pt-5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                <img
                                  src="assets/imgs/template/icons/star.svg"
                                  alt="jobBox"
                                />
                              </span>
                            ))}
                            <span className="ml-10 color-text-mutted font-xs">
                              {/* <span>({member.reviewsCount})</span> */}
                              {/* Assuming member.reviewsCount holds the review count */}
                            </span>
                          </div>
                          <span className="card-location">
                            {member.location}
                          </span>{" "}
                          {/* Assuming member.location holds location */}
                          <div className="text-center mt-30">
                            <a
                              className="share-facebook social-share-link"
                              href="#"
                            />
                            <a
                              className="share-twitter social-share-link"
                              href="#"
                            />
                            <a
                              className="share-instagram social-share-link"
                              href="#"
                            />
                            <a
                              className="share-linkedin social-share-link"
                              href="#"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
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
          {/* <section className="section-box mt-30 mb-40">
            <div className="container">
              <h2 className="text-center mb-15 wow animate__animated animate__fadeInUp">
                Our Happy Customer
              </h2>
              <div className="font-lg color-text-paragraph-2 text-center wow animate__animated animate__fadeInUp">
                When it comes to choosing the right web hosting provider, we
                know how easy it
                <br className="d-none d-lg-block" /> is to get overwhelmed with
                the number.
              </div>
              <div className="row mt-50">
                <div className="box-swiper">
                  <TestimonialSlider1 />
                </div>
              </div>
            </div>
          </section> */}
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
        </div>
      </Layout>
    </>
  );
}
