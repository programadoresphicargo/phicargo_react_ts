import { create } from 'zustand';

export type Page = 'drivers' | 'availability' | 'vehicles';

interface PageState {
  page: Page;
  changePage: (page: Page) => void;
}

export const usePageStore = create<PageState>()((set) => ({
  page: 'drivers',
  changePage: (page) => set({ page }),
}));
