import { create } from 'zustand';

const useAuthStore = create((set) => ({
	auth: false,
}));

export default useAuthStore;
