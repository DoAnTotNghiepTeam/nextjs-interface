"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// ...existing code...
import { useState, useRef } from "react";
import { Check } from "lucide-react";

export interface CustomizationOptions {
  font: string;
  colorScheme: string;
  customColor?: string;
  spacing: number; // 1.0 to 2.0
  fontSize: number; // 1 to 8
  backgroundPattern?: string;
}

// Default values for customization options
export const DEFAULT_CUSTOMIZATION = {
  fontSize: 4,   // medium (1-8 scale)
  spacing: 1.5,  // medium (1.0-2.0 scale)
  font: "inter",
  colorScheme: "blue",
  backgroundPattern: "none",
} as const;

export const fontOptions = [
  { value: "inter", label: "Inter", family: '"Inter", Arial, sans-serif' },
  { value: "serif", label: "Times New Roman", family: '"Times New Roman", Times, serif' },
  { value: "mono", label: "JetBrains Mono", family: '"JetBrains Mono", monospace' },
  { value: "playfair", label: "Playfair Display", family: '"Playfair Display", serif' },
];

export const colorSchemes = [
  {
    value: "blue",
    label: "Blue",
    primary: "#3b82f6",
    secondary: "#1e40af",
  },
  {
    value: "green",
    label: "Green",
    primary: "#10b981",
    secondary: "#047857",
  },
  { value: "purple", label: "Purple", primary: "#8b5cf6", secondary: "#7c3aed" },
  { value: "red", label: "Red", primary: "#ef4444", secondary: "#dc2626" },
  { value: "orange", label: "Orange", primary: "#f97316", secondary: "#ea580c" },
  { value: "gray", label: "Gray", primary: "#6b7280", secondary: "#4b5563" },
];

const COLOR_OPTIONS = [
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "red", label: "Red", color: "#ef4444" },
  { value: "green", label: "Green", color: "#10b981" },
  { value: "gray", label: "Gray", color: "#6b7280" },
];

