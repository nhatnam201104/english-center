import { Clock } from "lucide-react";

const WeeklySchedule = ({ sessions }: { sessions: any[] }) => {
  if (!sessions?.length) return null;

  return (
    <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6 font-bold text-slate-700">
        <Clock className="text-blue-600" size={20} />
        <h2>Lịch trình hàng tuần</h2>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {sessions.map((s) => (
          <span
            key={s.id}
            className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-md font-bold"
          >
            {s.day}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100"
          >
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {s.day}
              </p>
              <p className="text-xl font-bold text-blue-700">
                {s.startTime} – {s.endTime}
              </p>
            </div>

            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <Clock size={20} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WeeklySchedule;
