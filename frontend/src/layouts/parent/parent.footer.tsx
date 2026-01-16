import { Typography } from "@material-tailwind/react";

const ParentFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <Typography variant="small" className="text-gray-600 text-center sm:text-left">
            © 2026 Cổng thông tin phụ huynh. All rights reserved.
          </Typography>
          <Typography variant="small" className="text-blue-600 font-medium">
            Hỗ trợ: support@school.edu.vn | Hotline: 1900-xxxx
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default ParentFooter;