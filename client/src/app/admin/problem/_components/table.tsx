import { Check, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { getDifficultyTextColor } from '~/lib/difficulty-utils';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';
import { Problem } from '~/types/problem.type';

interface Props {
	problems: Problem[];
	mutate: () => void; // SWR mutate function to re-fetch data
}

const ProblemTable = ({ problems, mutate }: Props) => {
	const t = useTranslations('admin.problem.table');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [problemToDelete, setProblemToDelete] = useState<Problem | null>(null);
	const problemService = createClientService(problemServiceInstance);

	const handleDeleteClick = (problem: Problem) => {
		setProblemToDelete(problem);
		setIsDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!problemToDelete) return;

		try {
			await problemService.deleteProblem(problemToDelete.id);
			toast.success('Problem deleted successfully');
			mutate(); // Re-fetch the data
		} catch (error) {
			toast.error('Failed to delete problem');
			console.error('Delete error:', error);
		} finally {
			setIsDialogOpen(false);
			setProblemToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setIsDialogOpen(false);
		setProblemToDelete(null);
	};

	return (
		<>
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
							<TableCell>
								<Link className="hover:text-primary" href={`/admin/problem/${item.slug}`}>
									{item.title}
								</Link>
							</TableCell>
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
							<TableCell>
								<Button variant="destructive" size="icon" className="size-7 rounded-full" onClick={() => handleDeleteClick(item)}>
									<Trash className="size-3.5" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Delete</DialogTitle>
						<DialogDescription>Are you sure you want to delete the problem &quot;{problemToDelete?.title}&quot;? This action cannot be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleDeleteCancel}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteConfirm}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProblemTable;
