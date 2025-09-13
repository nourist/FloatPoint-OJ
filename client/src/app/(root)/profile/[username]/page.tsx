import { notFound } from 'next/navigation';

import { ProfileContent } from '~/app/(root)/profile/[username]/_components/profile-content';
import { ProfileSidebar } from '~/app/(root)/profile/[username]/_components/profile-sidebar';
import { ProfileTabs } from '~/app/(root)/profile/[username]/_components/profile-tabs';
import { createServerService } from '~/lib/service-server';
import { authServiceInstance } from '~/services/auth';
import { blogServiceInstance } from '~/services/blog';
import { submissionServiceInstance } from '~/services/submission';
import { userServiceInstance } from '~/services/user';
import { SubmissionStatus } from '~/types/submission.type';

const ProfilePage = async ({ params }: { params: Promise<{ username: string }> }) => {
	// Await params to get username
	const { username } = await params;

	// Create server services
	const [userService, submissionService, authService, blogService] = await Promise.all([
		createServerService(userServiceInstance),
		createServerService(submissionServiceInstance),
		createServerService(authServiceInstance),
		createServerService(blogServiceInstance),
	]);

	// Fetch user and current user data in parallel
	const [userResponse, currentUser] = await Promise.all([userService.getUserByUsername(username).catch(() => null), authService.getProfile().catch(() => null)]);

	// Handle user not found
	if (!userResponse?.user) {
		notFound();
	}

	const user = userResponse.user;

	// Fetch user-specific data in parallel including ranking and activity
	const [
		userStatsResponse,
		userSubmissions,
		recentAcSubmissions,
		recentSubmissions,
		userRanking,
		activityData,
		difficultyData,
		ratingHistoryData,
		languageData,
		userBlogsResponse,
	] = await Promise.all([
		userService.getUserStatistics(username).catch(() => null),
		submissionService.findAllSubmissions({ authorId: user.id, limit: 1000 }).catch(() => ({ submissions: [] })),
		submissionService
			.findAllSubmissions({
				authorId: user.id,
				status: SubmissionStatus.ACCEPTED,
				limit: 10,
			})
			.catch(() => ({ submissions: [] })),
		submissionService
			.findAllSubmissions({
				authorId: user.id,
				limit: 10,
			})
			.catch(() => ({ submissions: [] })),
		userService.getUserRanking(username).catch(() => null),
		submissionService.getSubmissionActivity(user.id).catch(() => null),
		userService.getUserAcProblemsByDifficulty(username).catch(() => null),
		userService.getUserRatingHistory(username).catch(() => null),
		userService.getUserAcSubmissionsByLanguage(username).catch(() => null),
		blogService.getBlogsByUserId(user.id, 5).catch(() => ({ blogs: [] })),
	]);

	// Get real blog data from API response
	const userBlogs = userBlogsResponse?.blogs || [];

	return (
		<div className="flex flex-col gap-6 xl:flex-row">
			<ProfileSidebar
				user={user}
				stats={userStatsResponse?.statistics}
				submissions={userSubmissions.submissions || []}
				currentUser={currentUser || null}
				ranking={userRanking?.ranking}
			/>
			<div className="w-full flex-1 space-y-6 xl:w-auto">
				<ProfileContent
					user={user}
					stats={userStatsResponse?.statistics}
					submissions={userSubmissions.submissions || []}
					currentUser={currentUser || null}
					activityData={activityData || undefined}
					difficultyData={difficultyData?.data}
					ratingHistoryData={ratingHistoryData?.data}
					languageData={languageData?.data}
				/>
				<ProfileTabs
					recentAcSubmissions={recentAcSubmissions.submissions || []}
					recentSubmissions={recentSubmissions.submissions || []}
					blogs={userBlogs}
					isCurrentUser={currentUser?.username === user.username}
				/>
			</div>
		</div>
	);
};

export default ProfilePage;
