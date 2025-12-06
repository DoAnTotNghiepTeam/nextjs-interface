// "use client";
// /* eslint-disable */
// import { useFormContext, useFieldArray } from "react-hook-form";
// import type { ResumeData } from "../resume-builder";
// import { Plus, Trash2, Zap } from "lucide-react";
// import { DragDropList } from "../drag-drop-list";

// export function SkillsStep() {
//   const { register, control } = useFormContext<ResumeData>();
//   const { fields, append, remove, move } = useFieldArray({
//     control,
//     name: "skills",
//   });

//   const addSkill = () => {
//     append(""); // thêm kỹ năng rỗng
//   };

//   const handleReorder = (oldIndex: number, newIndex: number) => {
//     move(oldIndex, newIndex);
//   };

//   const skillOptions = [
//     "JavaScript",
//     "TypeScript",
//     "React",
//     "Node.js",
//     "Python",
//     "Java",
//     "C#",
//     "SQL",
//     "HTML",
//     "CSS",
//     "Photoshop",
//     "Illustrator",
//     "Figma",
//     "Excel",
//     "Word",
//     "PowerPoint",
//     "Marketing",
//     "SEO",
//     "Quản lý dự án",
//     "Giao tiếp",
//     "Làm việc nhóm",
//     "Lãnh đạo",
//     "Giải quyết vấn đề",
//     "Khác",
//   ];
//   const renderSkillItem = (field: any, index: number, isDragging?: boolean) => (
//     <div
//       key={field.id}
//       className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
//     >
//       <div className="card-header d-flex justify-content-between align-items-center">
//         <h6 className="mb-0">Kỹ năng {index + 1}</h6>
//         <button
//           type="button"
//           className="btn btn-outline-danger btn-sm"
//           onClick={() => remove(index)}
//         >
//           <Trash2 size={16} />
//         </button>
//       </div>
//       <div className="card-body">
//         <div className="mb-3">
//           <label htmlFor={`skill-${index}`} className="form-label">
//             Tên kỹ năng *
//           </label>
//           <select
//             id={`skill-${index}`}
//             {...register(`skills.${index}`, { required: true })}
//             className="form-select"
//             defaultValue={field.value || ""}
//           >
//             <option value="">Chọn kỹ năng</option>
//             {skillOptions.map((skill) => (
//               <option key={skill} value={skill}>
//                 {skill}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="mb-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="d-flex align-items-center gap-2">
//           <Zap size={20} />
//           <h5 className="mb-0">Kỹ năng</h5>
//         </div>
//         <button
//           type="button"
//           onClick={addSkill}
//           className="btn btn-primary d-flex align-items-center gap-2"
//         >
//           <Plus size={16} />
//           Thêm kỹ năng
//         </button>
//       </div>

//       {/* Trường hợp chưa có skill */}
//       {fields.length === 0 && (
//         <div className="card text-center">
//           <div className="card-body py-5 d-flex flex-column align-items-center justify-content-center">
//             <div
//               className="d-flex align-items-center justify-content-center mb-3"
//               style={{ width: 56, height: 56 }}
//             >
//               <Zap size={40} className="text-muted" />
//             </div>
//             <p className="text-muted">
//               Chưa có kỹ năng nào. Hãy thêm những kỹ năng của bạn!
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Có skill */}
//       {fields.length > 0 && (
//         <div>
//           <div
//             className="alert alert-secondary text-center py-2 mb-3"
//             style={{ border: "2px dashed #ccc" }}
//           >
//             💡 Kéo và thả để sắp xếp lại thứ tự kỹ năng
//           </div>

//           <DragDropList
//             items={fields}
//             onReorder={handleReorder}
//             renderItem={renderSkillItem}
//             keyExtractor={(field) => field.id}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

////////// lần 2 ///////

// "use client";
// /* eslint-disable */
// import { useFormContext, useFieldArray } from "react-hook-form";
// import type { ResumeData } from "../resume-builder";
// import { Plus, Trash2, Zap, Check } from "lucide-react";
// import { DragDropList } from "../drag-drop-list";
// import { useState } from "react";

// export function SkillsStep() {
//   const { register, control, watch, setValue } = useFormContext<ResumeData>();
//   const { fields, append, remove, move } = useFieldArray({
//     control,
//     name: "skills",
//   });

