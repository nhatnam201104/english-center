type TimeSlot = {
  label: string;
  from: string;
  to: string;
};

export const TIME_SLOTS_90: TimeSlot[] = [
  { label: "07:30 - 09:00", from: "07:30", to: "09:00"},
  { label: "09:15 - 10:45", from: "09:15", to: "10:45"},
  { label: "13:30 - 15:00", from: "13:30", to: "15:00"},
  { label: "15:15 - 16:45", from: "15:15", to: "16:45"},
  { label: "18:00 - 19:30", from: "18:00", to: "19:30"},
  { label: "19:45 - 21:15", from: "19:45", to: "21:15"},
];
export const TIME_SLOTS_120: TimeSlot[] = [
  { label: "08:00 - 10:00", from: "08:00", to: "10:00" },
  { label: "09:00 - 11:00", from: "09:00", to: "11:00" },
  { label: "13:30 - 15:30", from: "13:30", to: "15:30" },
  { label: "15:30 - 17:30", from: "15:30", to: "17:30" },
  { label: "18:00 - 20:00", from: "18:00", to: "20:00"},
  { label: "19:00 - 21:00", from: "19:00", to: "21:00"},
];
