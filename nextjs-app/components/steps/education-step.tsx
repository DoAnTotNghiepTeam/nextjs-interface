"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function EducationStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "education",
  });

  const degreeOptions = [
    "Ph.D",
    "Master",
    "Bachelor",
    "Engineer",
    "Associate",
    "Diploma",
    "Certificate",
    "Other",
  ];

  const majorOptions = [
    "Information Technology",
    "Computer Science",
    "Software Engineering",
    "Information Systems",
    "Cyber ​​Security",
    "Artificial Intelligence",
    "Data Science",
    "Others",
  ];

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    });
  };
  type EducationField = {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderEducationItem = (
    field: EducationField,
    index: number,
    isDragging?: boolean
  ) => (
    <div
      key={field.id}
      className={`card mb-4 ${isDragging ? "shadow-lg" : ""}`}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Education {index + 1}</h6>
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
            <label className="form-label" htmlFor={`institution-${index}`}>
              School *
            </label>
            <input
              id={`institution-${index}`}
              className="form-control"
              {...register(`education.${index}.institution`, {
                required: "Please enter school name",
              })}
              placeholder="School name"
            />
            {errors?.education?.[index]?.institution && (
              <div className="text-danger small">
                {errors.education[index].institution.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`degree-${index}`}>
              Degree *
            </label>
            <select
              id={`degree-${index}`}
              className="form-select"
              {...register(`education.${index}.degree`, {
                required: "Please select a degree",
              })}
              value={watch(`education.${index}.degree`) || ""}
              onChange={(e) =>
                setValue(`education.${index}.degree`, e.target.value)
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
              <option value="">Select a degree</option>
              {degreeOptions.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
            {errors?.education?.[index]?.degree && (
              <div className="text-danger small">
                {errors.education[index].degree.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`field-${index}`}>
              Major *
            </label>
            <select
              id={`field-${index}`}
              className="form-select"
              {...register(`education.${index}.field`, {
                required: "Please select a major",
              })}
              value={watch(`education.${index}.field`) || ""}
              onChange={(e) =>
                setValue(`education.${index}.field`, e.target.value)
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
              <option value="">Select a major</option>
              {majorOptions.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
            {errors?.education?.[index]?.field && (
              <div className="text-danger small">
                {errors.education[index].field.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`gpa-${index}`}>
              GPA
            </label>
            <input
              id={`gpa-${index}`}
              className="form-control"
              {...register(`education.${index}.gpa`, {
                validate: (value) => {
                  if (value === "" || value === undefined) return true;
                  const num = parseFloat(value);
                  if (isNaN(num)) return "Invalid GPA";
                  if (num < 0 || num > 4) return "GPA must be between 0 and 4";
                  return true;
                },
              })}
              placeholder="3.5/4.0"
            />
            {errors?.education?.[index]?.gpa && (
              <div className="text-danger small">
                {errors.education[index].gpa.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`startDate-${index}`}>
              Start Date *
            </label>
            <input
              type="date"
              id={`startDate-${index}`}
              className="form-control"
              {...register(`education.${index}.startDate`, {
                required: "Please enter a start date",
                validate: (startDate) => {
                  const endDate = watch(`education.${index}.endDate`);
                  const today = new Date().toISOString().slice(0, 10);
                  if (endDate && startDate && startDate > endDate) {
                    return "Start date must be before end date";
                  }
                  if (startDate && startDate > today) {
                    return "Start date must not be after today";
                  }
                  return true;
                },
              })}
            />
            {errors?.education?.[index]?.startDate && (
              <div className="text-danger small mt-1">
                {errors.education[index].startDate.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`endDate-${index}`}>
              End Date *
            </label>
            <input
              type="date"
              id={`endDate-${index}`}
              className="form-control"
              {...register(`education.${index}.endDate`, {
                required: "Please enter an end date",
                validate: (endDate) => {
                  if (!endDate) return true;
                  const startDate = watch(`education.${index}.startDate`);
                  const today = new Date().toISOString().slice(0, 10);
                  if (endDate < startDate)
                    return "End date must be after start date";
                  if (endDate > today) {
                    setValue(`education.${index}.endDate`, today);
                  }
                  return true;
                },
              })}
            />
            {errors?.education?.[index]?.endDate && (
              <div className="text-danger small mt-1">
                {errors.education[index].endDate.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="education-step">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <GraduationCap size={20} />
          <h5 className="mb-0">Education</h5>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
        >
          <Plus size={16} className="me-1" />
          Add Education
        </button>
      </div>

      {/* Khi chưa có học vấn */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <GraduationCap size={40} />
            </div>
            <p>
              No education information available. Please add your educational
              background!
            </p>
          </div>
        </div>
      )}

      {/* Khi có học vấn */}
      {fields.length > 0 && (
        <div>
          <div className="mb-3 p-3 rounded border border-dashed text-center text-muted small">
            💡Drag and drop to rearrange the order of education
          </div>

          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderEducationItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}

      {/* CSS nhỏ cho placeholder */}
      <style jsx>{`
        .form-control::placeholder,
        .form-select::placeholder {
          font-size: 0.875rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