//   const [customSkill, setCustomSkill] = useState<Record<number, string>>({});

//   const addSkill = () => {
//     append(""); // thêm kỹ năng rỗng
//   };

//   const handleReorder = (oldIndex: number, newIndex: number) => {
//     move(oldIndex, newIndex);
//   };

//   const skillOptions = [
//     "JavaScript",
//     "TypeScript",
//     "React",
//     "Node.js",
//     "Python",
//     "Java",
//     "C#",
//     "SQL",
//     "HTML",
//     "CSS",
//     "Photoshop",
//     "Illustrator",
//     "Figma",
//     "Excel",
//     "Word",
//     "PowerPoint",
//     "Marketing",
//     "SEO",
//     "Quản lý dự án",
//     "Giao tiếp",
//     "Làm việc nhóm",
//     "Lãnh đạo",
//     "Giải quyết vấn đề",
//     "Khác",
//   ];

//   const renderSkillItem = (field: any, index: number, isDragging?: boolean) => {
//     const currentValue = watch(`skills.${index}`);

//     return (
//       <div
//         key={field.id}
//         className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
//       >
//         <div className="card-header d-flex justify-content-between align-items-center">
//           <h6 className="mb-0">Kỹ năng {index + 1}</h6>
//           <button
//             type="button"
//             className="btn btn-outline-danger btn-sm"
//             onClick={() => remove(index)}
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="card-body">
//           <div className="mb-3">
//             <label htmlFor={`skill-${index}`} className="form-label">
//               Tên kỹ năng *
//             </label>
//             <select
//               id={`skill-${index}`}
//               {...register(`skills.${index}`, { required: true })}
//               className="form-select"
//               defaultValue={field.value || ""}
//             >
//               <option value="">Chọn kỹ năng</option>
//               {skillOptions.map((skill) => (
//                 <option key={skill} value={skill}>
//                   {skill}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Nếu chọn "Khác" thì hiện input + nút Thêm */}
//           {currentValue === "Khác" && (
//             <div className="mb-3">
//               <label className="form-label">Nhập kỹ năng của bạn</label>
//               <div className="d-flex gap-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Nhập kỹ năng"
//                   value={customSkill[index] || ""}
//                   onChange={(e) =>
//                     setCustomSkill((prev) => ({
//                       ...prev,
//                       [index]: e.target.value,
//                     }))
//                   }
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-success d-flex align-items-center gap-1"
//                   onClick={() => {
//                     const value = customSkill[index]?.trim();
//                     if (value) {
//                       // ✅ chỉ set string, không set object
//                       setValue(`skills.${index}`, value, {
//                         shouldValidate: true,
//                         shouldDirty: true,
//                       });
//                       // reset input
//                       setCustomSkill((prev) => ({ ...prev, [index]: "" }));
//                     }
//                   }}
//                 >
//                   <Check size={16} /> Thêm
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="mb-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="d-flex align-items-center gap-2">
//           <Zap size={20} />
//           <h5 className="mb-0">Kỹ năng</h5>
//         </div>
//         <button
//           type="button"
//           onClick={addSkill}
//           className="btn btn-primary d-flex align-items-center gap-2"
//         >
//           <Plus size={16} />
//           Thêm kỹ năng
//         </button>
//       </div>

//       {/* Trường hợp chưa có skill */}
//       {fields.length === 0 && (
//         <div className="card text-center">
//           <div className="card-body py-5 d-flex flex-column align-items-center justify-content-center">
//             <div
//               className="d-flex align-items-center justify-content-center mb-3"
//               style={{ width: 56, height: 56 }}
//             >
//               <Zap size={40} className="text-muted" />
//             </div>
//             <p className="text-muted">
//               Chưa có kỹ năng nào. Hãy thêm những kỹ năng của bạn!
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Có skill */}
//       {fields.length > 0 && (
//         <div>
//           <div
//             className="alert alert-secondary text-center py-2 mb-3"
//             style={{ border: "2px dashed #ccc" }}
//           >
//             💡 Kéo và thả để sắp xếp lại thứ tự kỹ năng
//           </div>

//           <DragDropList
//             items={fields}
//             onReorder={handleReorder}
//             renderItem={renderSkillItem}
//             keyExtractor={(field) => field.id}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

