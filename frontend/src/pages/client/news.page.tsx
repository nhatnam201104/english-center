import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";

// Mock data phong phú hơn với hình ảnh và danh mục
const newsItems = [
  {
    title: "Khai giảng khóa TOEIC cấp tốc tháng 4/2026",
    summary: "Lộ trình tinh gọn giúp học viên đạt mục tiêu 650+ chỉ trong 2 tháng với đội ngũ giáo viên giàu kinh nghiệm.",
    date: "18/03/2026",
    category: "Khóa học",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Admin",
  },
  {
    title: "Cập nhật đề thi TOEIC mới nhất tại IIG",
    summary: "Tổng hợp những thay đổi đáng chú ý trong cấu trúc đề thi Reading và Listening tháng 3/2026.",
    date: "15/03/2026",
    category: "Tin tức",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Phòng Đào Tạo",
  },
  {
    title: "5 mẹo tăng điểm Listening trong 4 tuần",
    summary: "Phương pháp Dictation và kỹ thuật bắt từ khóa giúp bạn không còn sợ hãi các bài nghe Part 3, 4.",
    date: "10/03/2026",
    category: "Mẹo học tập",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Ms. Hoa",
  },
  {
    title: "Workshop: Lộ trình định cư cùng tiếng Anh",
    summary: "Buổi chia sẻ về cơ hội nghề nghiệp quốc tế và tầm quan trọng của chứng chỉ ngoại ngữ.",
    date: "05/03/2026",
    category: "Sự kiện",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Admin",
  },
  {
    title: "Review bộ sách giải đề TOEIC 2026",
    summary: "Đánh giá chi tiết các bộ sách luyện đề bám sát thực tế nhất hiện nay dành cho sĩ tử.",
    date: "01/03/2026",
    category: "Tài liệu",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Phòng Đào Tạo",
  },
  {
    title: "Học viên đạt 900+ TOEIC chia sẻ bí quyết",
    summary: "Câu chuyện truyền cảm hứng từ bạn Minh Anh về hành trình từ con số 0 đến đỉnh cao TOEIC.",
    date: "25/02/2026",
    category: "Gương mặt tiêu biểu",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "Admin",
  },
];

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <Typography
            variant="h1"
            className="mb-4 text-3xl font-black text-blue-gray-900 md:text-5xl"
          >
            Tin tức & Sự kiện
          </Typography>
          <Typography variant="lead" className="mx-auto max-w-2xl text-blue-gray-600">
            Cập nhật những thông tin mới nhất về giáo dục, các khóa học tiếng Anh
            và bí quyết luyện thi hiệu quả nhất.
          </Typography>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Tất cả", "Khóa học", "Mẹo học tập", "Sự kiện"].map((tag) => (
              <Button key={tag} variant="outlined" size="sm" className="rounded-full border-blue-gray-200">
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 h-48 rounded-none"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </CardHeader>
              <CardBody className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Chip
                    value={item.category}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-blue-600 bg-blue-50"
                  />
                  <Typography variant="small" className="font-medium text-blue-gray-500">
                    {item.date}
                  </Typography>
                </div>
                <Typography
                  variant="h5"
                  className="mb-3 line-clamp-2 min-h-[3.5rem] font-bold text-blue-gray-900 leading-snug"
                >
                  {item.title}
                </Typography>
                <Typography className="line-clamp-3 text-blue-gray-600 mb-4 font-normal">
                  {item.summary}
                </Typography>
                <div className="flex items-center justify-between border-t border-blue-gray-50 pt-4">
                   <Typography variant="small" className="font-bold text-blue-gray-800">
                    By {item.author}
                   </Typography>
                   <Button variant="text" size="sm" className="flex items-center gap-2 text-blue-600">
                    Đọc thêm 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
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

export default NewsPage;