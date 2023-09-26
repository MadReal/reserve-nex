export default defineNuxtRouteMiddleware(async () => {
	const supabaseClient = useSupabaseClient();
	const storeAuth = useAuthStore();

	const { data } = await supabaseClient.auth.getSession();
	const authToken: string | undefined = data?.session?.access_token

	if (!supabaseClient || !authToken) return navigateTo("/auth/login");
	else storeAuth.setAuthToken(authToken);
});
