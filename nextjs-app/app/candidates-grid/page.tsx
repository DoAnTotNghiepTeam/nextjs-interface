"use client"
import React from "react";
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";
import { useSession } from "next-auth/react";

export default function CandidateGrid() {

  const { data: session } = useSession();
  console.log("dieu tư session", session);

  const role = session?.user?.roles;

  return (
    <>
      <Layout>
        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-company">
                <div className="block-banner text-center">
                  <h3 className="wow animate__animated animate__fadeInUp">Browse Candidates</h3>
                  <div className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, <br className="d-none d-xl-block" />
                    atque delectus molestias quis?
                  </div>
                  <div className="box-list-character">
                    <ul>
                      <li>
                        <Link href="#">
                          <span className="active">A</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>B</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>C</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>D</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>E</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>F</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>G</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>H</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>I</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>J</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>K</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>L</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>M</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>N</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>O</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>P</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Q</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>R</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>S</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>T</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>U</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>V</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>W</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>X</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Y</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Z</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-30">
            <div className="container">
              <div className="content-page">
                <div className="box-filters-job">
                  <div className="row">
                    <div className="col-xl-6 col-lg-5">
                      <span className="text-small text-showing">
                        Showing <strong>41-60 </strong>of <strong>944 </strong>jobs
                      </span>
                    </div>
                    <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                      <div className="display-flex2">
                        {role?.includes("Employers") && (
                          <Link href="/jobs-create">
                            <button className="btn btn-primary" style={{ marginRight: "16px" }}>
                              New Candidates
                            </button>
                          </Link>
                        )}
                        <div className="box-border mr-10">
                          <span className="text-sortby">Show:</span>
                          <div className="dropdown dropdown-sort">
                            <button className="btn dropdown-toggle" id="dropdownSort" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                              <span>12</span>
                              <i className="fi-rr-angle-small-down" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort">
                              <li>
                                <Link href="#">
                                  <span className="dropdown-item active">10</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="#">
                                  <span className="dropdown-item">12</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="#">
                                  <span className="dropdown-item">20</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="box-border">
                          <span className="text-sortby">Sort by:</span>
                          <div className="dropdown dropdown-sort">
                            <button className="btn dropdown-toggle" id="dropdownSort2" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                              <span>Newest Post</span>
                              <i className="fi-rr-angle-small-down" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort2">
                              <li>
                                <Link href="#">
                                  <span className="dropdown-item active">Newest Post</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="#">
                                  <span className="dropdown-item">Oldest Post</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="#">
                                  <span className="dropdown-item">Rating Post</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="box-view-type">
                          <Link href="/jobs-list">
                            <span className="view-type">
                              <img src="assets/imgs/template/icons/icon-list.svg" alt="jobBox" />
                            </span>
                          </Link>

                          <Link href="/jobs-grid">
                            <span className="view-type">
                              <img src="assets/imgs/template/icons/icon-grid-hover.svg" alt="jobBox" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user1.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Robert Fox</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user2.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Cody Fisher</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">Python developer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user3.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Jerome Bell</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">Content Manager</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user4.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Jane Cooper</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">Network</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user5.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Floyd Miles</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">Photo Editing</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user6.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Devon Lane</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">Online Marketing</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user7.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Jerome Bell</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user8.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Eleanor</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user9.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Theresa</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user10.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Robert Fox</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user11.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Cameron</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user12.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Jacob Jones</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user13.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Court Henry</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user14.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Hawkins</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user15.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5>Howard</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <div className="card-grid-2-image-rd online">
                          <Link href="/candidate-details">
                            <span>
                              <figure>
                                <img alt="jobBox" src="assets/imgs/page/candidates/user1.png" />
                              </figure>
                            </span>
                          </Link>
                        </div>
                        <div className="card-profile pt-10">
                          <Link href="/candidate-details">
                            <span>
                              <h5> Alexander</h5>
                            </span>
                          </Link>
                          <span className="font-xs color-text-mutted">UI/UX Designer</span>
                          <div className="rate-reviews-small pt-5">
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span>
                              <img src="assets/imgs/template/icons/star.svg" alt="jobBox" />
                            </span>
                            <span className="ml-10 color-text-mutted font-xs">(65)</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-block-info">
                        <p className="font-xs color-text-paragraph-2">| Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, atque delectus molestias quis?</p>
                        <div className="card-2-bottom card-2-bottom-candidate mt-30">
                          <div className="text-start">
                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Figma</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Adobe XD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">PSD</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">App</span>
                            </Link>

                            <Link href="/jobs-grid">
                              <span className="btn btn-tags-sm mb-10 mr-5">Digital</span>
                            </Link>
                          </div>
                        </div>
                        <div className="employers-info align-items-center justify-content-center mt-15">
                          <div className="row">
                            <div className="col-6">
                              <span className="d-flex align-items-center">
                                <i className="fi-rr-marker mr-5 ml-0" />
                                <span className="font-sm color-text-mutted">Chicago, US</span>
                              </span>
                            </div>
                            <div className="col-6">
                              <span className="d-flex justify-content-end align-items-center">
                                <i className="fi-rr-clock mr-5" />
                                <span className="font-sm color-brand-1">$45 / hour</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="paginations">
                <ul className="pager">
                  <li>
                    <a className="pager-prev" href="#" />
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number">1</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number">2</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number">3</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number">4</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number">5</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number active">6</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="pager-number">7</span>
                    </Link>
                  </li>
                  <li>
                    <a className="pager-next" href="#" />
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">News and Blog</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
            </div>
            <div className="container">
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <BlogSlider />
                </div>
                <div className="text-center">
                  <Link href="blog-grid">
                    <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">Load More Posts</span>
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
                    <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input className="input-newsletter" type="text" placeholder="Enter your email here" />
                        <button className="btn btn-default font-heading icon-send-letter">Subscribe</button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
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
