/* eslint-disable @next/next/no-img-element */
"use client";

import { useApplicants } from "../hooks/useApplicants";
// import ApplicantDetailModal from "@/features/applicants/components/ApplicantDetailModal";
// import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../../styles/ApplicantsTable.module.css";

export default function ApplicantsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI mặc định page = 1
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = 6;

  // Truyền (currentPage - 1) vào API vì backend zero-based
  const { applications, loading, totalPages, handleDeleteApplicant } =
    useApplicants(pageSize, currentPage - 1);

  // const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
  //   null
  // );
  //   // Khi lần đầu vào, nếu chưa có ?page thì set = 1
  // useEffect(() => {
  //   if (!searchParams.get("page")) {
  //     router.replace("?page=1");
  //   }
  // }, [searchParams, router]);

  if (loading) return <p>Loading...</p>;
  if (!applications || applications.length === 0)
    return <p>No applicants found.</p>;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className={styles.wrapper}>
        {applications.map((app) => (
          <div key={app.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.company}>
                {/* <div className={styles.logo}>
                  {app.logoUrl && <img src={app.logoUrl} alt="logo" />}
                </div> */}
                {/* <div className={styles.logo}>
                  {app.logoUrl ? (
                    <Image
                      src={app.logoUrl}
                      alt="logo"
                      width={58}
                      height={58}
                      className={styles.logoImg}
                      
                      unoptimized // tránh lỗi domain khi logoUrl là link ngoài
                    />
                  ) : (
                    <Image
                      src="/default-logo.png"
                      alt="default logo"
                      width={58}
                      height={58}
                      className={styles.logoImg}
                    />
                  )}
                </div> */}
                <div
                  className="image-box"
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                >
                  <img
                    src={
                      app?.logoUrl ||
                      "/assets/imgs/brands/brand-1.png"
                    }    
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: 8,
                      objectFit: "contain",
                      display: "block",
                      margin: "auto",
                    }}
                  />
                </div>
                <div className={styles.info}>
                  <span className={styles.companyName}>{app.companyName}</span>
                  <span className={styles.location}>
                    {app.location_company}
                  </span>
                </div>
              </div>
              <span className={styles.status}>{app.applicationStatus}</span>
            </div>

            <div className={styles.body}>
              <h4>{app.jobTitle}</h4>
              <div className={styles.meta}>
                <span>{app.appliedAt}</span>
                <span>• mins ago</span>
              </div>
              <p className={styles.description}>
                {app.description_company?.substring(0, 100)}
              </p>
            </div>

            <div className={styles.footer}>
              <span className={styles.salary}>{app.salaryRange}</span>
              <div className={styles.actions}>
                <button
                  className={`${styles.btn} ${styles.delete}`}
                  onClick={() => handleDeleteApplicant(app.id)}
                >
                  Delete
                </button>
                <button
                  className={`${styles.btn} ${styles.view}`}
                  onClick={() => router.push(`/applicants/${app.id}`)}
                >
                  View status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.pageBtn}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`${styles.pageBtn} ${
              currentPage === idx + 1 ? styles.active : ""
            }`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </>
  );
}
