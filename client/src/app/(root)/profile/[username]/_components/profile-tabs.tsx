'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Submission } from '~/types/submission.type';

interface Blog {
	id: string;
	title: string;
	slug: string;
	description?: string;
	createdAt: Date;
}

interface ProfileTabsProps {
	recentAcSubmissions: Submission[];
	recentSubmissions: Submission[];
	blogs: Blog[];
	isCurrentUser?: boolean;
}

export const ProfileTabs = ({ recentAcSubmissions, recentSubmissions, blogs }: ProfileTabsProps) => {
	const [activeTab, setActiveTab] = useState<'ac' | 'submissions' | 'blogs'>('ac');
	const t = useTranslations('profile.tabs');

	// Group AC submissions by problem to show unique problems only
	const groupedAcSubmissions = recentAcSubmissions.reduce(
		(acc, submission) => {
			const problemId = submission.problem.id;
			if (!acc[problemId]) {
				acc[problemId] = {
					problem: submission.problem,
					firstSolvedDate: submission.submittedAt,
					language: submission.language,
					solveCount: 1,
				};
			} else {
				// Keep track of solve count and use the earliest solved date
				acc[problemId].solveCount += 1;
				if (new Date(submission.submittedAt) < new Date(acc[problemId].firstSolvedDate)) {
					acc[problemId].firstSolvedDate = submission.submittedAt;
					acc[problemId].language = submission.language;
				}
			}
			return acc;
		},
		{} as Record<
			string,
			{
				problem: (typeof recentAcSubmissions)[0]['problem'];
				firstSolvedDate: Date;
				language: string;
				solveCount: number;
			}
		>,
	);

	const uniqueAcProblems = Object.values(groupedAcSubmissions).sort((a, b) => new Date(b.firstSolvedDate).getTime() - new Date(a.firstSolvedDate).getTime());

	return (
		<div className="bg-card rounded-2xl border shadow-xs">
			<div className="px-3 pt-4 sm:px-6 sm:pt-6">
				<div className="flex overflow-x-auto border-b">
					<button
						className={`px-2 pb-3 text-sm font-medium whitespace-nowrap sm:px-4 sm:text-base ${activeTab === 'ac' ? 'border-primary text-primary border-b-2' : 'text-muted-foreground'}`}
						onClick={() => setActiveTab('ac')}
					>
						{t('recent_solved_problems')}
					</button>
					<button
						className={`px-2 pb-3 text-sm font-medium whitespace-nowrap sm:px-4 sm:text-base ${activeTab === 'submissions' ? 'border-primary text-primary border-b-2' : 'text-muted-foreground'}`}
						onClick={() => setActiveTab('submissions')}
					>
						{t('recent_submissions')}
					</button>
					<button
						className={`px-2 pb-3 text-sm font-medium whitespace-nowrap sm:px-4 sm:text-base ${activeTab === 'blogs' ? 'border-primary text-primary border-b-2' : 'text-muted-foreground'}`}
						onClick={() => setActiveTab('blogs')}
					>
						{t('blogs')}
					</button>
				</div>
			</div>
			<div className="px-3 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6">
				{activeTab === 'ac' && (
					<div>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-base font-semibold sm:text-lg">{t('recent_solved_problems')}</h3>
						</div>
						{uniqueAcProblems.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">{t('no_accepted_submissions')}</p>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="min-w-[150px]">{t('problem')}</TableHead>
											<TableHead className="min-w-[100px]">{t('language')}</TableHead>
											<TableHead className="hidden min-w-[80px] sm:table-cell">{t('solved_count')}</TableHead>
											<TableHead className="min-w-[100px]">{t('first_solved')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{uniqueAcProblems.map((item) => (
											<TableRow key={item.problem.id}>
												<TableCell>
													<Link href={`/problem/${item.problem.slug}`} className="text-primary hover:underline">
														{item.problem.title}
													</Link>
												</TableCell>
												<TableCell>{item.language}</TableCell>
												<TableCell className="hidden sm:table-cell">
													<span className="text-muted-foreground text-sm">{item.solveCount > 1 ? `${item.solveCount}x` : '1x'}</span>
												</TableCell>
												<TableCell>{new Date(item.firstSolvedDate).toLocaleDateString()}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</div>
				)}

				{activeTab === 'submissions' && (
					<div>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-base font-semibold sm:text-lg">{t('recent_submissions')}</h3>
						</div>
						{recentSubmissions.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">{t('no_recent_submissions')}</p>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="min-w-[150px]">{t('problem')}</TableHead>
											<TableHead className="min-w-[100px]">{t('language')}</TableHead>
											<TableHead className="min-w-[100px]">{t('status')}</TableHead>
											<TableHead className="min-w-[100px]">{t('date')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentSubmissions.map((submission) => (
											<TableRow key={submission.id}>
												<TableCell>
													<Link href={`/problem/${submission.problem.slug}`} className="text-primary hover:underline">
														{submission.problem.title}
													</Link>
												</TableCell>
												<TableCell>{submission.language}</TableCell>
												<TableCell>
													<span
														className={`rounded-full px-2 py-1 text-xs font-medium ${
															submission.status === 'ACCEPTED'
																? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
																: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
														}`}
													>
														{submission.status}
													</span>
												</TableCell>
												<TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</div>
				)}

				{activeTab === 'blogs' && (
					<div>
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-base font-semibold sm:text-lg">{t('blogs')}</h3>
						</div>
						{blogs.length === 0 ? (
							<p className="text-muted-foreground py-4 text-center text-sm">{t('no_blogs')}</p>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="min-w-[150px]">{t('title')}</TableHead>
											<TableHead className="min-w-[100px]">{t('publish_date')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{blogs.map((blog) => (
											<TableRow key={blog.id}>
												<TableCell>
													<Link href={`/blog/${blog.slug}`} className="text-primary hover:underline">
														{blog.title}
													</Link>
												</TableCell>
												<TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
