import { Check, Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { getDifficultyTextColor } from '~/lib/difficulty-utils';
import { Problem } from '~/types/problem.type';

interface Props {
	problems: Problem[];
}

const ProblemTable = ({ problems }: Props) => {
	const t = useTranslations('admin.problem.table');

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t('title')}</TableHead>
					<TableHead>{t('tags')}</TableHead>
					<TableHead>{t('difficulty')}</TableHead>
					<TableHead>{t('point')}</TableHead>
					<TableHead>{t('accepted')}</TableHead>
					<TableHead>{t('acceptance')}</TableHead>
					<TableHead>{t('editorial')}</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{problems.map((item) => (
					<TableRow key={item.id}>
						<TableCell>{item.title}</TableCell>
						<TableCell>
							{item.tags.map((tag) => (
								<Badge key={tag.id} className="mr-1 capitalize" variant="outline">
									{tag.name}
								</Badge>
							))}
						</TableCell>
						<TableCell className={getDifficultyTextColor(item.difficulty)}>{t(item.difficulty)}</TableCell>
						<TableCell>{item.point}</TableCell>
						<TableCell>{item.acCount}</TableCell>
						<TableCell>{Math.round((item.acRate ?? 0) * 100)}%</TableCell>
						<TableCell>{item.editorial && <Check className="text-success mx-5 size-4" />}</TableCell>
						<TableCell className="space-x-1">
							<Button size="icon" className="size-7 rounded-full">
								<Pencil className="size-3.5" />
							</Button>
							<Button variant="destructive" size="icon" className="size-7 rounded-full">
								<Trash className="size-3.5" />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default ProblemTable;
