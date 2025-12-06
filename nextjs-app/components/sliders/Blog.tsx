"use client";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { blogApi, type BlogResponseDto } from "@/lib/blog/blog-api";

const BlogSlider = () => {
  const [blogs, setBlogs] = useState<BlogResponseDto[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await blogApi.getAllBlogs();
        // Lấy 6 bài blog đầu tiên để hiển thị
        setBlogs(blogsData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <>
      <div className="swiper-container swiper-group-3 swiper">
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".swiper-button-prev-style-2",
            nextEl: ".swiper-button-next-style-2",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            575: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            991: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1199: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[Navigation, Autoplay]}
          className="swiper-wrapper pb-70 pt-5"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id}>
              <div className="swiper-slide">
                <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                  <div className="text-center card-grid-3-image">
                    <Link href={`/blog-details?id=${blog.id}`}>
                      <span>
                        <figure>
                          <img
                            style={{
                              width: "100%",
                              height: "220px",
                              objectFit: "cover",
                            }}
                            alt={blog.title}
                            src={
                              blog.imageUrl ||
                              "/assets/imgs/page/homepage1/img-news1.png"
                            }
                          />
                        </figure>
                      </span>
                    </Link>
                  </div>
                  <div className="card-block-info">
                    <div className="tags mb-15">
                      <Link href="/blog-grid-2">
                        <span className="btn btn-tag">
                          {blog.category.name}
                        </span>
                      </Link>
                    </div>
                    <h5>
                      <Link href={`/blog-details?id=${blog.id}`}>
                        <span>{blog.title}</span>
                      </Link>
                    </h5>
                    <p className="mt-10 color-text-paragraph font-sm truncate-6-lines">
                      {blog.summary || blog.content}
                    </p>
                    <div className="card-2-bottom mt-20">
                      <div className="row">
                        <div className="col-lg-6 col-6">
                          <div className="d-flex">
                            <div className="info-right-img">
                              <span className="font-sm font-bold color-brand-1 op-70">
                                {"Admin"}
                              </span>
                              <br />
                              <span className="font-xs color-text-paragraph-2">
                                {formatDate(blog.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 text-end col-6 pt-15">
                          <span className="color-text-paragraph-2 font-xs">
                            {getReadTime(blog.content)} mins to read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="swiper-button-next swiper-button-next-style-2" />
      <div className="swiper-button-prev swiper-button-prev-style-2" />
      <style jsx>{`
        .swiper-slide {
          height: auto; /* Cho phép slide co giãn chiều cao */
        }
        .card-grid-3 {
          display: flex;
          flex-direction: column;
          height: 100%; /* Card sẽ lấp đầy chiều cao của slide */
        }

        .card-block-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1; /* Khối nội dung sẽ lấp đầy không gian trống */
        }

        .card-2-bottom {
          margin-top: auto; /* Đẩy chân card xuống dưới cùng */
        }
        .card-block-info h5 {
          min-height: 4.5em; /* Đảm bảo chiều cao tối thiểu cho 3 dòng */
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* Giới hạn 3 dòng */
          -webkit-box-orient: vertical;
        }
        .truncate-6-lines {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 6; /* Số dòng hiển thị */
          -webkit-box-orient: vertical;
        }
      `}</style>
    </>
  );
};

export default BlogSlider;
