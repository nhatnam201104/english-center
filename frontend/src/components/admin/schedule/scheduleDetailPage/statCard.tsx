const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black text-slate-400 tracking-widest">
          {label}
        </span>
        {icon}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
};

export default StatCard;
