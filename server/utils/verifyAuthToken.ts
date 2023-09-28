import jwt from "jsonwebtoken";

export function verifyAuthToken(event: any) {
	const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

	if (!SUPABASE_JWT_SECRET) {
		throw new Error("SUPABASE_JWT_SECRET is not defined in environment variables.");
	}

	const authToken: string = getHeader(event, 'authorization') || ''
	const token = authToken.replace("Bearer ", "");

	// @ts-ignore
	return jwt.verify(token, SUPABASE_JWT_SECRET, function (err: any, decoded: any) {
		if (err) throw createError({ statusCode: 500, statusMessage: 'User not authenticated' });
	});
}
