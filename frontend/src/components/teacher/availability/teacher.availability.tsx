import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  getMyAvailabilityService,
  updateMyAvailabilityService,
} from "../../../services/teacher-portal.service";

type PresetKey = "246" | "357" | "full" | "";

const PRESETS: Record<
  Exclude<PresetKey, "">,
  { days: string[]; label: string; sublabel: string; colorActive: string; colorInactive: string }
> = {
  "246": {
    days: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    label: "Thứ 2 - 4 - 6",
    sublabel: "Thứ Hai • Thứ Tư • Thứ Sáu",
    colorActive: "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200",
    colorInactive: "bg-white text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50",
  },
  "357": {
    days: ["TUESDAY", "THURSDAY", "SATURDAY"],
    label: "Thứ 3 - 5 - 7",
    sublabel: "Thứ Ba • Thứ Năm • Thứ Bảy",
    colorActive: "bg-green-600 text-white border-green-600 shadow-lg shadow-green-200",
    colorInactive: "bg-white text-green-700 border-green-200 hover:border-green-400 hover:bg-green-50",
  },
  "full": {
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
    label: "Cả tuần",
    sublabel: "Thứ 2 • Thứ 3 • Thứ 4 • Thứ 5 • Thứ 6 • Thứ 7",
    colorActive: "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200",
    colorInactive: "bg-white text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50",
  },
};

const detectPreset = (days: string[]): PresetKey => {
  for (const [key, preset] of Object.entries(PRESETS) as [Exclude<PresetKey, "">, typeof PRESETS[keyof typeof PRESETS]][]) {
    if (
      preset.days.length === days.length &&
      preset.days.every((d) => days.includes(d))
    ) {
      return key;
    }
  }
  return "";
};

const TeacherAvailability = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const response = await getMyAvailabilityService();
      const days: string[] = response.data?.day || [];
      setSelectedPreset(detectPreset(days));
    } catch (error) {
      console.error("Lỗi khi tải lịch rảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const days = selectedPreset ? PRESETS[selectedPreset].days : [];
      const freeDays = days.map((day) => ({ day }));
      await updateMyAvailabilityService(freeDays);
      setMessage({ type: "success", text: "Cập nhật lịch rảnh thành công!" });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessage({
        type: "error",
        text: error.message || "Cập nhật thất bại",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Đăng Ký Lịch Rảnh
        </Typography>
        <Typography variant="small" className="text-gray-500 mt-1">
          Chọn nhóm ngày bạn có thể giảng dạy để admin phân công lịch
        </Typography>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* Preset cards */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Chọn nhóm lịch rảnh
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {(Object.entries(PRESETS) as [Exclude<PresetKey, "">, typeof PRESETS[keyof typeof PRESETS]][]).map(
              ([key, preset]) => (
                <button
                  key={key}
                  onClick={() =>
                    setSelectedPreset((prev) => (prev === key ? "" : key))
                  }
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedPreset === key
                      ? preset.colorActive
                      : preset.colorInactive
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base">{preset.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          selectedPreset === key
                            ? "opacity-80"
                            : "opacity-60"
                        }`}
                      >
                        {preset.sublabel}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedPreset === key
                          ? "border-white bg-white/20"
                          : "border-current opacity-40"
                      }`}
                    >
                      {selectedPreset === key && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        {/* Current selection summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Lịch rảnh hiện tại
          </h3>
          {selectedPreset ? (
            <p className="text-sm font-medium text-blue-700">
              {PRESETS[selectedPreset].label} —{" "}
              <span className="text-gray-500 font-normal">
                {PRESETS[selectedPreset].sublabel}
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">Chưa chọn nhóm lịch nào</p>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Đang lưu..." : "Lưu lịch rảnh"}
        </button>
      </div>
    </div>
  );
};

export default TeacherAvailability;
