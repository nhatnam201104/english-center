import { Button, Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpenCheck,
  FileCheck2,
  UserCheck,
  ArrowRight,
  Clock3,
  LaptopMinimalCheck,
} from "lucide-react";

// Mock data mới cho quy trình 4 bước
const admissionsPathway = [
  {
    step: "01",
    title: "Kiểm tra đầu vào trực tuyến",
    description: "Bài thi Placement Test nhanh chóng trong 60 phút để xác định chính xác trình độ hiện tại của bạn.",
    icon: <LaptopMinimalCheck className="h-7 w-7 text-blue-700" />,
    color: "blue",
    features: ["45 câu hỏi Nghe/Đọc", "Kết quả tức thì", "Miễn phí hoàn toàn"],
  },
  {
    step: "02",
    title: "Chọn khóa học phù hợp",
    description: "Dựa trên điểm số đầu vào, hệ thống tự động đề xuất lộ trình TOEIC tối ưu để đạt mục tiêu.",
    icon: <BookOpenCheck className="h-7 w-7 text-green-700" />,
    color: "green",
    features: ["Lộ trình L&R hoặc S&W", "Cam kết đầu ra", "Học phí ưu đãi"],
  },
  {
    step: "03",
    title: "Chuẩn bị hồ sơ & Học phí",
    description: "Hoàn thiện thông tin đăng ký và đóng học phí trực tuyến an toàn qua hệ thống.",
    icon: <FileCheck2 className="h-7 w-7 text-orange-700" />,
    color: "orange",
    features: ["Xác nhận nhập học", "Thanh toán linh hoạt", "Hóa đơn điện tử"],
  },
  {
    step: "04",
    title: "Nhập học & Nhận giáo trình",
    description: "Nhận tài khoản học, bộ giáo trình độc quyền và tham gia tuần sinh hoat đầu khóa.",
    icon: <UserCheck className="h-7 w-7 text-purple-700" />,
    color: "purple",
    features: ["Tài khoản LMS", "Giáo trình PDF/Cứng", "Lịch học chi tiết"],
  },
];

const AdmissionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-800 to-blue-900 py-24 text-white lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
          </svg>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <Chip 
            value="Kỳ Tuyển Sinh 2026" 
            variant="ghost" 
            className="mb-6 inline-flex rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold"
          />
          <Typography variant="h1" className="mb-6 text-4xl font-black md:text-6xl">
            Lộ Trình Nhập Học Tốc Độ
          </Typography>
          <Typography variant="lead" className="mx-auto mb-10 max-w-3xl text-blue-100 opacity-90">
            Chỉ với 4 bước trực tuyến đơn giản, bạn đã sẵn sàng bắt đầu hành trình chinh phục 
            <span className="font-bold text-orange-400"> 990 TOEIC</span> cùng đội ngũ chuyên gia hàng đầu.
          </Typography>
          
          <div className="flex flex-wrap justify-center gap-4">
             <Link to="/thi-thu-online">
              <Button size="lg" color="white" className="flex items-center gap-2 text-blue-900 normal-case shadow-lg">
                <LaptopMinimalCheck size={20} /> Thi thử đầu vào ngay
              </Button>
            </Link>
            <Button size="lg" variant="outlined" color="white" className="flex items-center gap-2 normal-case border-2">
               Tư vấn lộ trình <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto -mt-16 max-w-6xl px-4">
        {/* Pathway Section */}
        <div className="space-y-16">
          
          {/* Section Title */}
          <div className="text-center">
            <Typography variant="h2" className="mb-4 font-black text-blue-gray-900">
              Quy Trình 4 Bước Đơn Giản
            </Typography>
            <div className="mx-auto h-1 w-24 rounded-full bg-orange-500"></div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {admissionsPathway.map((item, index) => (
              <div key={index} className="group relative">
                {/* Connector Line (Desktop) */}
                {index !== admissionsPathway.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-blue-gray-100 lg:block" />
                )}
                
                {/* Step Card */}
                <Card className="relative z-10 h-full border border-blue-gray-100 shadow-xl shadow-blue-gray-900/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-${item.color}-200 group-hover:shadow-xl group-hover:shadow-${item.color}-500/10">
                  <CardBody className="flex flex-col h-full p-8 text-center">
                    
                    {/* Icon Container */}
                    <div className={`mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md border border-gray-50`}>
                      {item.icon}
                    </div>
                    
                    {/* Title & Description */}
                    <Typography variant="h6" className="mb-3 font-bold text-blue-gray-900">
                      <span className={`text-${item.color}-600 mr-2`}>{item.step}.</span>
                      {item.title}
                    </Typography>
                    
                    <Typography className="mb-6 text-sm font-normal leading-relaxed text-blue-gray-600">
                      {item.description}
                    </Typography>
                    
                    {/* Features List */}
                    <div className="mt-auto space-y-2.5 pt-4 border-t border-blue-gray-50 text-left">
                      {item.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5">
                          <CheckCircle className={`h-4 w-4 text-${item.color}-500`} />
                          <Typography variant="small" className="text-blue-gray-700 font-medium">
                            {feature}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Info & Support */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Guarantee Card */}
            <Card className="border border-blue-gray-100 shadow-sm bg-white overflow-hidden">
                <CardBody className="flex items-start gap-6 p-8">
                    <div className="rounded-2xl bg-green-50 p-4 text-green-600 border border-green-100">
                        <Award className="h-10 w-10" />
                    </div>
                    <div>
                        <Typography variant="h5" className="mb-1 font-bold text-blue-gray-900">
                            Cam Kết Đầu Ra Bằng Văn Bản
                        </Typography>
                        <Typography className="text-sm text-blue-gray-600">
                            100% học viên được ký cam kết hoàn trả 100% học phí hoặc học lại miễn phí nếu không đạt điểm mục tiêu sau khóa học.
                        </Typography>
                    </div>
                </CardBody>
            </Card>

            {/* Support Card */}
            <Card className="border border-blue-gray-100 shadow-sm bg-white overflow-hidden">
                <CardBody className="flex items-start gap-6 p-8">
                    <div className="rounded-2xl bg-orange-50 p-4 text-orange-600 border border-orange-100">
                        <Clock3 className="h-10 w-10" />
                    </div>
                    <div>
                        <Typography variant="h5" className="mb-1 font-bold text-blue-gray-900">
                            Hỗ Trợ Học Viên 24/7
                        </Typography>
                        <Typography className="text-sm text-blue-gray-600">
                            Đội ngũ giáo vụ luôn sẵn sàng giải đáp mọi thắc mắc về lịch học, giáo trình và lộ trình cá nhân hóa của bạn.
                        </Typography>
                    </div>
                </CardBody>
            </Card>
        </div>
      </div>
    </div>
  );
};

// Component CheckCircle nhỏ để dùng trong Feature List
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);


export default AdmissionsPage;