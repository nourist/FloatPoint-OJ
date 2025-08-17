import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
	console.log('New request to private route', req.url);

	const token = req.cookies.get('access_token')?.value;

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	try {
		await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET ?? 'secretKey'));
		return NextResponse.next();
	} catch (err) {
		console.log('Invalid token provided', err);
		return NextResponse.redirect(new URL('/login', req.url));
	}
};

export const config = {
	matcher: ['/create/blog/:path*'],
};
