"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Users } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function ActivitiesStep() {
  const {
    register,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  const addActivity = () => {
    append({
      id: Date.now().toString(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  interface ActivityField {
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderActivityItem = (
    field: ActivityField,
    index: number,
    isDragging?: boolean
  ) => (
    <div
      className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
      key={field.id}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Personal Projects {index + 1}</h6>
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
            <label htmlFor={`activityTitle-${index}`} className="form-label">
              Project Name *
            </label>
            <input
              type="text"
              id={`activityTitle-${index}`}
              className="form-control"
              {...register(`activities.${index}.title`, {
                required: "Please enter the activity name",
              })}
              placeholder="Volunteer, Club President..."
            />
            {errors?.activities?.[index]?.title && (
              <div className="text-danger small">
                {errors.activities[index].title.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor={`organization-${index}`} className="form-label">
              Role *
            </label>
            <input
              type="text"
              id={`organization-${index}`}
              className="form-control"
              {...register(`activities.${index}.organization`, {
                required: "Please enter the organization name",
              })}
              placeholder="Organization name, club..."
            />
            {errors?.activities?.[index]?.organization && (
              <div className="text-danger small">
                {errors.activities[index].organization.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label
              htmlFor={`activityStartDate-${index}`}
              className="form-label"
            >
              Start Date *
            </label>
            <input
              type="date"
              id={`activityStartDate-${index}`}
              className="form-control"
              {...register(`activities.${index}.startDate`, {
                required: "Please select a start date",
                validate: (startDate) => {
                  const endDate = watch(`activities.${index}.endDate`);
                  const today = new Date().toISOString().slice(0, 10);
                  if (startDate > today) return "Cannot be in the future";
                  if (endDate && startDate > endDate)
                    return "Start date must be before end date";
                  return true;
                },
              })}
            />
            {errors?.activities?.[index]?.startDate && (
              <div className="text-danger small mt-1">
                {errors.activities[index].startDate.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor={`activityEndDate-${index}`} className="form-label">
              End Date
            </label>
            <input
              type="date"
              id={`activityEndDate-${index}`}
              className="form-control"
              {...register(`activities.${index}.endDate`, {
                required: "Please select an end date",
                validate: (endDate) => {
                  if (!endDate) return true;
                  const today = new Date().toISOString().slice(0, 10);
                  if (endDate > today) {
                    setValue(`activities.${index}.endDate`, today);
                  }
                  return true;
                },
              })}
            />
            {errors?.activities?.[index]?.endDate && (
              <div className="text-danger small mt-1">
                {errors.activities[index].endDate.message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <label
            htmlFor={`activityDescription-${index}`}
            className="form-label"
          >
            Description
          </label>
          <textarea
            id={`activityDescription-${index}`}
            className="form-control"
            style={{ minHeight: 200 }}
            {...register(`activities.${index}.description`)}
            placeholder="Describe your activity and role..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Users size={20} />
          <h5 className="mb-0">Personal Projects</h5>
        </div>
        <button
          type="button"
          onClick={addActivity}
          className="btn btn-primary d-flex align-items-center gap-1"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {fields.length === 0 && (
        <div className="card text-center">
          <div className="card-body py-5 d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <Users size={40} className="text-secondary" />
            </div>
            <p className="text-muted">
              No activities have been added yet. Please add your extracurricular
              activities!
            </p>
          </div>
        </div>
      )}

      {fields.length > 0 && (
        <div>
          <div className="alert alert-secondary text-center mb-3">
            💡 Drag and drop to reorder projects
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderActivityItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  );
}
