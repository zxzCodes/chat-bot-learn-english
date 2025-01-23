import { create } from "zustand";

interface PremiumModalState {
  open: boolean;
  setOpen: (open: boolean) => void;

}

const useModel = create<PremiumModalState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
 
  

}));




export default useModel;
