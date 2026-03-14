import { create } from 'zustand';

interface StudentState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  selectedTab: 'dashboard',
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));