import React from 'react';
import { Ear, BookOpen, Mic, PenLine, PlayCircle } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho từng thẻ kỹ năng
interface SkillCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  isAiScored?: boolean; // Prop tùy chọn để hiển thị badge AI
}

const SkillCard: React.FC<SkillCardProps> = ({ icon: Icon, title, subtitle, isAiScored }) => {
  return (
    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-transparent hover:border-blue-100 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
      
      {/* AI Scored Badge */}
      {isAiScored && (
        <span className="absolute -top-3 -right-2 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
          Chấm điểm bằng AI
        </span>
      )}

      {/* Icon */}
      <div className="mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
        <Icon strokeWidth={2.5} size={32} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>

      {/* Subtitle */}
      <p className="text-gray-500 text-lg font-medium">{subtitle}</p>
    </div>
  );
};

const ToeicLevel: React.FC = () => {
  const skills = [
    {
      icon: Ear,
      title: "Nghe",
      subtitle: "Phân tích âm thanh",
      isAiScored: false,
    },
    {
      icon: BookOpen,
      title: "Đọc",
      subtitle: "Hiểu nội dung",
      isAiScored: false,
    },
    {
      icon: Mic,
      title: "Nói",
      subtitle: "AI chấm phát âm",
      isAiScored: true,
    },
    {
      icon: PenLine,
      title: "Viết",
      subtitle: "AI kiểm tra ngữ pháp",
      isAiScored: true,
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white flex justify-center">
      <div className="max-w-6xl w-full bg-[#ecf4fa] rounded-[2.5rem] py-16 px-8 md:px-16 flex flex-col items-center text-center">
        
        {/* --- HEADING SECTION --- */}
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-snug text-gray-900 mb-6">
        Biết trình độ TOEIC hiện tại của bạn
        </h2>
        
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
          Công cụ đánh giá bằng AI sẽ kiểm tra đủ 4 kỹ năng và dự đoán điểm TOEIC chính xác của bạn chỉ trong vòng 20 phút.
        </p>

        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
          {skills.map((skill, index) => (
            <SkillCard
              key={index}
              icon={skill.icon}
              title={skill.title}
              subtitle={skill.subtitle}
              isAiScored={skill.isAiScored}
            />
          ))}
        </div>

        {/* --- CTA BUTTON --- */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group">
          <PlayCircle className="w-6 h-6 fill-current" />
          <span>Bắt đầu bài kiểm tra TOEIC</span>
        </button>

      </div>
    </section>
  );
};

export default ToeicLevel;