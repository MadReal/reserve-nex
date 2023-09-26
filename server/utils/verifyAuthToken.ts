import jwt from "jsonwebtoken";

export function verifyAuthToken(event: any) {
	const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

	const authToken: string = getHeader(event, 'authorization') || ''
	const token = authToken.replace("Bearer ", "");

	// @ts-ignore
	return jwt.verify(token, SUPABASE_JWT_SECRET, function (err: any, decoded: any) {
		if (err) throw createError({ statusCode: 500, statusMessage: 'User not authenticated' });
	});
}
