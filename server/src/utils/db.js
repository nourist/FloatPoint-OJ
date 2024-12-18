export const transformUserData = (data) => ({
	email: data.email,
	name: data.name,
	isVerified: data.isVerified,
	permission: data.permission,
	avatar: data.avatar,
	lastLogin: data.lastLogin,
});
