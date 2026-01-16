import { 
    Typography, 
    Button, 
    Input,
    IconButton
} from "@material-tailwind/react";
import { 
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    NewspaperIcon,
    HeartIcon,
    ChatBubbleLeftRightIcon,
    PhotoIcon,
    VideoCameraIcon,
    LinkIcon
} from "@heroicons/react/24/solid";
import { 
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const ClientFooter = () => {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log("Newsletter subscription:", email);
        setEmail("");
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-3 rounded-full">
                                <EnvelopeIcon className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <Typography variant="h3" className="mb-4 font-bold text-white">
                            Đăng ký nhận thông tin tuyển sinh
                        </Typography>
                        <Typography variant="paragraph" className="mb-8 text-blue-100 max-w-2xl mx-auto">
                            Nhận thông tin mới nhất về các chương trình đào tạo, học bổng và sự kiện tuyển sinh trực tiếp qua email của bạn.
                        </Typography>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-white text-gray-900 border-white"
                                labelProps={{
                                    className: "hidden",
                                }}
                                containerProps={{ className: "min-w-[200px]" }}
                            />
                            <Button 
                                type="submit"
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Đăng ký ngay
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* University Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                                <AcademicCapIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <Typography variant="h5" className="font-bold text-white">
                                    Đại học ABC
                                </Typography>
                                <Typography variant="small" className="text-blue-300">
                                    Trung tâm Tuyển sinh
                                </Typography>
                            </div>
                        </div>
                        <Typography variant="paragraph" className="text-gray-300 leading-relaxed">
                            Với hơn 20 năm kinh nghiệm trong lĩnh vực giáo dục, chúng tôi cam kết mang đến những chương trình đào tạo chất lượng cao, đáp ứng nhu cầu của xã hội và thị trường lao động.
                        </Typography>
                        <div className="flex gap-3 pt-4">
                            <IconButton 
                                variant="text" 
                                className="text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                size="sm"
                                title="Facebook"
                            >
                                <HeartIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton 
                                variant="text" 
                                className="text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                size="sm"
                                title="Twitter"
                            >
                                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton 
                                variant="text" 
                                className="text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                size="sm"
                                title="Instagram"
                            >
                                <PhotoIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton 
                                variant="text" 
                                className="text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                size="sm"
                                title="YouTube"
                            >
                                <VideoCameraIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton 
                                variant="text" 
                                className="text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                                size="sm"
                                title="LinkedIn"
                            >
                                <LinkIcon className="h-5 w-5" />
                            </IconButton>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <Typography variant="h6" className="font-bold text-white mb-4 flex items-center gap-2">
                            <BuildingLibraryIcon className="h-5 w-5 text-blue-400" />
                            Liên kết nhanh
                        </Typography>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Về chúng tôi</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Chương trình đào tạo</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Học bổng</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Tin tức & Sự kiện</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Tuyển dụng</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Admissions */}
                    <div className="space-y-4">
                        <Typography variant="h6" className="font-bold text-white mb-4 flex items-center gap-2">
                            <UserGroupIcon className="h-5 w-5 text-blue-400" />
                            Tuyển sinh
                        </Typography>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Tuyển sinh Đại học</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Tuyển sinh Cao đẳng</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Tuyển sinh Liên thông</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Hướng dẫn đăng ký</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 group">
                                    <ChevronRightIcon className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    <span>Câu hỏi thường gặp</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <Typography variant="h6" className="font-bold text-white mb-4 flex items-center gap-2">
                            <NewspaperIcon className="h-5 w-5 text-blue-400" />
                            Thông tin liên hệ
                        </Typography>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPinIcon className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <Typography variant="small" className="text-gray-300">
                                        Khu công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                <div>
                                    <Typography variant="small" className="text-gray-300">
                                        Hotline: 1900 1234
                                    </Typography>
                                    <Typography variant="small" className="text-gray-300">
                                        Tel: (028) 1234 5678
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                <div>
                                    <Typography variant="small" className="text-gray-300">
                                        tuyensinh@university.edu.vn
                                    </Typography>
                                    <Typography variant="small" className="text-gray-300">
                                        info@university.edu.vn
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-400 p-2 rounded">
                                    <Typography variant="small" className="text-white font-bold">
                                        24/7
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="small" className="text-gray-300">
                                        Hỗ trợ trực tuyến
                                    </Typography>
                                    <Typography variant="small" className="text-blue-400">
                                        Chat ngay
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <Typography variant="small" className="text-gray-400">
                                © {new Date().getFullYear()} Đại học ABC. Tất cả quyền được bảo lưu.
                            </Typography>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                                Điều khoản sử dụng
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                                Sơ đồ trang
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm">
                                RSS
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default ClientFooter;
