'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { Contest } from '~/types/contest.type';
import { User } from '~/types/user.type';

interface JoinLeaveButtonProps {
	contest: Contest;
	user: User | null;
	onContestUpdate: (contest: Contest) => void;
	onUserUpdate: () => void;
}

export function JoinLeaveButton({ contest, user, onContestUpdate, onUserUpdate }: JoinLeaveButtonProps) {
	const t = useTranslations('contest.detail');
	const contestService = createClientService(contestServiceInstance);
	const authService = createClientService(authServiceInstance);
	const [loading, setLoading] = useState(false);

	if (!user) {
		return null;
	}

	const isJoined = user.joiningContest?.id === contest.id;

	const handleJoinLeave = async () => {
		if (!user) return;
		setLoading(true);
		try {
			if (isJoined) {
				await contestService.leaveContest(contest.id);
				toast.success(t('leave_success'));
			} else {
				await contestService.joinContest(contest.id);
				toast.success(t('join_success'));
			}
			// Refetch contest detail to update participants list
			const updatedContest = await contestService.findOneContest(contest.slug);
			onContestUpdate(updatedContest.contest);
			
			// Refetch user data to update joiningContest field
			onUserUpdate();
		} catch (error) {
			console.error('Failed to join/leave contest:', error);
			toast.error(isJoined ? t('leave_fail') : t('join_fail'));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button onClick={handleJoinLeave} disabled={loading} variant={isJoined ? 'destructive' : 'default'}>
			{loading ? (isJoined ? t('leaving') : t('joining')) : isJoined ? t('leave') : t('join')}
		</Button>
	);
}