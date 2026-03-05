import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  PencilIcon,
  BookOpenIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { getAllExams } from "../../../services/exam.service";
import { getAllSpeakingExams } from "../../../services/speaking.service";

const SWDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [writingStats, setWritingStats] = useState({
    total: 0,
    active: 0,
  });
  const [speakingStats, setSpeakingStats] = useState({
    total: 0,
    active: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const [writingResponse, speakingResponse] = await Promise.all([
        getAllExams({ page: 1, limit: 100 }),
        getAllSpeakingExams({ page: 1, limit: 100 }),
      ]);

      if (writingResponse.success && writingResponse.data?.data) {
        const writingExams: any[] = writingResponse.data.data;
        setWritingStats({
          total: writingExams.length,
          active: writingExams.filter((exam: any) => exam.isActive).length,
        });
      }

      if (speakingResponse.success && speakingResponse.data?.data) {
        const speakingExams: any[] = speakingResponse.data.data;
        setSpeakingStats({
          total: speakingExams.length,
          active: speakingExams.filter((exam: any) => exam.isActive).length,
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Quản Lý Bài Kiểm Tra
        </Typography>
        <Typography variant="small" className="text-gray-600">
          Speaking & Writing - TOEIC Exam Management System
        </Typography>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Writing Section */}
          <Card className="shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader
              floated={false}
              shadow={false}
              className="rounded-none bg-gradient-to-r from-blue-600 to-blue-500 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h5" color="white" className="font-bold mb-2">
                    Đề Thi Writing
                  </Typography>
                  <Typography variant="small" color="white" className="opacity-90">
                    Quản lý các đề thi Writing TOEIC
                  </Typography>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <BookOpenIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Typography variant="h3" className="font-bold text-blue-600 mb-1">
                    {writingStats.total}
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Tổng đề thi
                  </Typography>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Typography variant="h3" className="font-bold text-green-600 mb-1">
                    {writingStats.active}
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Đang kích hoạt
                  </Typography>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {writingStats.active > 0 && (
                    <Chip
                      value="Đang hoạt động"
                      color="green"
                      variant="outlined"
                      size="sm"
                    />
                  )}
                  {writingStats.total === 0 && (
                    <Chip
                      value="Chưa có dữ liệu"
                      color="gray"
                      variant="outlined"
                      size="sm"
                    />
                  )}
                </div>
                <PencilIcon className="h-5 w-5 text-blue-600" />
              </div>

              <Button
                onClick={() => navigate("/admin/content/sw/writing")}
                className="w-full bg-blue-600 flex items-center justify-center gap-2"
              >
                <BookOpenIcon className="h-5 w-5" />
                Quản lý Đề Thi Writing
              </Button>
            </CardBody>
          </Card>

          {/* Speaking Section */}
          <Card className="shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader
              floated={false}
              shadow={false}
              className="rounded-none bg-gradient-to-r from-purple-600 to-purple-500 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h5" color="white" className="font-bold mb-2">
                    Đề Thi Speaking
                  </Typography>
                  <Typography variant="small" color="white" className="opacity-90">
                    Quản lý các đề thi Speaking TOEIC
                  </Typography>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <MicrophoneIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Typography variant="h3" className="font-bold text-purple-600 mb-1">
                    {speakingStats.total}
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Tổng đề thi
                  </Typography>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Typography variant="h3" className="font-bold text-green-600 mb-1">
                    {speakingStats.active}
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Đang kích hoạt
                  </Typography>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {speakingStats.active > 0 && (
                    <Chip
                      value="Đang hoạt động"
                      color="green"
                      variant="outlined"
                      size="sm"
                    />
                  )}
                  {speakingStats.total === 0 && (
                    <Chip
                      value="Chưa có dữ liệu"
                      color="gray"
                      variant="outlined"
                      size="sm"
                    />
                  )}
                </div>
                <MicrophoneIcon className="h-5 w-5 text-purple-600" />
              </div>

              <Button
                onClick={() => navigate("/admin/content/sw/speaking")}
                className="w-full bg-purple-600 flex items-center justify-center gap-2"
              >
                <MicrophoneIcon className="h-5 w-5" />
                Quản lý Đề Thi Speaking
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <Typography variant="h6" className="font-bold text-blue-900 mb-3">
          Hướng dẫn sử dụng
        </Typography>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>Chọn "Quản lý Đề Thi Writing" để xem, tạo, chỉnh sửa hoặc xóa các đề thi Writing</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>Chọn "Quản lý Đề Thi Speaking" để xem, tạo, chỉnh sửa hoặc xóa các đề thi Speaking</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>Mỗi loại đề thi có cấu trúc phần riêng biệt và yêu cầu nội dung khác nhau</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWDashboard;