import React from 'react';
import { Shield, GraduationCap, Users, TrendingUp } from 'lucide-react';

interface Props {
  onStartTest: () => void;
  onViewCourses: () => void;
}

const ToeicLanding: React.FC<Props> = ({ onStartTest, onViewCourses }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl w-full space-y-16">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
              Công nghệ giáo dục thế hệ mới
            </span>

            {/* Headline */}
            <h1 className="font-sans text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Nâng cao điểm TOEIC <br />
              <span className="text-blue-500">cùng trí tuệ nhân tạo</span>
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-lg mb-8 max-w-lg leading-relaxed">
              Lộ trình học TOEIC bài bản từ cơ bản đến 900+ với thuật toán AI độc quyền, cá nhân hóa bài luyện và phản hồi chi tiết.
            </p>

            {/* Buttons */}
            <div className="font-sans flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-md text-center"
                onClick={onStartTest}
              >
                Làm bài kiểm tra TOEIC miễn phí
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-lg border border-gray-200 transition-colors shadow-sm text-center"
                onClick={onViewCourses}
              >
                Xem khóa học
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Lớp học" 
                className="w-full h-auto object-cover min-h-[400px]"
              />
              
              <div className="absolute inset-0 bg-blue-900/10"></div>
            </div>

            {/* Floating Card Widget */}
            <div className="absolute bottom-6 right-6 bg-white bg-opacity-95 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs animate-fade-in-up">
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mức cải thiện TB</p>
                <p className="text-xl font-bold text-green-600">+140 điểm</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- STATS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-full">
              <Shield className="w-8 h-8 text-blue-500 fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">98%</h3>
              <p className="text-gray-500 text-lg font-medium">Tỷ lệ thành công</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Cựu ETS</h3>
              <p className="text-gray-500 text-lg font-medium">Giảng viên chuyên gia</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">&lt;15</h3>
              <p className="text-gray-500 text-lg font-medium">Sĩ số mỗi lớp</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ToeicLanding;