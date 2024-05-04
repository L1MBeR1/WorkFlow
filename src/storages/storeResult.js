import { create } from 'zustand';

const ResultPanelStatus = create((set) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));

export default ResultPanelStatus;
