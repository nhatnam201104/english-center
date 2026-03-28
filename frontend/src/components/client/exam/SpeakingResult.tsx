import React from "react";
import { CheckCircle, Award, TrendingUp } from "lucide-react";
import type { SpeakingSubmitResponse } from "../../../types/entrance-exam/speaking.types";

interface SpeakingResultProps {
  result: SpeakingSubmitResponse;
  onNext?: () => void;
}

export const SpeakingResult: React.FC<SpeakingResultProps> = ({ result, onNext }) => {
  const { totalRawScore, scaledScore, gradingResults } = result;

  const getScoreColor = (score: number) => {
    if (score >= 160) return "text-green-600";
    if (score >= 120) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 160) return "Xuất sắc";
    if (score >= 120) return "Khá";
    if (score >= 80) return "Trung bình";
    return "Cần cải thiện";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Kết quả Speaking
            </h1>
            <p className="text-gray-600">
              Điểm số đã được chấm bởi AI
            </p>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Điểm số Speaking</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold">{scaledScore}</span>
                <span className="text-2xl opacity-80">/ 200</span>
              </div>
              <div className="mt-2 inline-block px-4 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                {getScoreLevel(scaledScore)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 mb-1">Điểm gốc</div>
              <div className="text-2xl font-semibold">{totalRawScore} / 275</div>
            </div>
          </div>
        </div>

        {/* Questions Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Phân tích theo câu hỏi
            </h2>
          </div>

          <div className="space-y-4">
            {gradingResults.map((item) => (
              <div key={item.questionIndex} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">
                    Câu hỏi {item.questionIndex}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(
                        item.score
                      )}`}
                    >
                      {item.score}
                    </span>
                    <span className="text-gray-600">/ 25</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{item.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-green-800">
                Điểm mạnh
              </h3>
            </div>
            <ul className="space-y-2">
              {gradingResults
                .filter((f) => f.score >= 4)
                .slice(0, 3)
                .map((item) => (
                  <li key={item.questionIndex} className="flex items-start gap-2 text-green-700">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Câu {item.questionIndex}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-orange-800">
                Cần cải thiện
              </h3>
            </div>
            <ul className="space-y-2">
              {gradingResults
                .filter((f) => f.score < 3)
                .slice(0, 3)
                .map((item) => (
                  <li key={item.questionIndex} className="flex items-start gap-2 text-orange-700">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Câu {item.questionIndex}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Next Button */}
        {onNext && (
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Tiếp tục đến phần Writing →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};