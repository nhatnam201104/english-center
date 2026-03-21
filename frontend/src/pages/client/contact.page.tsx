import {
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
    Typography,
    IconButton,
} from "@material-tailwind/react";
// Lưu ý: Bạn cần cài đặt lucide-react hoặc sử dụng icon tương tự
import { Phone, Mail, MapPin, Clock, Send, Facebook, Youtube } from "lucide-react";

const ContactPage = () => {


    return (
        <div className="min-h-screen bg-white py-12 lg:py-20">
            <div className="mx-auto max-w-7xl px-4">

                {/* Header Section */}
                <div className="mb-16 text-center">
                    <Typography variant="h1" className="mb-4 text-4xl font-black text-blue-gray-900 lg:text-5xl">
                        Kết nối với chúng tôi
                    </Typography>
                    <Typography className="mx-auto max-w-2xl text-lg font-normal text-blue-gray-600">
                        Đội ngũ tư vấn của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn về lộ trình học tập và các ưu đãi mới nhất.
                    </Typography>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

                    {/* Left Column: Contact Info & Map */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-6">
                            <Typography variant="h4" className="font-bold text-blue-gray-900">
                                Thông tin liên hệ
                            </Typography>

                            <div className="space-y-4">
                                {[
                                    { icon: <Phone size={20} />, label: "Hotline", value: "1900 1234", color: "text-blue-600" },
                                    { icon: <Mail size={20} />, label: "Email", value: "tuyensinh@university.edu.vn", color: "text-red-500" },
                                    { icon: <MapPin size={20} />, label: "Địa chỉ", value: "Khu công nghệ cao, TP. Thủ Đức, TP.HCM", color: "text-green-500" },
                                    { icon: <Clock size={20} />, label: "Giờ làm việc", value: "8:00 - 17:00 (Thứ Hai - Thứ Sáu)", color: "text-orange-500" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50/50 transition-colors">
                                        <div className={`${item.color} bg-white p-3 rounded-lg shadow-sm border border-gray-100`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <Typography variant="small" className="font-bold uppercase tracking-wider text-blue-gray-400">
                                                {item.label}
                                            </Typography>
                                            <Typography className="font-medium text-blue-gray-800">
                                                {item.value}
                                            </Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="pt-4">
                            <Typography variant="small" className="mb-3 font-bold text-blue-gray-900">
                                Theo dõi chúng tôi trên:
                            </Typography>
                            <div className="flex gap-2">
                                <a
                                    href="https://www.facebook.com/TruongDaihocSaiGon.SGU?locale=vi_VN"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <IconButton variant="outlined" color="blue" className="rounded-full">
                                        <Facebook size={20} />
                                    </IconButton>
                                </a>
                                <IconButton variant="outlined" color="red" className="rounded-full"><Youtube size={20} /></IconButton>
                            </div>
                        </div>

                        {/* Google Map Thực Tế */}
                        <div className="h-64 w-full overflow-hidden rounded-2xl border border-blue-gray-100 bg-blue-gray-50 shadow-inner lg:h-80">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485398611095!2d106.7844!3d10.8506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUxJzAyLjIiTiAxMDbCsDQ3JzA3LjgiRQ!5e0!3m2!1svi!2svn!4v1710750000000!5m2!1svi!2svn"
                                className="h-full w-full border-0" // Dùng Tailwind thay cho style="border:0"
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7">
                        <Card className="border border-blue-gray-100 shadow-2xl shadow-blue-gray-500/10">
                            <CardBody className="p-8 lg:p-12">
                                <Typography variant="h4" className="mb-2 font-bold text-blue-gray-900">
                                    Gửi yêu cầu tư vấn
                                </Typography>
                                <Typography className="mb-8 font-normal text-blue-gray-600">
                                    Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại với bạn trong vòng 24h làm việc.
                                </Typography>

                                <form className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <Input
                                            size="lg"
                                            label="Họ và tên"

                                            required
                                            className="!border-t-blue-gray-200 focus:!border-blue-500"
                                        />
                                        <Input
                                            size="lg"
                                            type="email"
                                            label="Email"

                                            required
                                            className="!border-t-blue-gray-200 focus:!border-blue-500"
                                        />
                                    </div>

                                    <Input
                                        size="lg"
                                        label="Số điện thoại"
                                        placeholder="090x xxx xxx"
                                    />

                                    <Textarea
                                        size="lg"
                                        label="Nội dung cần hỗ trợ"
                                        rows={6}

                                        required
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        className="flex items-center justify-center gap-3 bg-blue-700 normal-case shadow-lg shadow-blue-500/30"
                                    >
                                        <Send size={18} /> Gửi yêu cầu ngay
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;