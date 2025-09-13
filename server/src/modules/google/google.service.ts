import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleService {
	private readonly logger = new Logger(GoogleService.name);

	async getUser(accessToken: string) {
		this.logger.log('Fetching user from Google API');

		try {
			const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			this.logger.log('User fetched from Google API');
			return response;
		} catch (error) {
			this.logger.error('Error fetching user from Google API', error);
			throw error;
		}
	}
}
