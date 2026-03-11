import { Typography, Button } from "@material-tailwind/react";
import type { ScoreResponse } from "../../../types/entrance-exam/candidate.types";
import { useNavigate } from "react-router-dom";

interface ExamResultProps {
  result: ScoreResponse;
}

const ExamResult = ({ result }: ExamResultProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <Typography variant="h4" className="font-bold text-gray-800">
            Kết quả bài thi
          </Typography>
          <Typography variant="small" color="gray">
            TOEIC Listening & Reading
          </Typography>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <Typography variant="small" className="text-blue-600 font-semibold">
              Listening
            </Typography>
            <Typography variant="h3" className="font-bold text-blue-700 mt-1">
              {result.listeningScaledScore}
            </Typography>
            <Typography variant="small" className="text-gray-500">
              {result.totalListening} câu đúng
            </Typography>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
            <Typography variant="small" className="text-emerald-600 font-semibold">
              Reading
            </Typography>
            <Typography variant="h3" className="font-bold text-emerald-700 mt-1">
              {result.readingScaledScore}
            </Typography>
            <Typography variant="small" className="text-gray-500">
              {result.totalReading} câu đúng
            </Typography>
          </div>
        </div>

        {/* Total score */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-5 text-center text-white">
          <Typography variant="small" className="opacity-80 font-semibold">
            TỔNG ĐIỂM
          </Typography>
          <Typography variant="h2" className="font-bold mt-1">
            {result.totalScaledScore}
          </Typography>
          <Typography variant="small" className="opacity-80">
            / 990
          </Typography>
        </div>

        {/* Email notice */}
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 flex gap-3 items-start">
          <span className="text-2xl">📧</span>
          <div>
            <p className="text-orange-800 font-semibold text-sm">
              Kiểm tra email của bạn!
            </p>
            <p className="text-orange-700 text-sm mt-1 leading-relaxed">
              Kết quả và link đăng ký khóa học đã được gửi đến email của bạn.
              Vui lòng hoàn tất đăng ký trong vòng&nbsp;
              <strong>24 giờ</strong> — sau thời gian này link sẽ hết hạn.
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="text-center pt-2">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 normal-case"
            onClick={() => navigate("/")}
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
