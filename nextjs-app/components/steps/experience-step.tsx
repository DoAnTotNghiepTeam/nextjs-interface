"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { ResumeData } from "../resume-builder";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { DragDropList } from "../drag-drop-list";

export function ExperienceStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "experience",
  });

  const positionOptions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Marketing Manager",
    "Sales Manager",
    "Business Analyst",
    "Project Manager",
    "Quality Assurance",
    "System Administrator",
    "Database Administrator",
    "Mobile Developer",
    "Web Developer",
    "Technical Lead",
    "Team Lead",
    "Senior Developer",
    "Junior Developer",
    "Intern",
    "Freelancer",
    "Consultant",
    "Other",
  ];

  const addExperience = () => {
    append({
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  interface ExperienceField {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }
  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderExperienceItem = (
    field: ExperienceField,
    index: number,
    isDragging?: boolean
  ) => {
    return (
      <div
        key={field.id}
        className={`card mb-4 ${isDragging ? "shadow-lg" : ""}`}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Experience {index + 1}</h6>
          <button
            type="button"
            className="btn btn-link text-danger p-0"
            onClick={() => remove(index)}
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor={`company-${index}`}>
                Company *
              </label>
              <input
                id={`company-${index}`}
                className="form-control"
                {...register(`experience.${index}.company`, {
                  required: "Please enter company name",
                })}
                placeholder="Company name"
              />
              {errors.experience?.[index]?.company && (
                <div className="text-danger small">
                  {errors.experience[index].company.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor={`position-${index}`}>
                Position *
              </label>
              <select
                id={`position-${index}`}
                className="form-select"
                {...register(`experience.${index}.position`, {
                  required: "Please select a job position",
                })}
                value={watch(`experience.${index}.position`)}
                onChange={(e) =>
                  setValue(`experience.${index}.position`, e.target.value)
                }
                style={{
                  height: "calc(2.25rem + 13px)",
                  padding: "0.375rem 0.75rem",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  borderRadius: ".375rem",
                  border: "1px solid #ced4da",
                }}
              >
                <option value="" disabled>
                  Select a job position
                </option>
                {positionOptions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {errors.experience?.[index]?.position && (
                <div className="text-danger small">
                  {errors.experience[index].position.message}
                </div>
              )}
            </div>

            {/* Ngày bắt đầu & Ngày kết thúc cùng 1 hàng */}
            <div className="col-md-6">
              <label className="form-label" htmlFor={`startDate-${index}`}>
                Start Date *
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                className="form-control"
                {...register(`experience.${index}.startDate`, {
                  required: "Please enter start date",
                  validate: (startDate) => {
                    const endDate = watch(`experience.${index}.endDate`);
                    const today = new Date().toISOString().slice(0, 10);
                    if (endDate && startDate && startDate > endDate) {
                      return "Start date cannot be greater than end date";
                    }
                    if (startDate && startDate > today) {
                      return "Start date cannot be greater than today";
                    }
                    return true;
                  },
                })}
              />
              {errors?.experience?.[index]?.startDate && (
                <div className="text-danger small mt-1">
                  {errors.experience[index].startDate.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor={`endDate-${index}`}>
                End Date
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                className="form-control"
                {...register(`experience.${index}.endDate`, {
                  required: "Please enter end date",
                  validate: (endDate) => {
                    if (!endDate) return true;
                    const startDate = watch(`experience.${index}.startDate`);
                    const today = new Date().toISOString().slice(0, 10);
                    if (startDate && endDate < startDate) {
                      return "End date cannot be less than start date";
                    }
                    if (endDate > today) {
                      setValue(`experience.${index}.endDate`, today);
                    }
                    return true;
                  },
                })}
              />
              {errors?.experience?.[index]?.endDate && (
                <div className="text-danger small mt-1">
                  {errors.experience[index].endDate.message}
                </div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor={`description-${index}`}>
                Job Description
              </label>
              <textarea
                id={`description-${index}`}
                className="form-control"
                style={{ minHeight: 240 }}
                rows={8}
                {...register(`experience.${index}.description`)}
                placeholder="Detailed description of work, achievements..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="experience-step">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Briefcase size={20} />
          <h5 className="mb-0">Work Experience</h5>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
        >
          <Plus size={16} className="me-1" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Khi chưa có kinh nghiệm */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <Briefcase size={40} />
            </div>
            <p>No work experience yet. Add your first experience!</p>
          </div>
        </div>
      )}

      {/* Khi có kinh nghiệm */}
      {fields.length > 0 && (
        <div>
          <div className="mb-3 p-3 rounded border border-dashed text-center text-muted small">
            💡 Drag and drop to rearrange the order of experiences
          </div>

          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderExperienceItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}

      {/* CSS nhỏ cho placeholder */}
      <style jsx>{`
        .form-control::placeholder,
        .form-select::placeholder,
        textarea::placeholder {
          font-size: 0.875rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
