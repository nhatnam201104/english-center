import React from "react";

interface BadgeProps {
  icon?: any;
  text: string;
  colorClass: string;
}

const Badge: React.FC<BadgeProps> = ({ icon: Icon, text, colorClass }) => {
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
      {Icon && <Icon size={12} />}
      {text}
    </span>
  );
};

export default Badge;