const BACKGROUND_PATTERNS = [
  { value: "none", label: "None", preview: "#ffffff" },
  { value: "gradient1", label: "Light Blue", preview: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" },
  { value: "gradient2", label: "White Gray", preview: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)" },
  { value: "gradient3", label: "Cream", preview: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" },
  { value: "gradient4", label: "Sky Blue", preview: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)" },
  { value: "gradient5", label: "Pink Pastel", preview: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)" },
  { value: "gradient6", label: "Orange Pastel", preview: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)" },
  { value: "gradient7", label: "Purple Pastel", preview: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)" },
  { value: "gradient8", label: "Green Pastel", preview: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" },
  { value: "gradient9", label: "Blue Gradient", preview: "linear-gradient(180deg, #dbeafe 0%, #93c5fd 100%)" },
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState(options.customColor || "#3b82f6");
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [hue, setHue] = useState(210); // Default blue hue
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(60);

  // Ensure default values are set
  const fontSize = Number(options.fontSize) || DEFAULT_CUSTOMIZATION.fontSize;
  const spacing = Number(options.spacing) || DEFAULT_CUSTOMIZATION.spacing;

  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    console.log(`[CustomizationPanel] updateOption called - key: ${String(key)}, value:`, value);
    const newOptions = { ...options, [key]: value };
    console.log(`[CustomizationPanel] Calling onOptionsChange with:`, newOptions);
    onOptionsChange(newOptions);
  };

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const fontSizeLabels = ["Extra Small", "Small", "Smaller", "Medium", "Larger", "Large", "Extra Large", "Huge"];

  return (
    <div className="space-y-4" style={{ padding: "0 4px" }}>
      {/* FONT FAMILY */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Font Family
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CustomDropdown
            id="font-select"
            value={options.font}
            onChange={(value) => updateOption("font", value)}
            options={fontOptions}
            renderLabel={(item) => item.label}
            width={260}
          />
        </CardContent>
      </Card>

      {/* FONT SIZE */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Font Size
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}>
            <span style={{ fontSize: 14, color: "#1f2937", fontWeight: 500 }}>
              {fontSizeLabels[fontSize - 1]}
            </span>
            <span style={{ 
              fontSize: 12, 
              color: "#6b7280",
              background: "#f3f4f6",
              padding: "4px 12px",
              borderRadius: 8,
              fontWeight: 600,
              letterSpacing: "0.5px"
            }}>
              {fontSize}/8
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={fontSize}
            onChange={(e) => updateOption("fontSize", Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#3b82f6",
            }}
          />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            marginTop: 10,
            fontSize: 11,
            color: "#9ca3af",
            fontWeight: 500
          }}>
            <span>Small</span>
            <span>Medium</span>
            <span>Huge</span>
          </div>
        </CardContent>
      </Card>

      {/* LINE SPACING */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Line Spacing
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}>
            <span style={{ fontSize: 14, color: "#1f2937", fontWeight: 500 }}>
              {spacing === 1.0 ? "Tight" : 
               spacing <= 1.3 ? "Compact" :
               spacing <= 1.6 ? "Normal" :
               spacing <= 1.8 ? "Relaxed" : "Loose"}
            </span>
            <span style={{ 
              fontSize: 12, 
              color: "#6b7280",
              background: "#f3f4f6",
              padding: "4px 12px",
              borderRadius: 8,
              fontWeight: 600,
              letterSpacing: "0.5px"
            }}>
              {spacing.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={spacing}
            onChange={(e) => updateOption("spacing", Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#3b82f6",
            }}
          />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            marginTop: 10,
            fontSize: 11,
            color: "#9ca3af",
            fontWeight: 500
          }}>
            <span>1.0</span>
            <span>2.0</span>
          </div>
        </CardContent>
      </Card>

      {/* THEME COLOR */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Theme Color
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          {/* Preset Colors */}
          <div style={{ 
            display: "flex", 
            gap: 10, 
            marginBottom: 20,
            flexWrap: "wrap"
          }}>
            {COLOR_OPTIONS.map((color) => (
              <div
                key={color.value}
                onClick={() => {
                  const newOptions = { ...options, colorScheme: color.value };
                  delete newOptions.customColor;
                  onOptionsChange(newOptions);
                }}
                title={color.label}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: color.color,
                  cursor: "pointer",
                  border: options.colorScheme === color.value && !options.customColor ? "3px solid #1f2937" : "2px solid #e5e7eb",
                  boxShadow: options.colorScheme === color.value && !options.customColor 
                    ? "0 4px 12px rgba(0,0,0,0.15)" 
                    : "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* Custom Color Picker */}
          <div style={{ marginTop: 20 }}>
            <div style={{ 
              fontSize: 12, 
              color: "#6b7280", 
              marginBottom: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Custom Color
            </div>
            
            {/* Saturation/Lightness Picker */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
                
                const newSaturation = (x / rect.width) * 100;
                const newLightness = 100 - (y / rect.height) * 100;
                
                setSaturation(newSaturation);
                setLightness(newLightness);
                
                const newColor = hslToHex(hue, newSaturation, newLightness);
                setCustomColor(newColor);
                updateOption("customColor", newColor);
              }}
              style={{
                width: "100%",
                height: 140,
                borderRadius: 10,
                background: `
                  linear-gradient(to bottom, 
                    hsl(${hue}, 0%, 100%) 0%,
                    hsl(${hue}, 100%, 50%) 50%,
                    hsl(${hue}, 100%, 0%) 100%
                  ),
                  linear-gradient(to right, 
                    hsl(${hue}, 0%, 50%),
                    hsl(${hue}, 100%, 50%)
                  )
                `,
                backgroundBlendMode: "multiply",
                position: "relative",
                border: "2px solid #e5e7eb",
                cursor: "crosshair",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {/* Picker indicator */}
              <div
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "3px solid white",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.3)",
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Hue Slider */}
            <div style={{ marginTop: 14 }}>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => {
                  const newHue = Number(e.target.value);
                  setHue(newHue);
                  const newColor = hslToHex(newHue, saturation, lightness);
                  setCustomColor(newColor);
                  updateOption("customColor", newColor);
                }}
                style={{
                  width: "100%",
                  height: 26,
                  borderRadius: 13,
                  appearance: "none",
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%)
                  )`,
                  outline: "none",
                  cursor: "pointer",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              />
            </div>
          </div>

          {/* Color Value Display */}
          <div style={{ 
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <div
              style={{
                width: 46,
                height: 36,
                borderRadius: 8,
                background: options.customColor || COLOR_OPTIONS.find(c => c.value === options.colorScheme)?.color,
                border: "2px solid #e5e7eb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            />
            <input
              type="text"
              value={options.customColor || COLOR_OPTIONS.find(c => c.value === options.colorScheme)?.color || "#3b82f6"}
              readOnly
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 500,
                color: "#1f2937",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* BACKGROUND PATTERN */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Background Pattern
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8
          }}>
            {BACKGROUND_PATTERNS.map((pattern) => (
              <div
                key={pattern.value}
                onClick={() => updateOption("backgroundPattern", pattern.value)}
                title={pattern.label}
                style={{
                  height: 70,
                  borderRadius: 8,
                  background: pattern.preview,
                  cursor: "pointer",
                  border: options.backgroundPattern === pattern.value ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                  boxShadow: options.backgroundPattern === pattern.value 
                    ? "0 4px 12px rgba(59, 130, 246, 0.3)" 
                    : "0 2px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
