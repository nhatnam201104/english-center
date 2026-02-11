import React from "react";
import { ClipboardList } from "lucide-react";

type PlacementBannerProps = {
  minBand: number | null; 
};

export const PlacementBanner: React.FC<PlacementBannerProps> = ({ minBand }) => {
  if (!minBand || minBand <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-200">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <ClipboardList size={28} className="text-white" />
        </div>

        <div>
          <h2 className="text-lg font-bold">
            Xác định trình độ của bạn
          </h2>
          <p className="text-sm text-blue-50 mt-1 max-w-md">
            Bài kiểm tra đầu vào chỉ mất 15 phút, giúp đánh giá năng lực hiện tại
            và xác định khóa học này có phù hợp với bạn hay không.
          </p>
        </div>
      </div>

      <button
        className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-[0_6px_0_0_rgb(191,219,254)]
        active:translate-y-1 active:shadow-[0_2px_0_0_rgb(191,219,254)] transition-all duration-150 whitespace-nowrap"
      >
        Bắt đầu kiểm tra
      </button>
    </div>
  );
};

