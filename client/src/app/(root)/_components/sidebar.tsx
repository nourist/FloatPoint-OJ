'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import useSWR from 'swr';

import ContestCountdown from '~/components/contest-countdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import UserAvatar from '~/components/user-avatar';
import { createClientService } from '~/lib/service-client';
import { statisticsServiceInstance } from '~/services/statistics';
import { userServiceInstance } from '~/services/user';
import { authServiceInstance } from '~/services/auth';
import { ContestStatus, getContestStatus } from '~/types/contest.type';
import { User } from '~/types/user.type';
import { Button } from '~/components/ui/button';

interface Props {
  user: User | null;
}

const Sidebar = ({ user: initialUser }: Props) => {
  const t = useTranslations('home.sidebar');
  const userService = createClientService(userServiceInstance);
  const authService = createClientService(authServiceInstance);
  const statisticsService = createClientService(statisticsServiceInstance);

  // Use SWR for user data with error handling
  const { data: user } = useSWR(
    '/auth/me',
    () => authService.getProfile().catch(() => null),
    {
      fallbackData: initialUser,
      revalidateOnMount: true,
    }
  );

  // Use SWR for other data with default error handling
  const { data: topUsersData, error: topUsersError } = useSWR(
    '/users/top',
    () => userService.getUsers({ sortBy: 'rating', sortOrder: 'DESC', limit: 3 }).then((res) => res.users)
  );

  const { data: hotProblemsData, error: hotProblemsError } = useSWR(
    '/statistics/popular-problems',
    () => statisticsService.getPopularProblems(3).then((res) => res.data)
  );

  const { data: scoreData, error: scoreError } = useSWR(
    user ? `/user/${user.username}/score` : null,
    () => user ? userService.getUserScore(user.username).then((res) => res.score) : Promise.resolve(0)
  );

  // Handle errors for non-user APIs

	if (topUsersError) throw topUsersError;
	if (hotProblemsError) throw hotProblemsError;
	if (scoreError) throw scoreError;
	
  const topUsers = topUsersData || [];
  const hotProblems = hotProblemsData || [];
  const score = scoreData || 0;

  return (
    <div className="w-80 space-y-6 max-md:hidden">
      {user && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs">
          <h3 className="mb-4 text-lg font-semibold">{t('my_stats')}</h3>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border bg-background p-3 text-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('rating')}
              </h4>
              <p className="text-xl font-bold">{user.rating.at(-1) ?? 0}</p>
            </div>
            <div className="flex-1 rounded-lg border bg-background p-3 text-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                {t('score')}
              </h4>
              <p className="text-xl font-bold">{score}</p>
            </div>
          </div>
        </div>
      )}
      {user?.joiningContest &&
        getContestStatus(user.joiningContest) === ContestStatus.RUNNING && (
          <div className="rounded-2xl border bg-card p-6 shadow-xs">
            <h3 className="mb-4 text-lg font-semibold">
              {t('current_contest')}
            </h3>
            <div className="space-y-2">
              <Link href={`/contest/${user.joiningContest.slug}`} className="font-semibold text-primary hover:underline">{user.joiningContest.title}</Link>
              <p className="text-sm text-muted-foreground">
                {t('ending_in')}{' '}
                <ContestCountdown endTime={user.joiningContest.endTime} />
              </p>
            </div>
          </div>
        )}
      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <h3 className="mb-4 text-lg font-semibold">{t('top_raters')}</h3>
        <ul className="space-y-4">
          {topUsers.map((u, i) => (
            <li key={u.username} className="flex items-center gap-4">
              <div className="w-6 text-center font-bold">{i + 1}</div>
              <UserAvatar user={u} />
              <div className="flex-1">
                <Link
                  href={`/profile/${u.username}`}
                  className="font-semibold hover:underline"
                >
                  {u.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {t('rating')}: {u.rating.at(-1) ?? 0}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <h3 className="mb-4 text-lg font-semibold">{t('hot_problems')}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t('problem')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotProblems.map((p, i) => (
              <TableRow key={p.slug}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link href={`/problem/${p.slug}`}>{p.title}</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Sidebar;