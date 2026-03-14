import { Phone, User, Heart } from 'lucide-react';

interface ParentInfoCardProps {
  parentName: string;
  emergencyPhone: string;
  relationship: string;
}

export const ParentInfoCard = ({
  parentName,
  emergencyPhone,
  relationship,
}: ParentInfoCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Heart className="text-indigo-600" size={32} />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Thông tin Phụ huynh</h3>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <User className="text-indigo-600" size={20} />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Tên phụ huynh</p>
            <p className="font-medium text-gray-800">{parentName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-indigo-600" size={20} />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Số điện thoại khẩn cấp</p>
            <p className="font-medium text-gray-800">{emergencyPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Heart className="text-indigo-600" size={20} />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Mối quan hệ</p>
            <p className="font-medium text-gray-800">{relationship}</p>
          </div>
        </div>
      </div>
    </div>
  );
};