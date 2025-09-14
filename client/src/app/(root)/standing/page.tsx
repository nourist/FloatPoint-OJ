import { PodiumSection } from './_components/podium-section';
import { UserTableSection } from './_components/user-table-section';
import { createServerService } from '~/lib/service-server';
import { userServiceInstance } from '~/services/user';
import { User } from '~/types/user.type';

const Standing = async () => {
	// Fetch top 3 users by rating and score in parallel
	const [ratingData, scoreData] = await Promise.all([
		createServerService(userServiceInstance).then((service) =>
			service.getUsers({
				sortBy: 'rating',
				sortOrder: 'DESC',
				limit: 3,
				page: 1,
			}),
		),
		createServerService(userServiceInstance).then((service) =>
			service.getUsers({
				sortBy: 'score',
				sortOrder: 'DESC',
				limit: 3,
				page: 1,
			}),
		),
	]);

	// Transform users to include rank and values
	const transformUsers = (users: User[], mode: 'rating' | 'score') => {
		return users.map((user, index) => ({
			...user,
			rank: index + 1,
			ratingValue: user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			scoreValue: (user as any).score || 0,
			mode,
		}));
	};

	const ratingUsers = transformUsers(ratingData.users, 'rating');
	const scoreUsers = transformUsers(scoreData.users, 'score');

	return (
		<div className="space-y-6">
			{/* Top 3 Podium with pre-fetched data */}
			<PodiumSection ratingUsers={ratingUsers} scoreUsers={scoreUsers} />

			{/* User Table with integrated search and pagination */}
			<UserTableSection />
		</div>
	);
};

export default Standing;
