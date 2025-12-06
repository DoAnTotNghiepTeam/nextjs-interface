"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Award } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function AwardsStep() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "awards",
  });

  const addAward = () => {
    append({
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
      description: "",
    });
  };
  type AwardField = {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderAwardItem = (
    field: AwardField,
    index: number,
    isDragging?: boolean
  ) => (
    <div
      key={field.id}
      className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Awards {index + 1}</h6>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => remove(index)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor={`awardTitle-${index}`} className="form-label">
              Award Title *
            </label>
            <input
              id={`awardTitle-${index}`}
              type="text"
              className="form-control"
              placeholder="Excellent student, TOEIC certificate..."
              {...register(`awards.${index}.title`, {
                required: "Please enter the award title",
              })}
            />
            {errors?.awards?.[index]?.title && (
              <div className="text-danger small">
                {errors.awards[index].title.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor={`issuer-${index}`} className="form-label">
              Issuing Organization *
            </label>
            <input
              id={`issuer-${index}`}
              type="text"
              className="form-control"
              placeholder="School, organization..."
              {...register(`awards.${index}.issuer`, {
                required: "Please enter the issuing organization",
              })}
            />
            {errors?.awards?.[index]?.issuer && (
              <div className="text-danger small">
                {errors.awards[index].issuer.message}
              </div>
            )}
          </div>

          <div className="col-md-12">
            <label htmlFor={`awardDate-${index}`} className="form-label">
              Award Date *
            </label>
            <input
              id={`awardDate-${index}`}
              type="date"
              className="form-control"
              {...register(`awards.${index}.date`, {
                required: "Please enter the award date",
                validate: (date) => {
                  if (!date) return true;
                  const today = new Date().toISOString().slice(0, 10);
                  if (date > today) {
                    setValue(`awards.${index}.date`, today);
                  }
                  return true;
                },
              })}
            />
            {errors?.awards?.[index]?.date && (
              <div className="text-danger small">
                {errors.awards[index].date.message}
              </div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor={`awardDescription-${index}`} className="form-label">
              Description
            </label>
            <textarea
              id={`awardDescription-${index}`}
              style={{ minHeight: 200 }}
              rows={2}
              className="form-control"
              placeholder="Detailed description of the award..."
              {...register(`awards.${index}.description`)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Award size={20} />
          <h5 className="mb-0">Awards & Certifications</h5>
        </div>
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={addAward}
        >
          <Plus size={16} /> Add Award
        </button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <Award size={40} />
            </div>
            <p>
              No awards have been added yet. Please add your awards and
              certifications!
            </p>
          </div>
        </div>
      )}

      {/* List with drag-drop */}
      {fields.length > 0 && (
        <div>
          <div className="alert alert-secondary text-center small mb-3">
            💡 Drag and drop to reorder awards
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderAwardItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  );
}
