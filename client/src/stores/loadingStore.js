import { create } from 'zustand';

const useLoadingStore = create((set) => ({
	isLoading: false,
	setLoading(state) {
		set({ isLoading: state });
	},
}));

export default useLoadingStore;
