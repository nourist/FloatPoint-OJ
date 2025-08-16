import { NextResponse } from 'next/server';

import { verifyEmail } from '~/services/auth';

export const GET = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get('token');

	if (!token) {
		return NextResponse.json({ error: 'Token is required' }, { status: 400 });
	}

	try {
		const email = await verifyEmail(token);
		return NextResponse.redirect(new URL(`/verify-success?email=${email}`, request.url));
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json({ error: error ?? 'Unknown error' }, { status: 500 });
	}
};
