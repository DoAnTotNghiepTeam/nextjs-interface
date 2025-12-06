"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// ...existing code...
import { useState } from "react";
import { Check } from "lucide-react";

export interface CustomizationOptions {
  font: string;
  colorScheme: string;
  spacing: "compact" | "normal" | "relaxed";
  fontSize: "small" | "medium" | "large";
}

export const fontOptions = [
  { value: "inter", label: "Inter", family: '"Inter", Arial, sans-serif' },
  { value: "serif", label: "Times New Roman", family: '"Times New Roman", Times, serif' },
  { value: "mono", label: "JetBrains Mono", family: '"JetBrains Mono", monospace' },
  { value: "playfair", label: "Playfair Display", family: '"Playfair Display", serif' },
];

export const colorSchemes = [
  {
    value: "blue",
    label: "Xanh dương",
    primary: "#3b82f6",
    secondary: "#1e40af",
  },
  {
    value: "green",
    label: "Xanh lá",
    primary: "#10b981",
    secondary: "#047857",
  },
  { value: "purple", label: "Tím", primary: "#8b5cf6", secondary: "#7c3aed" },
  { value: "red", label: "Đỏ", primary: "#ef4444", secondary: "#dc2626" },
  { value: "orange", label: "Cam", primary: "#f97316", secondary: "#ea580c" },
  { value: "gray", label: "Xám", primary: "#6b7280", secondary: "#4b5563" },
];

const COLOR_OPTIONS = [
  { value: "blue", label: "Xanh dương", color: "#3b82f6" },
  { value: "green", label: "Xanh lá", color: "#10b981" },
  { value: "purple", label: "Tím", color: "#8b5cf6" },
  { value: "red", label: "Đỏ", color: "#ef4444" },
  { value: "orange", label: "Cam", color: "#f97316" },
  { value: "gray", label: "Xám", color: "#6b7280" },
];

function CustomDropdown({
  value,
  onChange,
  options,
  width = 180,
  renderLabel,
  renderIcon,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; family?: string; color?: string }[];
  width?: number;
  renderLabel?: (item: {
    value: string;
    label: string;
    family?: string;
    color?: string;
  }) => React.ReactNode;
  renderIcon?: (item: {
    value: string;
    label: string;
    family?: string;
    color?: string;
  }) => React.ReactNode;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((c) => c.value === value);
  return (
    <div style={{ position: "relative", width }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          background: "#f7f8fa",
          borderRadius: 8,
          padding: "8px 12px",
        }}
        tabIndex={0}
        id={id}
        onClick={() => setOpen((v) => !v)}
      >
        {renderIcon && selected && renderIcon(selected)}
        <span style={{ flex: 1, fontFamily: selected?.family }}>
          {selected
            ? renderLabel
              ? renderLabel(selected)
              : selected.label
            : null}
        </span>
        <span style={{ marginLeft: 8, color: "#6D7588" }}>▼</span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "100%",
            background: "#f7f8fa",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 10,
            padding: "8px 0",
          }}
        >
          {options.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 16px",
                cursor: "pointer",
                background: value === item.value ? "#e6eaf1" : "transparent",
                position: "relative",
              }}
            >
              {renderIcon && renderIcon(item)}
              <span style={{ flex: 1, fontFamily: item.family }}>
                {renderLabel ? renderLabel(item) : item.label}
              </span>
              {value === item.value && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Check size={20} style={{ color: "#1a2233" }} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onOptionsChange: (options: CustomizationOptions) => void;
}

export function CustomizationPanel({
  options,
  onOptionsChange,
}: CustomizationPanelProps) {
  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <div className="mb-4" style={{ marginTop: 30 }}>
      <div>
        <h3 className="h5 mb-2 ml-2">Tùy chỉnh thiết kế</h3>
        <p className="text-muted">Cá nhân hóa resume theo phong cách của bạn</p>
      </div>

      <Card className="mb-3">
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col items-center justify-center gap-1 text-center">
            {/* <Type className="h-8 w-8" /> */}
            <CardTitle className="text-center w-full text-2xl font-bold mb-2">
              Typography
            </CardTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className=" mb-3">
          <div className="mb-3">
            <Label
              htmlFor="font-select"
              style={{ marginLeft: "10px", whiteSpace: "nowrap" }}
            >
              Font chữ
            </Label>
            <div style={{ marginLeft: "10px", marginTop: 8, display: "block" }}>
              <CustomDropdown
                id="font-select"
                value={options.font}
                onChange={(value) => updateOption("font", value)}
                options={fontOptions}
                renderLabel={(item) => item.label}
              />
            </div>
          </div>

          <div className="mb-3">
            <Label
              htmlFor="font-size-select"
              style={{ marginLeft: "10px", whiteSpace: "nowrap" }}
            >
              Kích thước chữ
            </Label>
            <CustomDropdown
              id="font-size-select"
              value={options.fontSize}
              onChange={(value: string) =>
                updateOption(
                  "fontSize",
                  value as CustomizationOptions["fontSize"]
                )
              }
              options={[
                { value: "small", label: "Nhỏ" },
                { value: "medium", label: "Trung bình" },
                { value: "large", label: "Lớn" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-center w-full text-2xl font-bold mb-2">
            Màu sắc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Label
              htmlFor="color-select"
              style={{ marginLeft: "10px", whiteSpace: "nowrap" }}
            >
              Bảng màu
            </Label>
            <CustomDropdown
              id="color-select"
              value={options.colorScheme}
              onChange={(v) => updateOption("colorScheme", v)}
              options={COLOR_OPTIONS}
              renderLabel={(item) => (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: item.color,
                      marginRight: 10,
                    }}
                  />
                  {item.label}
                </span>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-center w-full text-2xl font-bold mb-2">
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Label
              htmlFor="spacing-select"
              style={{ marginLeft: "10px", whiteSpace: "nowrap" }}
            >
              Khoảng cách
            </Label>
            <CustomDropdown
              id="spacing-select"
              value={options.spacing}
              onChange={(value: string) =>
                updateOption(
                  "spacing",
                  value as CustomizationOptions["spacing"]
                )
              }
              options={[
                { value: "compact", label: "Gọn" },
                { value: "normal", label: "Bình thường" },
                { value: "relaxed", label: "Rộng rãi" },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
