import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  getMyAvailabilityService,
  updateMyAvailabilityService,
} from "../../../services/teacher-portal.service";

const ALL_DAYS = [
  { key: "MONDAY", label: "Thứ 2" },
  { key: "TUESDAY", label: "Thứ 3" },
  { key: "WEDNESDAY", label: "Thứ 4" },
  { key: "THURSDAY", label: "Thứ 5" },
  { key: "FRIDAY", label: "Thứ 6" },
  { key: "SATURDAY", label: "Thứ 7" },
  { key: "SUNDAY", label: "CN" },
];

const PRESET_246 = ["MONDAY", "WEDNESDAY", "FRIDAY"];
const PRESET_357 = ["TUESDAY", "THURSDAY", "SATURDAY"];
const PRESET_BOTH = [...PRESET_246, ...PRESET_357];

const TeacherAvailability = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [lockedDays] = useState<string[]>([]);
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
      const days = response.data?.day || [];
      setSelectedDays(days);
    } catch (error) {
      console.error("Lỗi khi tải lịch rảnh:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    if (lockedDays.includes(day)) return;
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const applyPreset = (preset: string[]) => {
    const newDays = preset.filter((d) => !lockedDays.includes(d));
    // Keep locked days that are selected + apply new preset
    const keptLocked = selectedDays.filter((d) => lockedDays.includes(d));
    setSelectedDays([...new Set([...keptLocked, ...newDays])]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const freeDays = selectedDays.map((day) => ({ day }));
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

  const is246 = () =>
    PRESET_246.every((d) => selectedDays.includes(d)) &&
    !PRESET_357.some((d) => selectedDays.includes(d) && !lockedDays.includes(d));

  const is357 = () =>
    PRESET_357.every((d) => selectedDays.includes(d)) &&
    !PRESET_246.some((d) => selectedDays.includes(d) && !lockedDays.includes(d));

  const isBoth = () =>
    PRESET_BOTH.every((d) => selectedDays.includes(d));

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
          Chọn những ngày bạn có thể giảng dạy để admin phân công lịch
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
        {/* Preset buttons */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Chọn nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => applyPreset(PRESET_246)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                is246()
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              Thứ 2 - 4 - 6
            </button>
            <button
              onClick={() => applyPreset(PRESET_357)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                is357()
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              Thứ 3 - 5 - 7
            </button>
            <button
              onClick={() => applyPreset(PRESET_BOTH)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isBoth()
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              Cả hai (2-3-4-5-6-7)
            </button>
          </div>
        </div>

        {/* Day toggles */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Chọn từng ngày
          </h3>
          <div className="grid grid-cols-7 gap-3">
            {ALL_DAYS.map(({ key, label }) => {
              const isSelected = selectedDays.includes(key);
              const isLocked = lockedDays.includes(key);

              return (
                <button
                  key={key}
                  onClick={() => toggleDay(key)}
                  disabled={isLocked}
                  title={isLocked ? "Đang có lịch dạy - không thể thay đổi" : ""}
                  className={`py-4 rounded-xl text-center transition-all duration-200 ${
                    isLocked
                      ? "bg-red-50 text-red-400 border-2 border-red-200 cursor-not-allowed opacity-75"
                      : isSelected
                      ? "bg-blue-600 text-white shadow-lg transform scale-105 border-2 border-blue-600"
                      : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="font-bold text-sm">{label}</div>
                  {isLocked && (
                    <div className="text-[10px] mt-1">🔒 Có lịch</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Ngày đã chọn
          </h3>
          {selectedDays.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa chọn ngày nào</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.filter(({ key }) => selectedDays.includes(key)).map(
                ({ key, label }) => (
                  <span
                    key={key}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lockedDays.includes(key)
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {label}
                    {lockedDays.includes(key) && " 🔒"}
                  </span>
                ),
              )}
            </div>
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
