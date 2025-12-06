export async function fetchRecommendedJobs(candidateId: number, limit = 10, minScore = 30) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/recommend/${candidateId}?limit=${limit}&minScore=${minScore}`,
      { cache: "no-store" } // tránh cache khi dev
    );
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return await res.json();
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return null;
  }
}