/// ----- lần 3 ----- ///

// "use client";
// /* eslint-disable */
// import { useFormContext, useFieldArray } from "react-hook-form";
// import type { ResumeData } from "../resume-builder";
// import { Plus, Trash2, Zap, Check } from "lucide-react";
// import { DragDropList } from "../drag-drop-list";
// import { useState } from "react";

// export function SkillsStep() {
//   const { register, control, watch, setValue } = useFormContext<ResumeData>();
//   const { fields, append, remove, move } = useFieldArray({
//     control,
//     name: "skills",
//   });

//   const [customSkill, setCustomSkill] = useState<Record<number, string>>({});

//   const addSkill = () => {
//     append(""); // thêm kỹ năng rỗng
//   };

//   const handleReorder = (oldIndex: number, newIndex: number) => {
//     move(oldIndex, newIndex);
//   };

//   const skillOptions = [
//     "JavaScript",
//     "TypeScript",
//     "React",
//     "Node.js",
//     "Python",
//     "Java",
//     "C#",
//     "SQL",
//     "HTML",
//     "CSS",
//     "Photoshop",
//     "Illustrator",
//     "Figma",
//     "Excel",
//     "Word",
//     "PowerPoint",
//     "Marketing",
//     "SEO",
//     "Quản lý dự án",
//     "Giao tiếp",
//     "Làm việc nhóm",
//     "Lãnh đạo",
//     "Giải quyết vấn đề",
//     "Khác",
//   ];

//   const renderSkillItem = (field: any, index: number, isDragging?: boolean) => {
//     const currentValue = watch(`skills.${index}`);

//     return (
//       <div
//         key={field.id}
//         className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
//       >
//         <div className="card-header d-flex justify-content-between align-items-center">
//           <h6 className="mb-0">Kỹ năng {index + 1}</h6>
//           <button
//             type="button"
//             className="btn btn-outline-danger btn-sm"
//             onClick={() => remove(index)}
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>

//         <div className="card-body">
//           <div className="mb-3">
//             <label htmlFor={`skill-${index}`} className="form-label">
//               Tên kỹ năng *
//             </label>

//             <select
//               id={`skill-${index}`}
//               {...register(`skills.${index}`, { required: true })}
//               className="form-select"
//               value={currentValue || ""}
//               onChange={(e) => setValue(`skills.${index}`, e.target.value)}
//             >
//               <option value="">Chọn kỹ năng</option>
//               {skillOptions.map((skill) => (
//                 <option key={skill} value={skill}>
//                   {skill}
//                 </option>
//               ))}

//               {/* Nếu value hiện tại không nằm trong skillOptions thì tạo option hidden */}
//               {currentValue &&
//                 !skillOptions.includes(currentValue) && (
//                   <option value={currentValue} hidden>
//                     {currentValue}
//                   </option>
//                 )}
//             </select>
//           </div>

//           {/* Nếu chọn "Khác" thì hiện input + nút Thêm */}
//           {currentValue === "Khác" && (
//             <div className="mb-3">
//               <label className="form-label">Nhập kỹ năng của bạn</label>
//               <div className="d-flex gap-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Nhập kỹ năng"
//                   value={customSkill[index] || ""}
//                   onChange={(e) =>
//                     setCustomSkill((prev) => ({
//                       ...prev,
//                       [index]: e.target.value,
//                     }))
//                   }
//                 />
//                 <button
//                   type="button"
//                   className="btn btn-success d-flex align-items-center gap-1"
//                   onClick={() => {
//                     const value = customSkill[index]?.trim();
//                     if (value) {
//                       setValue(`skills.${index}`, value, {
//                         shouldValidate: true,
//                         shouldDirty: true,
//                       });
//                       // reset input
//                       setCustomSkill((prev) => ({ ...prev, [index]: "" }));
//                     }
//                   }}
//                 >
//                   <Check size={16} /> Thêm
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="mb-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="d-flex align-items-center gap-2">
//           <Zap size={20} />
//           <h5 className="mb-0">Kỹ năng</h5>
//         </div>
//         <button
//           type="button"
//           onClick={addSkill}
//           className="btn btn-primary d-flex align-items-center gap-2"
//         >
//           <Plus size={16} />
//           Thêm kỹ năng
//         </button>
//       </div>

