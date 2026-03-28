import React from "react";
import { Award, BookOpen, TrendingUp, CheckCircle } from "lucide-react";
import type { WritingSubmitResponse } from "../../../types/entrance-exam/writing.types";
import type { SpeakingSubmitResponse } from "../../../types/entrance-exam/speaking.types";

interface ExamResultSWProps {
  speakingResult: SpeakingSubmitResponse;
  writingResult: WritingSubmitResponse;
  onComplete?: () => void;
}

export const ExamResultSW: React.FC<ExamResultSWProps> = ({
  speakingResult,
  writingResult,
  onComplete,
}) => {
  const { scaledScore: speakingScore } = speakingResult;
  const { scaledScore: writingScore, totalScaledScore } = writingResult;

  const getScoreLevel = (score: number) => {
    if (score >= 320) return "Xuất sắc";
    if (score >= 240) return "Khá";
    if (score >= 160) return "Trung bình";
    return "Cần cải thiện";
  };

  const getCourseRecommendation = (totalScore: number) => {
    if (totalScore >= 350) {
      return {
        level: "Cao cấp (Advanced)",
        courses: [
          "TOEIC Advanced Speaking & Writing",
          "Business English Mastery",
          "IELTS Preparation",
        ],
        message:
          "Bạn có khả năng sử dụng tiếng Anh xuất sắc trong môi trường làm việc quốc tế.",
      };
    } else if (totalScore >= 280) {
      return {
        level: "Trung cấp (Intermediate)",
        courses: [
          "TOEIC Intermediate Speaking & Writing",
          "Professional Communication",
          "Advanced Business Writing",
        ],
        message:
          "Bạn có nền tảng tiếng Anh tốt, có thể giao tiếp hiệu quả trong môi trường công việc.",
      };
    } else if (totalScore >= 200) {
      return {
        level: "Sơ cấp (Pre-Intermediate)",
        courses: [
          "TOEIC Foundation Speaking & Writing",
          "Essential Business English",
          "Grammar & Vocabulary Builder",
        ],
        message:
          "Bạn có nền tảng tiếng Anh cơ bản, cần luyện tập thêm để nâng cao kỹ năng giao tiếp.",
      };
    } else {
      return {
        level: "Cơ bản (Beginner)",
        courses: [
          "TOEIC Beginner Speaking & Writing",
          "English for Absolute Beginners",
          "Basic Pronunciation & Grammar",
        ],
        message:
          "Bạn cần xây dựng lại nền tảng tiếng Anh từ cơ bản để tiến bộ nhanh hơn.",
      };
    }
  };

  const recommendation = getCourseRecommendation(totalScaledScore);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Kết quả bài thi TOEIC Speaking & Writing
              </h1>
              <p className="text-gray-600">
                Điểm số đã được chấm bởi AI (Google Gemini)
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Đã hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Score Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="text-center">
            <p className="text-indigo-100 mb-2">Tổng điểm Speaking & Writing</p>
            <div className="flex items-baseline justify-center gap-4 mb-4">
              <span className="text-7xl font-bold">{totalScaledScore}</span>
              <span className="text-3xl opacity-80">/ 400</span>
            </div>
            <div className="inline-block px-6 py-2 bg-white bg-opacity-20 rounded-full text-lg font-semibold">
              {getScoreLevel(totalScaledScore)}
            </div>
          </div>
        </div>

        {/* Individual Scores */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Speaking Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Speaking</h2>
                <p className="text-sm text-gray-600">Kỹ năng nói</p>
              </div>
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {speakingScore}
              </div>
              <p className="text-gray-600">/ 200 điểm</p>
            </div>
          </div>

          {/* Writing Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Writing</h2>
                <p className="text-sm text-gray-600">Kỹ năng viết</p>
              </div>
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {writingScore}
              </div>
              <p className="text-gray-600">/ 200 điểm</p>
            </div>
          </div>
        </div>

        {/* Course Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Khuyến nghị khóa học
              </h2>
              <p className="text-gray-600">
                Dựa trên kết quả thi của bạn
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Trình độ hiện tại</p>
                <p className="text-2xl font-bold text-blue-600">
                  {recommendation.level}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Điểm số</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalScaledScore}/400
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {recommendation.message}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3">
              Khóa học phù hợp với bạn:
            </h3>
            {recommendation.courses.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{course}</p>
                </div>
                <div className="text-blue-600 font-semibold">Xem chi tiết →</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Bước tiếp theo
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Đăng ký khóa học được khuyến nghị
                </p>
                <p className="text-gray-600">
                  Chọn khóa học phù hợp với trình độ hiện tại của bạn
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Luyện tập thường xuyên
                </p>
                <p className="text-gray-600">
                  Dành ít nhất 30 phút mỗi ngày để cải thiện kỹ năng
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Thi thử lại sau 3 tháng
                </p>
                <p className="text-gray-600">
                  Đánh giá sự tiến bộ của bạn qua các bài thi thử
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Button */}
        {onComplete && (
          <div className="flex justify-center">
            <button
              onClick={onComplete}
              className="px-12 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-lg"
            >
              Hoàn thành
            </button>
          </div>
        )}
      </div>
    </div>
  );
};