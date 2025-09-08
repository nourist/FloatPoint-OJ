'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { AsyncCombobox, FetcherResponse } from '~/components/async-combobox';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { createClientService } from '~/lib/service-client';
import { contestServiceInstance } from '~/services/contest';
import { problemServiceInstance } from '~/services/problem';
import { Contest } from '~/types/contest.type';
import { Problem } from '~/types/problem.type';

interface ProblemsTabProps {
	contest: Contest;
	onContestUpdate: (updatedContest: Contest) => void;
}

export function ProblemsTab({ contest, onContestUpdate }: ProblemsTabProps) {
	const t = useTranslations('admin.contest.detail');
	const [selectedProblemId, setSelectedProblemId] = useState<string>('');
	const [addingProblemId, setAddingProblemId] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [problemToRemove, setProblemToRemove] = useState<Problem | null>(null);
	const contestService = createClientService(contestServiceInstance);
	const problemService = createClientService(problemServiceInstance);

	// Fetcher function for async combobox
	const fetchProblems = async (page: number, limit: number, query: string): Promise<FetcherResponse> => {
		try {
			const response = await problemService.findAllProblems({
				page,
				limit,
				q: query,
			});

			const items = response.problems.map((problem) => ({
				value: problem.id,
				label: problem.title,
			}));

			return {
				items,
				has_more: response.problems.length === limit,
			};
		} catch (error) {
			console.error('Failed to fetch problems:', error);
			return {
				items: [],
				has_more: false,
			};
		}
	};

	const handleAddProblem = async () => {
		if (!selectedProblemId) return;

		setAddingProblemId(selectedProblemId);
		try {
			const response = await contestService.addProblemsToContest(contest.id, { problemIds: [selectedProblemId] });
			onContestUpdate(response.contest);
			toast.success(t('problem_added'));
			setSelectedProblemId('');
		} catch (error) {
			console.error('Failed to add problem:', error);
			toast.error(t('failed_to_add_problem'));
		} finally {
			setAddingProblemId(null);
		}
	};

	const handleRemoveClick = (problem: Problem) => {
		setProblemToRemove(problem);
		setIsDialogOpen(true);
	};

	const handleRemoveConfirm = async () => {
		if (!problemToRemove) return;

		try {
			const response = await contestService.removeProblemFromContest(contest.id, problemToRemove.id);
			onContestUpdate(response.contest);
			toast.success(t('problem_removed'));
		} catch (error) {
			console.error('Failed to remove problem:', error);
			toast.error(t('failed_to_remove_problem'));
		} finally {
			setIsDialogOpen(false);
			setProblemToRemove(null);
		}
	};

	const handleRemoveCancel = () => {
		setIsDialogOpen(false);
		setProblemToRemove(null);
	};

	return (
		<>
			{contest.problems && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t('problem_title')}</TableHead>
							<TableHead className="w-[100px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contest.problems.map((problem) => (
							<TableRow key={problem.id}>
								<TableCell className="font-medium">
									<Link className="hover:text-primary hover:underline" href={`/admin/problem/${problem.slug}`}>
										{problem.title}
									</Link>
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleRemoveClick(problem)}
										className="text-destructive hover:text-destructive hover:bg-destructive/10 mx-auto rounded-full"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
						{contest.problems.length === 0 && (
							<TableRow>
								<TableCell colSpan={2} className="h-24 text-center">
									No problems added to this contest
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			)}

			<div className="flex items-center gap-2">
				<AsyncCombobox value={selectedProblemId} set_value={setSelectedProblemId} fetcher={fetchProblems} placeholder={t('search_problems')} />
				<Button onClick={handleAddProblem} disabled={!selectedProblemId || addingProblemId === selectedProblemId}>
					{addingProblemId === selectedProblemId ? t('adding') : t('add')}
				</Button>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('remove_problem_title')}</DialogTitle>
						<DialogDescription>
							{t('remove_problem_description', { title: problemToRemove?.title ?? '' })}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleRemoveCancel}>
							{t('remove_problem_cancel')}
						</Button>
						<Button variant="destructive" onClick={handleRemoveConfirm}>
							{t('remove_problem_confirm')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}