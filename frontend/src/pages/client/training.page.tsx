import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { BookOpen, Headphones, PenTool, MessageSquare, Target, Clock, ArrowRight } from "lucide-react";

const programs = [
  // Nhóm Listening & Reading
  {
    name: "TOEIC Foundation L&R",
    category: "Listening & Reading",
    duration: "8 tuần",
    target: "450+",
    description: "Xây nền tảng ngữ pháp, từ vựng và làm quen phương pháp nghe hiểu cơ bản.",
    features: ["Lấy gốc tiếng Anh", "Từ vựng 20 chủ điểm", "Ngữ pháp trọng tâm"],
    color: "blue",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    name: "TOEIC Intensive L&R",
    category: "Listening & Reading",
    duration: "12 tuần",
    target: "650 - 750+",
    description: "Tập trung chuyên sâu 2 kỹ năng nghe/đọc, luyện đề thi thực tế theo format mới nhất.",
    features: ["Kỹ thuật Paraphrasing", "Bẫy Part 3, 4", "Quản lý thời gian Reading"],
    color: "indigo",
    icon: <Headphones className="h-6 w-6" />,
  },
  {
    name: "TOEIC Mastery L&R",
    category: "Listening & Reading",
    duration: "10 tuần",
    target: "850 - 990",
    description: "Chinh phục mức điểm tối đa với các bộ đề khó và chiến lược giải quyết câu hỏi cực nhanh.",
    features: ["Full Test liên tục", "Sửa lỗi sai chi tiết", "Chiến thuật đạt điểm 990"],
    color: "purple",
    icon: <Target className="h-6 w-6" />,
  },

  // Nhóm Speaking & Writing
  {
    name: "TOEIC Speaking Basic",
    category: "Speaking & Writing",
    duration: "8 tuần",
    target: "Level 4-5",
    description: "Chỉnh sửa phát âm, trọng âm và xây dựng phản xạ trả lời các câu hỏi ngắn.",
    features: ["Phát âm IPA chuẩn", "Phản xạ giao tiếp", "Ngữ điệu tự nhiên"],
    color: "orange",
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    name: "TOEIC Writing Standard",
    category: "Speaking & Writing",
    duration: "10 tuần",
    target: "Level 5-6",
    description: "Kỹ năng viết email, mô tả tranh và trình bày quan điểm logic, đúng văn phong công sở.",
    features: ["Viết Email chuyên nghiệp", "Cấu trúc Essay", "Từ vựng Business"],
    color: "teal",
    icon: <PenTool className="h-6 w-6" />,
  },
  {
    name: "Combo S&W Advanced",
    category: "Speaking & Writing",
    duration: "14 tuần",
    target: "300+ S&W",
    description: "Khóa học kết hợp nâng cao, hoàn thiện kỹ năng trình bày và thuyết phục bằng văn bản/lời nói.",
    features: ["Tư duy Critical Thinking", "Thuyết trình chuyên sâu", "Sửa lỗi 1:1"],
    color: "red",
    icon: <Target className="h-6 w-6" />,
  },
];

const TrainingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Typography variant="h1" className="mb-4 text-3xl font-black text-blue-gray-900 md:text-5xl">
            Chương Trình Đào Tạo
          </Typography>
          <Typography className="mx-auto max-w-3xl text-lg text-blue-gray-600">
            Lộ trình cá nhân hóa, tập trung tối ưu điểm số theo từng nhóm kỹ năng 
            <span className="font-bold text-blue-700"> Listening & Reading</span> hoặc 
            <span className="font-bold text-orange-700"> Speaking & Writing</span>.
          </Typography>
        </div>

        {/* Grid hiển thị */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, index) => (
            <Card key={index} className="flex flex-col border border-blue-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardBody className="flex flex-col h-full p-8">
                {/* Icon & Category */}
                <div className="mb-6 flex items-center justify-between">
                  <div className={`rounded-xl bg-${program.color}-50 p-3 text-${program.color}-600`}>
                    {program.icon}
                  </div>
                  <Chip
                    value={program.category}
                    variant="ghost"
                    size="sm"
                    className="rounded-full font-bold"
                  />
                </div>

                {/* Name & Target */}
                <div className="mb-4">
                  <Typography variant="h5" className="font-black text-blue-gray-900">
                    {program.name}
                  </Typography>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-blue-gray-500">
                      <Clock size={14} />
                      <Typography variant="small" className="font-medium">{program.duration}</Typography>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <Target size={14} />
                      <Typography variant="small" className="font-bold">Target: {program.target}</Typography>
                    </div>
                  </div>
                </div>

                <Typography className="mb-6 font-normal text-blue-gray-600">
                  {program.description}
                </Typography>

                {/* Features List */}
                <div className="mb-8 space-y-2">
                  {program.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-gray-300" />
                      <Typography variant="small" className="text-blue-gray-700 font-medium">
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <Button
                    variant="outlined"
                    fullWidth
                    className="group flex items-center justify-center gap-2 border-blue-gray-200 hover:bg-blue-gray-900 hover:text-white transition-all"
                  >
                    Xem chi tiết <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;