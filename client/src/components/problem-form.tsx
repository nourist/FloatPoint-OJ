'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tiptap/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { SimpleEditor } from '~/components/simple-editor/simple-editor';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { TagSelector } from '~/components/ui/tag-selector';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';
import { Difficulty, IOMode, Problem, ProblemScoringMethod } from '~/types/problem.type';

interface ProblemFormProps {
	tagOptions: string[];
	problem?: Problem;
	onSubmitSuccess?: (problem: Problem) => void;
	mode: 'create' | 'edit';
}

const ProblemForm = ({ tagOptions, problem, onSubmitSuccess, mode }: ProblemFormProps) => {
	const t = useTranslations('admin.problem.form');
	const problemService = createClientService(problemServiceInstance);

	// Define form schema inside component to use translations
	const formSchema = z.object({
		title: z.string().min(1, { message: t('title_required') }),
		timeLimit: z.number().min(1, { message: t('time_limit_min') }),
		memoryLimit: z.number().min(1, { message: t('memory_limit_min') }),
		point: z.number().min(1, { message: t('point_min') }),
		scoringMethod: z.nativeEnum(ProblemScoringMethod),
		difficulty: z.nativeEnum(Difficulty),
		tags: z.array(z.string()),
		ioMode: z.nativeEnum(IOMode),
		inputFile: z.string().optional(),
		outputFile: z.string().optional(),
	});

	// Default values based on mode
	const getDefaultValues = () => {
		if (mode === 'edit' && problem) {
			return {
				title: problem.title,
				timeLimit: problem.timeLimit,
				memoryLimit: problem.memoryLimit,
				point: problem.point,
				scoringMethod: problem.scoringMethod,
				difficulty: problem.difficulty,
				tags: problem.tags.map((tag) => tag.name),
				ioMode: problem.ioMode,
				inputFile: problem.inputFile || '',
				outputFile: problem.outputFile || '',
			};
		}
		return {
			title: '',
			timeLimit: 1000,
			memoryLimit: 256 * 1024, // Convert to KB
			point: 100,
			scoringMethod: ProblemScoringMethod.STANDARD,
			difficulty: Difficulty.EASY,
			tags: [],
			ioMode: IOMode.STANDARD,
			inputFile: '',
			outputFile: '',
		};
	};

	// React Hook Form setup
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: getDefaultValues(),
	});

	// Refs for Tiptap editor
	const editorRef = useRef<Editor | null>(null);
	const isEditorInitialized = useRef(false);
	const [isEditorReady, setIsEditorReady] = useState(false);

	// Initialize editor content when editing existing problem
	useEffect(() => {
		if (mode === 'edit' && problem && editorRef.current && !isEditorInitialized.current && isEditorReady) {
			try {
				editorRef.current.commands.setContent(JSON.parse(problem.statement));
				isEditorInitialized.current = true;
			} catch (e) {
				console.error('Failed to parse statement JSON:', e);
				// Set plain text content if JSON parsing fails
				editorRef.current.commands.setContent(problem.statement);
				isEditorInitialized.current = true;
			}
		}
	}, [mode, problem, isEditorReady]);

	// Handle form submission
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			// Get the current editor content
			const statementContent = editorRef.current?.getJSON() || '';
			const statement = JSON.stringify(statementContent);

			const payload = {
				...data,
				statement: statement,
				inputFile: data.ioMode === IOMode.FILE ? data.inputFile || null : null,
				outputFile: data.ioMode === IOMode.FILE ? data.outputFile || null : null,
			};

			let response;
			if (mode === 'edit' && problem) {
				// Update existing problem
				response = await problemService.updateProblem(problem.id, payload);
				toast.success(t('update_success'));
			} else {
				// Create new problem
				response = await problemService.createProblem(payload);
				toast.success(t('create_success'));
			}

			// Reset editor initialization flag after successful update
			if (mode === 'edit') {
				isEditorInitialized.current = false;
			}

			onSubmitSuccess?.(response.problem);
		} catch (error) {
			console.error(`Failed to ${mode} problem:`, error);
			toast.error(mode === 'edit' ? t('update_error') : t('create_error'));
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* Title */}
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('title')}</FormLabel>
							<FormControl>
								<Input placeholder={t('title_placeholder')} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Time Limit and Memory Limit */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="timeLimit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('time_limit')}</FormLabel>
								<FormControl>
									<Input type="number" placeholder="1000" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="memoryLimit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('memory_limit')}</FormLabel>
								<FormControl>
									<Input type="number" placeholder="262144" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Point */}
				<FormField
					control={form.control}
					name="point"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('point')}</FormLabel>
							<FormControl>
								<Input type="number" placeholder="100" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Scoring Method and Difficulty */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<FormField
						control={form.control}
						name="scoringMethod"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('scoring_method')}</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger>
											<SelectValue placeholder={t('scoring_method_placeholder')} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={ProblemScoringMethod.STANDARD}>{t('scoring_method_standard')}</SelectItem>
											<SelectItem value={ProblemScoringMethod.SUBTASK}>{t('scoring_method_subtask')}</SelectItem>
											<SelectItem value={ProblemScoringMethod.ICPC}>{t('scoring_method_icpc')}</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="difficulty"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('difficulty')}</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger>
											<SelectValue placeholder={t('difficulty_placeholder')} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={Difficulty.EASY}>{t('difficulty_easy')}</SelectItem>
											<SelectItem value={Difficulty.MEDIUM}>{t('difficulty_medium')}</SelectItem>
											<SelectItem value={Difficulty.HARD}>{t('difficulty_hard')}</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* IO Mode */}
				<FormField
					control={form.control}
					name="ioMode"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('io_mode')}</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger>
										<SelectValue placeholder={t('io_mode_placeholder')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={IOMode.STANDARD}>{t('io_mode_standard')}</SelectItem>
										<SelectItem value={IOMode.FILE}>{t('io_mode_file')}</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* File IO Inputs (only shown when ioMode is FILE) */}
				{form.watch('ioMode') === IOMode.FILE && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="inputFile"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('input_file')}</FormLabel>
									<FormControl>
										<Input placeholder={t('input_file_placeholder')} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="outputFile"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('output_file')}</FormLabel>
									<FormControl>
										<Input placeholder={t('output_file_placeholder')} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				)}

				{/* Tags */}
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('tags')}</FormLabel>
							<FormControl>
								<TagSelector
									placeholder={t('tags_placeholder')}
									availableTags={tagOptions}
									selectedTags={field.value || []}
									onChange={field.onChange}
									getValue={(tag) => tag}
									getLabel={(tag) => tag}
									createTag={(inputValue) => inputValue}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Statement Editor */}
				<div className="space-y-2">
					<Label>{t('statement')}</Label>
					<div className="overflow-hidden rounded-md border">
						<SimpleEditor
							placeholder={t('statement_placeholder')}
							onReady={(editor) => {
								editorRef.current = editor;
								setIsEditorReady(true);
								// Initialize content only for edit mode
								if (mode === 'edit' && problem && !isEditorInitialized.current) {
									try {
										editor.commands.setContent(JSON.parse(problem.statement));
										isEditorInitialized.current = true;
									} catch (e) {
										console.error('Failed to parse statement JSON:', e);
										// Set plain text content if JSON parsing fails
										editor.commands.setContent(problem.statement);
										isEditorInitialized.current = true;
									}
								}
							}}
						/>
					</div>
				</div>

				{/* Submit Button */}
				<Button disabled={form.formState.isSubmitting} type="submit">
					{mode === 'edit' ? t('update') : t('submit')}
				</Button>
			</form>
		</Form>
	);
};

export default ProblemForm;
