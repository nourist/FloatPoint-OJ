import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from './types/user.type';

export const middleware = async (req: NextRequest) => {
	console.log('New request to private route', req.url);

	const token = req.cookies.get('access_token')?.value;

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET ?? 'secretKey'));

		if (req.nextUrl.pathname.startsWith('/admin') && payload.role != UserRole.ADMIN) {
			return NextResponse.redirect(new URL('/', req.url));
		}

		return NextResponse.next();
	} catch (err) {
		console.log('Invalid token provided', err);
		return NextResponse.redirect(new URL('/login', req.url));
	}
};

export const config = {
	matcher: ['/blog/create', '/blog/:slug/edit', '/submission/:id', '/submit', '/admin/:path*'],
};
