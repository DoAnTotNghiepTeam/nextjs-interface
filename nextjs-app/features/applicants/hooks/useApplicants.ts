"use client";
import { useEffect, useState } from "react";
import { applicantService } from "../services/applicant.service";
import { Applicant } from "@/types/applicant";
import { PaginatedResponse } from "@/types/api";
import { toast } from "react-toastify";

export const useApplicants = (pageSize: number, page: number) => {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await applicantService.getAllApplicantsByPage({
        page,
        size: pageSize,
      });
      const apiRes: PaginatedResponse<Applicant> = res.data;

      setApplications(apiRes.data ?? []);
      console.log("apiRes.totalPages", apiRes.data);
      setTotalPages(apiRes.totalPages ?? 1);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [page, pageSize]);

  const handleDeleteApplicant = async (id: number) => {
    try {
      const confirmed = confirm("Are you sure you want to delete this application??");
      if (!confirmed) return false;

      await applicantService.deleteApplicant(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));

      toast.success("Deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting applicant:", error);
      toast.error("Delete failed!");
      return false;
    }
  };

  return { applications, loading, totalPages, handleDeleteApplicant };
};
