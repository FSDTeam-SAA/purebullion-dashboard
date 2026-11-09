import { create } from "zustand";

export interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  unreadNotificationsCount: number;
  setUnreadNotificationsCount: (count: number) => void;

  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  unreadNotificationsCount: 0,
  setUnreadNotificationsCount: (count) => set({ unreadNotificationsCount: count }),

  notificationDrawerOpen: false,
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  toggleNotificationDrawer: () => set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),
}));

export default useUIStore;
