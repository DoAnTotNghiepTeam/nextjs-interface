// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { applicantService } from "../services/applicant.service";

// type ApplyOptions = {
//   onUploadProgress?: (progress: number) => void;
// };

// export function useApplyJob() {
//   const [loading, setLoading] = useState(false);

//   const applyJob = async (jobId: string, data: FormData, options?: ApplyOptions) => {
//     try {
//       setLoading(true);

//       const res = await applicantService.applyJobWithFile(Number(jobId), data, {
//         onUploadProgress: (event: ProgressEvent) => {
//           if (event.total) {
//             const progress = Math.round((event.loaded * 100) / event.total);
//             options?.onUploadProgress?.(progress);
//           }
//         },
//       }) as any;

//       return res;
//     } catch (err) {
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { applyJob, loading };
// }
