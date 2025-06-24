import { create } from 'zustand';

// eslint-disable-next-line no-unused-vars
const useAuthStore = create((set) => ({
	user: null,
	isAuth: false,
}));

export default useAuthStore;
