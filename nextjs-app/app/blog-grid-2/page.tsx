/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"
import Layout from "@/components/Layout/Layout"
import { blogApiServer } from "../../lib/blog/blog-api-server"
import "./blog-grid.css"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const getReadTime = (content: string) => {
  const wordsPerMinute = 200
  const wordCount = content.split(" ").length
  return Math.ceil(wordCount / wordsPerMinute)
}

export default async function BlogGrid2() {
  try {
    const blogs = await blogApiServer.getAllBlogs()
    const featuredBlog = blogs.length > 0 ? blogs[0] : null

    if (!blogs || blogs.length === 0) {
      return (
        <Layout>
          <div className="section-box">
            <div className="container">
              <div className="text-center">
                <div className="alert alert-info" role="alert">
                  Không có bài viết nào để hiển thị.
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )
    }

    return (
      <Layout>
        <div>
          <section className="section-box">
            <div className="breacrumb-cover">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <h2 className="mb-10">Articles / News</h2>
                    <p className="font-lg color-text-paragraph-2">Get the latest news, updates and tips</p>
                  </div>
                  <div className="col-lg-6 text-end">
                    <ul className="breadcrumbs mt-40">
                      <li>
                        <Link href="index">
                          <span className="home-icon">Home</span>
                        </Link>
                      </li>
                      <li>Blog</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Blog Section */}
          {featuredBlog && (
            <section className="section-box mt-50">
              <div className="container">
                <div className="box-improve">
                  <div className="row">
                    <div className="col-lg-5 col-md-12 col-sm-12">
                      <Link href={`/blog/${featuredBlog.slug}`}>
                        <span>
                          <img
                            src={
                              featuredBlog.imageUrl || "assets/imgs/page/job-single-2/img2.png" || "/placeholder.svg"
                            }
                            alt={featuredBlog.title}
                          />
                        </span>
                      </Link>
                    </div>
                    <div className="col-lg-7 col-md-12 col-sm-12">
                      <div className="pt-40 pb-30 pl-30 pr-30">
                        <Link href="blog-grid">
                          <span className="btn btn-tag">{featuredBlog.category.name}</span>
                        </Link>

                        <h2 className="mt-20 mb-20">
                          <Link href={`/blog-details?slug=${featuredBlog.slug}`}>
                            <span>{featuredBlog.title}</span>
                          </Link>
                        </h2>
                        <p className="font-md mb-20">
                          {featuredBlog.summary || featuredBlog.content.substring(0, 200) + "..."}
                        </p>
                        <div>
                          <Link href={`/blog-details?slug=${featuredBlog.slug}`}>
                            <span className="btn btn-arrow-right">Read More</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="section-box mt-50">
            <div className="post-loop-grid">
              <div className="container">
                <div className="text-left">
                  <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Latest Posts</h2>
                  <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                    Don't miss the trending news
                  </p>
                </div>
                <div className="row mt-30 latest-posts">
                  <div className="col-lg-8">
                    <div className="row">
                      {blogs.slice(1).map((blog) => (
                        <div key={blog.id} className="col-lg-6 mb-30 d-flex">
                          <div className="card-grid-3 hover-up w-100 latest-card">
                            <div className="text-center card-grid-3-image">
                              <Link href={`/blog-details?slug=${blog.slug}`}>
                                <span>
                                  <figure>
                                    <img
                                      alt={blog.title}
                                      src={
                                        blog.imageUrl || "assets/imgs/page/job-single-2/img3.png" || "/placeholder.svg"
                                      }
                                    />
                                  </figure>
                                </span>
                              </Link>
                            </div>
                            <div className="card-block-info">
                              <div className="tags mb-15">
                                <Link href="blog-grid">
                                  <span className="btn btn-tag">{blog.category.name}</span>
                                </Link>
                              </div>
                              <h5>
                                <Link href={`/blog-details?slug=${blog.slug}`}>
                                  <span>{blog.title}</span>
                                </Link>
                              </h5>
                              <p className="mt-10 color-text-paragraph font-sm lp-line-clamp-4">
                                {blog.summary || blog.content.substring(0, 150) + "..."}
                              </p>
                              <div className="card-2-bottom mt-20">
                                <div className="row">
                                  <div className="col-lg-6 col-6">
                                    <div className="d-flex">
                                      <div className="info-right-img">
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
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="paginations">
                      <ul className="pager">
                        <li>
                          <a className="pager-prev" href="#" />
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number active">1</span>
                          </Link>
                        </li>
                        <li>
                          <a className="pager-next" href="#" />
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                    <div className="widget_search mb-40">
                      <div className="search-form">
                        <form action="#">
                          <input type="text" placeholder="Search" />
                          <button type="submit">
                            <i className="fi-rr-search" />
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="sidebar-shadow sidebar-news-small">
                      <h5 className="sidebar-title">Trending Now</h5>
                      <div className="post-list-small">
                        {blogs.slice(0, 5).map((blog) => (
                          <div key={blog.id} className="post-list-small-item d-flex align-items-start">
                            <figure className="thumb mr-15">
                              <a href={`/blog-details?slug=${blog.slug}`}>
                                <img
                                  src={blog.imageUrl || "assets/imgs/page/blog/img-trending.png" || "/placeholder.svg"}
                                  alt={blog.title}
                                />
                              </a>
                            </figure>
                            <div className="content">
                              <h5>
                                <a href={`/blog-details?slug=${blog.slug}`}>{blog.title}</a>
                              </h5>
                              <div className="post-meta text-muted d-flex align-items-center mb-15">
                                <div className="author d-flex align-items-center mr-20"></div>
                                <div className="date">
                                  <span>{formatDate(blog.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sidebar-border-bg bg-right">
                      <span className="text-grey">WE ARE</span>
                      <span className="text-hiring">HIRING</span>
                      <p className="font-xxs color-text-paragraph mt-5">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto
                      </p>
                      <div className="mt-15">
                        <Link href="#">
                          <span className="btn btn-paragraph-2">Know More</span>
                        </Link>
                      </div>
                    </div>

                    <div className="sidebar-shadow sidebar-news-small">
                      <h5 className="sidebar-title">Gallery</h5>
                      <div className="post-list-small">
                        <ul className="gallery-3">
                          {blogs.map((blog) => (
                            <li key={blog.id}>
                              <Link href={`/blog-details?slug=${blog.slug}`}>
                                <span>
                                  <img
                                    src={blog.imageUrl || "assets/imgs/page/blog/gallery1.png" || "/placeholder.svg"}
                                    alt={blog.title}
                                  />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
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
    )
  } catch (error) {
    console.error("Error loading blogs:", error)
    return (
      <Layout>
        <div className="section-box">
          <div className="container">
            <div className="text-center">
              <div className="alert alert-danger" role="alert">
                Có lỗi xảy ra khi tải dữ liệu blog. Vui lòng thử lại sau.
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
