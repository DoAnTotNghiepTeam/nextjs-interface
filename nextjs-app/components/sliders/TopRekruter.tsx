// "use client";
// import { Autoplay, Navigation } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// const data = [
//   {
//     img: "1.png",
//     title: "Avy",
//   },
//   {
//     img: "2.png",
//     title: "Mark",
//   },
//   {
//     img: "2.png",
//     title: "Mark",
//   },
// ];

// const TopRekruterSlider = () => {
//   return (
//     <>
//       <div className="swiper-container swiper-group-1 swiper-style-2">
//         <Swiper
//           slidesPerView={5}
//           spaceBetween={30}
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           modules={[Autoplay, Navigation]}
//           navigation={{
//             prevEl: ".swiper-button-prev-1",
//             nextEl: ".swiper-button-next-1",
//           }}
//           breakpoints={{
//             320: {
//               slidesPerView: 1,
//               spaceBetween: 30,
//             },
//             575: {
//               slidesPerView: 1,
//               spaceBetween: 30,
//             },
//             767: {
//               slidesPerView: 1,
//               spaceBetween: 30,
//             },
//             991: {
//               slidesPerView: 1,
//               spaceBetween: 30,
//             },
//             1199: {
//               slidesPerView: 1,
//               spaceBetween: 30,
//             },
//           }}
//           className="swiper-wrapper pt-5"
//         >
//           {data.map((item, i) => (
//             <SwiperSlide key={i}>
//               <div className="swiper-slide">
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-1.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Linkedin</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>68</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           25<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-2.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Adobe</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>42</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           17<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-3.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Dailymotion</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>46</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           65<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-4.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>NewSum</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>68</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           25<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-5.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>PowerHome</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>87</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           34<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-6.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Whop.com</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>34</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           56<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-7.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Greewood</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>124</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           78<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-8.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Kentucky</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>54</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           98<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-9.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Qeuity</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>76</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           9<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-10.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Honda</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>89</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           34<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-5.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Toyota</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>34</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           26<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-3.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Lexuxs</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>27</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           54<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-6.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Ondo</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>54</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           58<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-2.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Square</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>16</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           37<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div className="item-5 hover-up wow animate__animated animate__fadeIn">
//                   <a href="#">
//                     <div className="item-logo">
//                       <div className="image-left">
//                         <img alt="jobBox" src="/assets/imgs/brands/brand-8.png" />
//                       </div>
//                       <div className="text-info-right">
//                         <h4>Vista</h4>
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <img alt="jobBox" src="/assets/imgs/template/icons/star.svg" />
//                         <span className="font-xs color-text-mutted ml-10">
//                           <span>(</span>
//                           <span>97</span>
//                           <span>)</span>
//                         </span>
//                       </div>
//                       <div className="text-info-bottom mt-5">
//                         <span className="font-xs color-text-mutted icon-location">New York, US</span>
//                         <span className="font-xs color-text-mutted float-end mt-5">
//                           43<span> Open Jobs</span>
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//       <div className="swiper-button-next swiper-button-next-1" />
//       <div className="swiper-button-prev swiper-button-prev-1" />
//     </>
//   );
// };

// export default TopRekruterSlider;





"use client";
import { useEffect, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getAllCompany } from "@/lib/company/api";

interface Company {
  id: number;
  companyName: string;
  logoUrl?: string;
  location?: string;
}

const TopRekruterSlider = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getAllCompany();
        // Giả sử API trả về mảng trực tiếp
        const companyList = Array.isArray(res) ? res : res.data || [];
        setCompanies(companyList.slice(0, 15));
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <>
      <div className="swiper-container swiper-group-1 swiper-style-2">
        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev-1",
            nextEl: ".swiper-button-next-1",
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 30 },
            575: { slidesPerView: 2, spaceBetween: 30 },
            767: { slidesPerView: 3, spaceBetween: 30 },
            991: { slidesPerView: 4, spaceBetween: 30 },
            1199: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="swiper-wrapper pt-5"
        >
          {companies.map((company) => (
          <SwiperSlide key={company.id}>
  <div
    className="company-card d-flex flex-column justify-content-between p-3 hover-up wow animate__animated animate__fadeIn"
    style={{
      minHeight: 140, // gắn cứng chiều cao
      border: "1px solid #eee",
      borderRadius: 8,
      backgroundColor: "#fff",
    }}
  >
    {/* Logo + Tên */}
    <div className="d-flex align-items-center mb-2">
      <div
        className="logo-box me-2 d-flex align-items-center justify-content-center"
        style={{ width: 48, height: 48 }}
      >
        <img
          alt={company.companyName}
          src={company.logoUrl || "/assets/imgs/page/job-single/avatar.png"}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 8,
            objectFit: "contain",
          }}
        />
      </div>

      <div className="flex-grow-1">
        <h4
          className="mb-1"
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            lineHeight: "1.2rem",
            maxHeight: "2.4rem", // cho phép xuống 2 dòng
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={company.companyName}
        >
          {company.companyName}
        </h4>
        {/* Rating */}
        <div className="d-flex align-items-center">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              alt="star"
              src="/assets/imgs/template/icons/star.svg"
              style={{ width: 14, height: 14 }}
            />
          ))}
          <span className="font-xs color-text-mutted ms-2">(0)</span>
        </div>
      </div>
    </div>

    {/* Location + Open Jobs */}
    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
      <span className="font-xs color-text-mutted icon-location">
        {company.location || "Unknown"}
      </span>
      <span className="font-xs color-text-mutted">Open Jobs</span>
    </div>
  </div>
</SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-button-next swiper-button-next-1" />
      <div className="swiper-button-prev swiper-button-prev-1" />
    </>
  );
};

export default TopRekruterSlider;

