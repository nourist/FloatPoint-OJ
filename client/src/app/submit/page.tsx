'use client';

import { ArrowLeft, Play, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { Textarea } from '~/components/ui/textarea';
import { getDifficultyColor } from '~/lib/difficulty-utils';
import { languageOptions } from '~/lib/language-utils';
import { createClientService } from '~/lib/service-client';
import { cn } from '~/lib/utils';
import { createAuthService } from '~/services/auth';
import { createProblemService } from '~/services/problem';
import { createSubmissionService } from '~/services/submission';
import { Difficulty, Problem } from '~/types/problem.type';
import { ProgramLanguage } from '~/types/submission.type';
import { User } from '~/types/user.type';

const SubmitPage = () => {
	const t = useTranslations('submit.page');
	const tMessages = useTranslations('submit.messages');
	const router = useRouter();
	const searchParams = useSearchParams();
	const problemSlug = searchParams.get('problem');

	const [code, setCode] = useState('');
	const [language, setLanguage] = useState<ProgramLanguage>(ProgramLanguage.CPP17);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Services
	const { getProfile } = createClientService(createAuthService);
	const problemService = createClientService(createProblemService);

	// Use direct SWR pattern like header-toolbar.tsx line 35-37
	const { data: user, isLoading: userLoading } = useSWR('/auth/me', getProfile);
	const {
		data: problemData,
		error: problemError,
		isLoading: problemLoading,
	} = useSWR(problemSlug ? `/problem/${problemSlug}` : null, () => problemService.getProblemBySlug(problemSlug!));

	const problem = problemData?.problem || null;
	const loading = userLoading || (problemSlug && problemLoading);

	const handleSubmit = async () => {
		if (!user) {
			toast.error(tMessages('errors.login_required'));
			return;
		}

		if (!problem) {
			toast.error(tMessages('errors.select_problem'));
			return;
		}

		if (!code.trim()) {
			toast.error(tMessages('errors.enter_code'));
			return;
		}

		setIsSubmitting(true);
		try {
			const submissionService = createClientService(createSubmissionService);
			const result = await submissionService.submitCode({
				code,
				language,
				problemId: problem.id,
			});

			toast.success(tMessages('success.submitted'));
			// Redirect to submissions page with problem filter
			setTimeout(() => {
				router.push(`/submission?problem=${problem.id}`);
			}, 1500);
		} catch (error) {
			toast.error(tMessages('errors.submit_failed'));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<div className="space-y-4">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
			</div>
		);
	}

	if (!problemSlug) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-6">
				{/* Breadcrumb */}
				<div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<span>/</span>
					<span>Submit</span>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Play className="h-5 w-5" />
							Submit Code
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="py-8 text-center">
							<Play className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
							<h3 className="mb-2 text-lg font-semibold">No Problem Selected</h3>
							<p className="text-muted-foreground mb-4">Please select a problem to submit your solution to.</p>
							<Button asChild>
								<Link href="/problem">Browse Problems</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!problem) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<Card>
					<CardContent className="py-8 text-center">
						<h3 className="mb-2 text-lg font-semibold">Problem Not Found</h3>
						<p className="text-muted-foreground mb-4">The problem you&apos;re trying to submit to could not be found.</p>
						<Button asChild>
							<Link href="/problem">Browse Problems</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 py-6">
			{/* Breadcrumb */}
			<div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
				<Link href="/" className="hover:text-foreground">
					Home
				</Link>
				<span>/</span>
				<Link href="/problem" className="hover:text-foreground">
					Problems
				</Link>
				<span>/</span>
				<Link href={`/problem/${problem.slug}`} className="hover:text-foreground">
					{problem.title}
				</Link>
				<span>/</span>
				<span>Submit</span>
			</div>

			{/* Header */}
			<div className="mb-6">
				<div className="mb-4 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link href={`/problem/${problem.slug}`} className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back to Problem
						</Link>
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Play className="h-5 w-5" />
							Submit Solution
						</CardTitle>
						<div className="mt-2 flex items-center gap-3">
							<span className="text-lg font-medium">{problem.title}</span>
							<Badge className={cn('capitalize', getDifficultyColor(problem.difficulty))}>{problem.difficulty}</Badge>
							<span className="text-muted-foreground text-sm">{problem.point} points</span>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Language Selection */}
						<div className="space-y-2">
							<Label htmlFor="language">Programming Language</Label>
							<Select value={language} onValueChange={(value) => setLanguage(value as ProgramLanguage)}>
								<SelectTrigger>
									<SelectValue placeholder="Select language" />
								</SelectTrigger>
								<SelectContent>
									{languageOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Code Editor */}
						<div className="space-y-2">
							<Label htmlFor="code">Source Code</Label>
							<Textarea
								id="code"
								placeholder="Enter your code here..."
								value={code}
								onChange={(e) => setCode(e.target.value)}
								rows={20}
								className="resize-none font-mono text-sm"
							/>
						</div>

						{/* Submit Button */}
						<Button onClick={handleSubmit} disabled={isSubmitting || !user} className="w-full" size="lg">
							<Send className="mr-2 h-4 w-4" />
							{isSubmitting ? 'Submitting...' : 'Submit Solution'}
						</Button>

						{!user && (
							<p className="text-muted-foreground text-center text-sm">
								Please{' '}
								<Link href="/login" className="text-primary underline">
									login
								</Link>{' '}
								to submit your solution
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default SubmitPage;
