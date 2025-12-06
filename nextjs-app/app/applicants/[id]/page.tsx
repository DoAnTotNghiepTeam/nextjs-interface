
"use client";

import { useParams } from "next/navigation";

import Layout from "@/components/Layout/Layout";
import React from "react";
import ApplicantDetail from "@/features/applicants/components/ApplicantDetail";
import Image from "next/image";

export default function ApplicantDetailPage() {
  const { id } = useParams();
 
  
  if (!id) return <p>Applicant ID not found.</p>;

  return (
      <>
      <Layout>
        <section className="section-box-2">
          <div className="container">
            <div className="banner-hero banner-image-single">
              <Image src="../../assets/imgs/page/candidates/img.png" alt="jobbox" width={1000} height={300} unoptimized />
            </div>
          
            <div className="box-nav-tabs mt-40 mb-5">
              <ul className="nav" role="tablist">
                {/* <li>
                  <span className="btn btn-border aboutus-icon mr-15 mb-5 active" >
                    Short Bio
                  </span>
                </li>
                <li>
                  <span className="btn btn-border recruitment-icon mr-15 mb-5">
                    Skills
                  </span>
                </li> */}
                {/* <li>
                  <span className="btn btn-border people-icon mb-5" onClick={() => handleOnClick(3)}>
                    Working Experience
                  </span>
                </li> */}
              </ul>
            </div>
            <div className="border-bottom pt-10 pb-10" />
          </div>
        </section>
        <section className="section-box mt-50">
          <div className="container">
            <div className="row">
      
            <ApplicantDetail id={Number(id)} />
           
  
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-20">
          <div className="container">
            <div className="box-newsletter">
              <div className="row">
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  {/* <Image src="assets/imgs/template/newsletter-left.png" alt="joxBox" width={50} height={50} unoptimized /> */}
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
                  {/* <Image src="assets/imgs/template/newsletter-right.png" alt="joxBox" width={50} height={50} unoptimized /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>

   
  );
}
