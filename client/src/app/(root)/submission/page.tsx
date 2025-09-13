import SubmissionWrapper from './_components/submission-wrapper';
import { createServerService } from '~/lib/service-server';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { Contest, ContestStatus, getContestStatus } from '~/types/contest.type';

const SubmissionsPage = async () => {
	const contestService = await createServerService(contestServiceInstance);
	const authService = await createServerService(authServiceInstance);

	const [user, contests] = await Promise.all([
		authService.getProfile().catch(() => null),
		// Fetch all contests for server-side filtering
		contestService
			.findAllContests({
				page: 1,
				limit: 100,
				sortBy: 'title',
				sortOrder: 'ASC',
			})
			.then((response) => response.contests.data)
			.catch(() => []),
	]);

	// Apply contest filtering logic on server side
	const getContestOptions = () => {
		if (!user) return [];

		// Condition 1: If user is admin, always show all contests (highest priority)
		if (user.role === 'admin') {
			return contests.map((contest: Contest) => ({
				value: contest.id,
				label: contest.title,
			}));
		}

		// Condition 2: If user is joining a contest and it's currently running, show only that contest
		if (user.joiningContest) {
			const contestStatus = getContestStatus(user.joiningContest);
			if (contestStatus === ContestStatus.RUNNING) {
				return [{ value: user.joiningContest.id, label: user.joiningContest.title }];
			}
		}

		// If neither condition is met, return empty array (no contest filter shown)
		return [];
	};

	const contestOptions = getContestOptions();

	return <SubmissionWrapper user={user} contestOptions={contestOptions} />;
};

export default SubmissionsPage;
