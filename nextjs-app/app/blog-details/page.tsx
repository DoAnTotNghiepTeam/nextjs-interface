"use client";
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { blogApi, type BlogResponseDto } from "@/lib/blog/blog-api";

export default function BlogDetails() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [blog, setBlog] = useState<BlogResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) {
        setError("Không tìm thấy slug của bài viết");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await blogApi.getBlogBySlug(slug);
        setBlog(data);
      } catch {
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-box">
          <div className="container text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="section-box">
          <div className="container">
            <div className="alert alert-danger" role="alert">
              {error || "Bài viết không tồn tại"}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <section className="section-box">
          <div>
            <img
              src={blog.imageUrl || "assets/imgs/page/blog/img-single.png"}
              alt={blog.title}
            />
          </div>
        </section>
        <section className="section-box">
          <div className="archive-header pt-50 text-center">
            <div className="container">
              <div className="box-white">
                <div className="max-width-single">
                  <Link href="blog-grid">
                    <span className="btn btn-tag">
                      {blog.category?.name || "Blog"}
                    </span>
                  </Link>

                  <h2 className="mb-30 mt-20 text-center">{blog.title}</h2>
                  <div className="post-meta text-muted d-flex align-items-center mx-auto justify-content-center">
                    <div className="date">
                      <span className="font-xs color-text-paragraph-2 mr-20 d-inline-block">
                        <img
                          className="img-middle mr-5"
                          src="assets/imgs/page/blog/calendar.svg"
                          alt="calendar"
                        />{" "}
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="font-xs color-text-paragraph-2 d-inline-block">
                        <img
                          className="img-middle mr-5"
                          src="assets/imgs/template/icons/time.svg"
                          alt="time"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="post-loop-grid">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="single-body">
                  <div className="max-width-single">
                    <div className="content-single">
                      <div
                        className="font-md"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
