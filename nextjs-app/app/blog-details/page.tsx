import Link from "next/link"
import Layout from "@/components/Layout/Layout"
import { blogApiServer, type BlogResponseDto } from "../../lib/blog/blog-api-server"

export default async function BlogDetails({ searchParams }: { searchParams: { slug: string } }) {
  const { slug } = searchParams

  if (!slug) {
    return (
      <Layout>
        <div className="section-box">
          <div className="container">
            <div className="alert alert-warning mt-50" role="alert">
              Không tìm thấy slug của bài viết
            </div>
            <Link href="/blog-grid-2" className="btn btn-default">
              Quay lại danh sách blog
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  try {
    console.log("Fetching blog with slug:", slug)
    const blog: BlogResponseDto | null = await blogApiServer.getBlogBySlug(slug)

    if (!blog) {
      return (
        <Layout>
          <div className="section-box">
            <div className="container">
              <div className="alert alert-danger mt-50" role="alert">
                Không thể tải bài viết với slug: {slug}
              </div>
              <Link href="/blog-grid-2" className="btn btn-default">
                Quay lại danh sách blog
              </Link>
            </div>
          </div>
        </Layout>
      )
    }

    const formatDate = (dateString?: string) => {
      if (!dateString) return ""
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }

    return (
      <Layout>
        <section className="section-box">
          <div>
            <img
              src={blog.imageUrl || "assets/imgs/page/blog/img-single.png"}
              alt={blog.title}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        <section className="section-box">
          <div className="archive-header pt-50 text-center">
            <div className="container">
              <div className="box-white">
                <div className="max-width-single">
                  <Link href="/blog-grid-2">
                    <span className="btn btn-tag">{blog.category?.name || "Blog"}</span>
                  </Link>

                  <h2 className="mb-30 mt-20 text-center">{blog.title}</h2>

                  <div className="post-meta text-muted d-flex align-items-center mx-auto justify-content-center">
                    <div className="date">
                      <span className="font-xs color-text-paragraph-2 mr-20 d-inline-block">
                        <img
                          className="img-middle mr-5"
                          src="/assets/imgs/page/blog/calendar.svg"
                          alt="calendar"
                        />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="font-xs color-text-paragraph-2 d-inline-block">
                        <img
                          className="img-middle mr-5"
                          src="/assets/imgs/template/icons/time.svg"
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
                    {blog.summary && (
                      <div
                        className="font-lg color-text-paragraph-2 mb-30"
                        style={{
                          padding: "20px",
                          background: "#f8f9fa",
                          borderLeft: "4px solid #3C65F5",
                          borderRadius: "4px",
                        }}
                      >
                        {blog.summary}
                      </div>
                    )}

                    <div className="content-single">
                      <div className="font-md" dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>

                    <div className="mt-50">
                      <Link href="/blog-grid-2" className="btn btn-default">
                        ← Quay lại danh sách blog
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  } catch (error) {
    console.error("Error loading blog details:", error)
    return (
      <Layout>
        <div className="section-box">
          <div className="container">
            <div className="alert alert-danger mt-50" role="alert">
              Có lỗi xảy ra khi tải bài viết: {error instanceof Error ? error.message : "Unknown error"}
            </div>
            <Link href="/blog-grid-2" className="btn btn-default">
              Quay lại danh sách blog
            </Link>
          </div>
        </div>
      </Layout>
    )
  }
}
