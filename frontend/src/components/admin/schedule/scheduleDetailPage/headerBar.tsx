import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@material-tailwind/react";

const HeaderBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-4">
      <Button
        variant="text"
        className="text-blue-600 hover:bg-blue-50"
        onClick={() => navigate("/admin/schedules")}
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </Button>
      <h1 className="text-xl font-bold text-slate-700">
        Chi tiết đợt mở lớp
      </h1>
    </div>
  );
};

export default HeaderBar;
