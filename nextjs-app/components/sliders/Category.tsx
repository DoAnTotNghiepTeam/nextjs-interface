"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { categoryApi, type CategoryResponseDto } from "../../lib/categorry/api";

const staticData = [
  { icon: "marketing.svg", count: 1526 },
  { icon: "customer.svg", count: 185 },
  { icon: "finance.svg", count: 168 },
  { icon: "lightning.svg", count: 1856 },
  { icon: "human.svg", count: 165 },
  { icon: "management.svg", count: 965 },
  { icon: "retail.svg", count: 563 },
  { icon: "security.svg", count: 254 },
  { icon: "content.svg", count: 142 },
  { icon: "research.svg", count: 532 },
  { icon: "it.svg", count: 243 },
];

const CategorySlider = () => {
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryApi.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (categories.length === 0) {
    return <div>No categories to display.</div>;
  }

  const displayData = categories.map((category, index) => ({
    ...category,
    icon: staticData[index % staticData.length].icon,
    count: staticData[index % staticData.length].count,
  }));

  return (
    <>
      <div className="swiper-container swiper-group-5 swiper">
        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          navigation={{
            prevEl: ".swiper-button-prev-style-2",
            nextEl: ".swiper-button-next-style-2",
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 30 },
            575: { slidesPerView: 2, spaceBetween: 30 },
            767: { slidesPerView: 3, spaceBetween: 30 },
            991: { slidesPerView: 4, spaceBetween: 30 },
            1199: { slidesPerView: 5, spaceBetween: 30 },
          }}
          modules={[Navigation, Autoplay]}
          className="swiper-wrapper pb-70 pt-5"
        >
          {displayData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="hover-up">
                <Link href={`/jobs-grid?category=${item.id}`}>
                  <span>
                    <div className="item-logo flex items-center gap-1">
                      <div className="image-left shrink-0 leading-none">
                        <Image
                          alt="jobBox"
                          src={`/assets/imgs/page/homepage1/${item.icon}`}
                          width={28}
                          height={28}
                          style={{ objectFit: "contain", display: "block" }}
                        />
                      </div>
                      <div className="text-info-right flex-1 min-w-0">
                        <h6 className="m-0 whitespace-nowrap">{item.name}</h6>
                        <p className="m-0 text-xs whitespace-nowrap">
                          {item.count}
                          <span> Jobs Available</span>
                        </p>
                      </div>
                    </div>
                  </span>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-button-next swiper-button-next-style-2" />
      <div className="swiper-button-prev swiper-button-prev-style-2" />

      <style jsx>{`
        .item-logo {
          display: flex;
          align-items: center;
          padding: 15px 6px !important; /* Giảm padding cho item */
          //gap: 12px;
        }
        .image-left {
          flex: 0 0 auto;
          line-height: 0;
        }
        .text-info-right {
          flex: 1 1 auto;
          min-width: 0;
        }
        .text-info-right h6,
        .text-info-right p {
          margin: 0;
          white-space: normal;
          word-break: break-word;
        }
      `}</style>
    </>
  );
};

export default CategorySlider;
