import React from "react";
const Footer = () => {
  return (
    <footer className="footer mt-50">
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-lg-8 col-md-8 col-sm-12"
            style={{ color: "#5e6d55" }}
          >
            <h5 style={{ fontWeight: "bold", color: "#05264e" }}>
              JobBox Vietnam Joint Stock Company
            </h5>
            <p className="font-xs color-text-paragraph-2 mt-10">
              <i className="fi-rr-document" style={{ marginRight: "8px" }}></i>
              Business registration certificate number: 0107307178 issued on
              January 21, 2016, 17th change on April 3, 2025 at Hanoi City
              Department of Finance
            </p>
            <p className="font-xs color-text-paragraph-2 mt-10">
              <i className="fi-rr-document" style={{ marginRight: "8px" }}></i>
              Employment service license number: 44/2024/SLDTBXH-GP
            </p>
            <p className="font-xs color-text-paragraph-2 mt-10">
              <i className="fi-rr-marker" style={{ marginRight: "8px" }}></i>
              HN Headquarter: FS Building - GoldSeason No. 47 Nguyen Tuan, Thanh
              Xuan Ward, Hanoi City, Vietnam
            </p>
            <p className="font-xs color-text-paragraph-2 mt-10">
              <i className="fi-rr-marker" style={{ marginRight: "8px" }}></i>
              HCM Branch: Dali Building, 24C Phan Dang Luu, Go Vap District, Ho
              Chi Minh City
            </p>
          </div>
          {/* <div className="col-lg-4 col-md-4 col-sm-12 text-md-end">
            <Link href="/">
              <span>
                <img alt="jobBox" src="/assets/imgs/template/jobhub-logo.svg" />
              </span>
            </Link>
          </div> */}
        </div>
        <div className="footer-bottom mt-50">
          <div className="row">
            <div className="col-md-12">
              <span className="font-xs color-text-paragraph text-center">
                Copyright © {new Date().getFullYear()}. JobBox all right
                reserved
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