//       {/* Trường hợp chưa có skill */}
//       {fields.length === 0 && (
//         <div className="card text-center">
//           <div className="card-body py-5 d-flex flex-column align-items-center justify-content-center">
//             <div
//               className="d-flex align-items-center justify-content-center mb-3"
//               style={{ width: 56, height: 56 }}
//             >
//               <Zap size={40} className="text-muted" />
//             </div>
//             <p className="text-muted">
//               Chưa có kỹ năng nào. Hãy thêm những kỹ năng của bạn!
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Có skill */}
//       {fields.length > 0 && (
//         <div>
//           <div
//             className="alert alert-secondary text-center py-2 mb-3"
//             style={{ border: "2px dashed #ccc" }}
//           >
//             💡 Kéo và thả để sắp xếp lại thứ tự kỹ năng
//           </div>

//           <DragDropList
//             items={fields}
//             onReorder={handleReorder}
//             renderItem={renderSkillItem}
//             keyExtractor={(field) => field.id}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// ----- lần 4 -----/

"use client";

import {
  useFormContext,
  useFieldArray,
  type FieldArrayWithId,
} from "react-hook-form";
import type { ResumeData } from "../resume-builder";
import { Plus, Trash2, Zap, Check } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import { useState } from "react";

export function SkillsStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "skills",
  });

  const [customSkill, setCustomSkill] = useState<Record<number, string>>({});
  // Đã tắt kiểm tra lỗi skill

  const addSkill = () => {
    append(""); // thêm kỹ năng rỗng
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const skillOptions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C#",
    "SQL",
    "HTML",
    "CSS",
    "Photoshop",
    "Illustrator",
    "Figma",
    "Excel",
    "Word",
    "PowerPoint",
    "Marketing",
    "SEO",
    "Other",
  ];

  const renderSkillItem = (
    field: FieldArrayWithId,
    index: number,
    isDragging?: boolean
  ) => {
    const currentValue = watch(`skills.${index}`);
    const allSkills = watch("skills") || [];



    return (
      <div
        key={field.id}
        className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Skill {index + 1}</h6>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              remove(index);
              setErrorMessages((prev) => {
                const copy = { ...prev };
                delete copy[index];
                return copy;
              });
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label htmlFor={`skill-${index}`} className="form-label">
              Skill name *
            </label>

            <select
              id={`skill-${index}`}
              {...register(`skills.${index}`)}
              className="form-select"
              value={currentValue || ""}
              onChange={e => setValue(`skills.${index}`, e.target.value)}
            >
              <option value="">Select a skill</option>
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}

              {/* Nếu value là custom skill, thêm option hidden để hiển thị */}
              {currentValue && !skillOptions.includes(currentValue) && (
                <option value={currentValue} hidden>
                  {currentValue}
                </option>
              )}
            </select>

          </div>

          {/* Nếu chọn "Other" thì hiện input + nút Thêm */}
          {currentValue === "Other" && (
            <div className="mb-3">
              <label className="form-label">Enter your skill</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter skill"
                  value={customSkill[index] || ""}
                  onChange={e =>
                    setCustomSkill((prev) => ({
                      ...prev,
                      [index]: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="btn btn-success d-flex align-items-center gap-1"
                  onClick={() => {
                    const value = customSkill[index]?.trim();
                    if (!value) return;
                    setValue(`skills.${index}`, value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setCustomSkill((prev) => ({ ...prev, [index]: "" }));
                  }}
                >
                  <Check size={16} /> Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Zap size={20} />
          <h5 className="mb-0">Skill</h5>
        </div>
        <button
          type="button"
          onClick={addSkill}
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {/* Trường hợp chưa có skill */}
      {fields.length === 0 && (
        <div className="card text-center">
          <div className="card-body py-5 d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <Zap size={40} className="text-muted" />
            </div>
            <p className="text-muted">
              No skills added yet. Please add your skills!
            </p>
          </div>
        </div>
      )}

      {/* Có skill */}
      {fields.length > 0 && (
        <div>
          <div
            className="alert alert-secondary text-center py-2 mb-3"
            style={{ border: "2px dashed #ccc" }}
          >
            💡 Drag and drop to rearrange skill order
          </div>

          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderSkillItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  );
}
