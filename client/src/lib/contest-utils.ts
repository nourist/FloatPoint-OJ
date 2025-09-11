import { Contest, ContestStatus } from '../types/contest.type';

/**
 * Get the current status of a contest based on its start and end times
 * @param contest The contest object
 * @returns The current status of the contest
 */
export function getContestStatus(contest: Contest): ContestStatus {
	const now = new Date();
	const startTime = new Date(contest.startTime);
	const endTime = new Date(contest.endTime);
	
	if (now < startTime) {
		return ContestStatus.PENDING;
	} else if (now >= startTime && now <= endTime) {
		return ContestStatus.RUNNING;
	} else {
		return ContestStatus.ENDED;
	}
}