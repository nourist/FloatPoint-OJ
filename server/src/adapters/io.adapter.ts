import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
	constructor(
		app: INestApplicationContext,
		private readonly configService: ConfigService,
	) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions): Server {
		const clientUrl = this.configService.get<string>('CLIENT_URL');

		const server = super.createIOServer(port, {
			...options,
			cors: {
				origin: clientUrl,
				credentials: true,
			},
		}) as Server; // ✅ ép kiểu rõ ràng

		return server;
	}
}
