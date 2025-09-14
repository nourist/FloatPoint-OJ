import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	handleRequest(err, user, info, context) {
		// err, user, info, context
		// user will be false if not authenticated
		// returns the user object if authenticated, or undefined if not
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return user || null;
	}
}
