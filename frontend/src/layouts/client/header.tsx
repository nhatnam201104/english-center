import {
  Typography,
  Button,
  IconButton,
  Collapse,
  Input,
  Avatar,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import RegistrationDialog from "../../components/client/exam/registration-dialog";

const ClientHeader = () => {
  const [openNav, setOpenNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openExamDialog, setOpenExamDialog] = useState(false);
  const navigate = useNavigate();

  // ✅ Close mobile nav when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105"
      >
        <Link to="/" className="flex items-center gap-2">
          <BuildingLibraryIcon className="h-4 w-4" />
          Trang chủ
        </Link>
      </Typography>
      
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105"
      >
        <Link to="/tuyen-sinh" className="flex items-center gap-2">
          <UserGroupIcon className="h-4 w-4" />
          Tuyển sinh
        </Link>
      </Typography>
      
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105"
      >
        <Link to="/dao-tao" className="flex items-center gap-2">
          <BuildingLibraryIcon className="h-4 w-4" />
          Đào tạo
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105"
      >
        <Link to="/tin-tuc" className="flex items-center gap-2">
          <NewspaperIcon className="h-4 w-4" />
          Tin tức
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105"
      >
        <Link to="/lien-he" className="flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          Liên hệ
        </Link>
      </Typography>
    </ul>
  );

  return (
    <div className="w-full sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded-lg transition-all duration-300 cursor-pointer">
                <PhoneIcon className="h-4 w-4" />
                <span className="font-medium">Hotline: 1900 1234</span>
              </div>

              <div className="hidden md:flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded-lg transition-all duration-300 cursor-pointer">
                <EnvelopeIcon className="h-4 w-4" />
                <span className="font-medium">tuyensinh@university.edu.vn</span>
              </div>

              <div className="hidden lg:flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded-lg transition-all duration-300 cursor-pointer">
                <ClockIcon className="h-4 w-4" />
                <span className="font-medium">8:00 - 17:00 (T2-T6)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded-lg transition-all duration-300 cursor-pointer">
                <GlobeAltIcon className="h-4 w-4" />
                <span className="font-medium">EN</span>
              </div>

              <Button
                variant="text"
                size="sm"
                className="text-white hover:bg-blue-700 normal-case transition-all duration-300 flex items-center gap-2"
                onClick={() => navigate("/auth/login")}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Đăng nhập
              </Button>

              <Button
                variant="gradient"
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 normal-case transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                onClick={() => setOpenExamDialog(true)}
              >
                <UserPlusIcon className="h-4 w-4" />
                Đăng ký thi đầu vào
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-lg border-b border-blue-gray-100 px-0 py-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <Typography
                variant="h5"
                color="blue-gray"
                className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
              >
                Đại học ABC
              </Typography>
              <Typography variant="small" color="gray" className="text-xs font-medium">
                Trung tâm Tuyển sinh - Nơi khởi đầu tương lai
              </Typography>
            </div>
          </div>

          {/* Search (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm ngành học, thông tin tuyển sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 border-blue-gray-200 focus:border-blue-500"
                labelProps={{ className: "hidden" }}
              />
              <Button
                size="sm"
                className="!absolute right-1 top-1 rounded bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:block">{navList}</div>

          {/* Avatar (desktop) */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            <Avatar
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=32&h=32&fit=crop&crop=face"
              alt="User"
              size="sm"
              className="border-2 border-blue-600 cursor-pointer hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Mobile toggle */}
          <IconButton
            variant="text"
            className="lg:hidden ml-auto hover:bg-blue-50 transition-colors duration-300"
            onClick={() => setOpenNav((v) => !v)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6 text-blue-gray-700" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6 text-blue-gray-700" strokeWidth={2} />
            )}
          </IconButton>
        </div>

        {/* Mobile Navigation */}
        <Collapse open={openNav}>
          <div className="container mx-auto px-4 py-4 border-t border-blue-gray-100">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 border-blue-gray-200 focus:border-blue-500"
                labelProps={{ className: "hidden" }}
              />
            </div>

            {navList}

            <div className="mt-4 pt-4 border-t border-blue-gray-100">
              <div className="flex items-center justify-center gap-3">
                <Avatar
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=32&h=32&fit=crop&crop=face"
                  alt="User"
                  size="sm"
                  className="border-2 border-blue-600"
                />
                <Typography variant="small" className="font-medium text-blue-gray-700">
                  Chào mừng bạn!
                </Typography>
              </div>
            </div>
          </div>
        </Collapse>
      </div>

      <RegistrationDialog
        open={openExamDialog}
        onClose={() => setOpenExamDialog(false)}
      />
    </div>
  );
};

export default ClientHeader;
