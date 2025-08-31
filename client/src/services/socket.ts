import { Socket, io } from 'socket.io-client';

import { getApiUrl } from '~/lib/utils';
import { Submission } from '~/types/submission.type';

class SocketService {
	private socket: Socket | null = null;

	connect() {
		if (this.socket?.connected) {
			console.log('Socket already connected');
			return;
		}

		console.log('Connecting to socket at:', getApiUrl());
		this.socket = io(getApiUrl(), {
			withCredentials: true,
			transports: ['websocket', 'polling'],
		});

		this.socket.on('connect', () => {
			console.log('✅ Socket connected successfully! Socket ID:', this.socket?.id);
		});

		this.socket.on('disconnect', (reason) => {
			console.log('❌ Socket disconnected. Reason:', reason);
		});

		this.socket.on('connect_error', (error) => {
			console.error('❌ Socket connection error:', error);
		});

		// Log all events for debugging
		this.socket.onAny((event, ...args) => {
			console.log('📥 Received socket event:', event, args);
		});
	}

	disconnect() {
		if (this.socket) {
			console.log('Disconnecting socket');
			this.socket.disconnect();
			this.socket = null;
		}
	}

	onSubmissionUpdate(callback: (data: Submission) => void) {
		if (!this.socket) {
			console.log('Connecting socket for submission updates');
			this.connect();
		}

		this.socket?.on('submission_update', callback);

		// Return a function to unsubscribe
		return () => {
			this.socket?.off('submission_update', callback);
		};
	}
}

export const socketService = new SocketService();
