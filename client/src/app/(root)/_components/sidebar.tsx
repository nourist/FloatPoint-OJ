import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

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
import { createServerService } from '~/lib/service-server';
import { statisticsServiceInstance } from '~/services/statistics';
import { userServiceInstance } from '~/services/user';
import { ContestStatus, getContestStatus } from '~/types/contest.type';
import { User } from '~/types/user.type';
import { Button } from '~/components/ui/button';

interface Props {
  user: User | null;
}

const Sidebar = async ({ user }: Props) => {
  const t = await getTranslations('home.sidebar');
  const statisticsService = await createServerService(statisticsServiceInstance);
  const userService = await createServerService(userServiceInstance);

  const [topUsers, hotProblems, score] = await Promise.all([
    userService
      .getUsers({ sortBy: 'rating', sortOrder: 'DESC', limit: 3 })
      .then((res) => res.users),
    statisticsService.getPopularProblems(3).then((res) => res.data),
    user
      ? userService.getUserScore(user.username).then((res) => res.score)
      : Promise.resolve(0),
  ]);

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
