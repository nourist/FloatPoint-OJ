'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tiptap/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { DateTimePicker } from '~/components/date-time-picker';
import { SimpleEditor } from '~/components/simple-editor/simple-editor';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { createClientService } from '~/lib/service-client';
import { contestServiceInstance } from '~/services/contest';
import { Contest } from '~/types/contest.type';

interface ContestFormProps {
	contest?: Contest;
	onSubmitSuccess?: (contest: Contest) => void;
	mode: 'create' | 'edit';
}

const ContestForm = ({ contest, onSubmitSuccess, mode }: ContestFormProps) => {
	const t = useTranslations('admin.contest.form');
	const contestService = createClientService(contestServiceInstance);

	// Define form schema inside component to use translations
	const formSchema = z.object({
		title: z.string().min(1, { message: t('title_required') }),
		description: z.string().optional(),
		startTime: z.date({
			message: t('start_time_required'),
		}),
		endTime: z.date({
			message: t('end_time_required'),
		}),
		isRated: z.boolean().optional(),
		penalty: z
			.number()
			.min(0, { message: t('penalty_min') })
			.optional(),
	});

	// State for date pickers
	const [startDate, setStartDate] = useState<Date | undefined>(mode === 'edit' && contest ? new Date(contest.startTime) : new Date());
	const [endDate, setEndDate] = useState<Date | undefined>(
		mode === 'edit' && contest ? new Date(contest.endTime) : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
	);

	// React Hook Form setup
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: async () => {
			if (mode === 'edit' && contest) {
				return {
					title: contest.title,
					description: contest.description,
					startTime: new Date(contest.startTime),
					endTime: new Date(contest.endTime),
					isRated: contest.isRated,
					penalty: contest.penalty || 0,
				};
			}
			return {
				title: '',
				description: '',
				startTime: new Date(),
				endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
				isRated: false,
				penalty: 0,
			};
		},
	});

	// Refs for Tiptap editor
	const editorRef = useRef<Editor | null>(null);
	const isEditorInitialized = useRef(false);
	const [isEditorReady, setIsEditorReady] = useState(false);

	// Update form values when dates change
	useEffect(() => {
		if (startDate) {
			form.setValue('startTime', startDate);
		}
	}, [startDate, form]);

	useEffect(() => {
		if (endDate) {
			form.setValue('endTime', endDate);
		}
	}, [endDate, form]);

	// Initialize editor content when editing existing contest
	useEffect(() => {
		if (mode === 'edit' && contest && editorRef.current && !isEditorInitialized.current && isEditorReady) {
			try {
				editorRef.current.commands.setContent(JSON.parse(contest.description || '""'));
				isEditorInitialized.current = true;
			} catch (e) {
				console.error('Failed to parse description JSON:', e);
				// Set plain text content if JSON parsing fails
				editorRef.current.commands.setContent(contest.description || '');
				isEditorInitialized.current = true;
			}
		}
	}, [mode, contest, isEditorReady]);

	// Reset editor initialization flag when contest changes
	useEffect(() => {
		if (mode === 'edit' && contest) {
			isEditorInitialized.current = false;
		}
	}, [contest, mode]);

	// Handle form submission
	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			// Get the current editor content
			const descriptionContent = editorRef.current?.getJSON() || '';
			const description = JSON.stringify(descriptionContent);

			// Format dates to ISO string for API
			const payload = {
				title: data.title,
				description: description,
				startTime: data.startTime.toISOString(),
				endTime: data.endTime.toISOString(),
				isRated: data.isRated,
				penalty: data.penalty,
			};

			let response;
			if (mode === 'edit' && contest) {
				// Update existing contest
				response = await contestService.updateContest(contest.id, payload);
				toast.success(t('update_success'));
			} else {
				// Create new contest
				response = await contestService.createContest(payload);
				toast.success(t('create_success'));
			}

			onSubmitSuccess?.(response.contest);
		} catch (error) {
			console.error(`Failed to ${mode} contest:`, error);
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

				{/* Start Time */}
				<FormField
					control={form.control}
					name="startTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('start_time')}</FormLabel>
							<FormControl>
								<DateTimePicker
									date={startDate}
									onDateChange={(date) => {
										setStartDate(date);
										field.onChange(date);
									}}
									datePlaceholder={t('select_start_date')}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* End Time */}
				<FormField
					control={form.control}
					name="endTime"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('end_time')}</FormLabel>
							<FormControl>
								<DateTimePicker
									date={endDate}
									onDateChange={(date) => {
										setEndDate(date);
										field.onChange(date);
									}}
									datePlaceholder={t('select_end_date')}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Is Rated */}
				<FormField
					control={form.control}
					name="isRated"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('is_rated')}</FormLabel>
							<FormControl>
								<Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value?.toString()}>
									<SelectTrigger>
										<SelectValue placeholder={t('is_rated_placeholder')} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">{t('yes')}</SelectItem>
										<SelectItem value="false">{t('no')}</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Penalty */}
				<FormField
					control={form.control}
					name="penalty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('penalty')}</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder={t('penalty_placeholder')}
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
									value={field.value ?? 0}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Description Editor */}
				<div className="space-y-2">
					<Label>{t('description')}</Label>
					<div className="overflow-hidden rounded-md border">
						<SimpleEditor
							placeholder={t('description_placeholder')}
							onReady={(editor) => {
								editorRef.current = editor;
								setIsEditorReady(true);
								// Initialize content only for edit mode
								if (mode === 'edit' && contest && !isEditorInitialized.current) {
									try {
										editor.commands.setContent(JSON.parse(contest.description || '""'));
										isEditorInitialized.current = true;
									} catch (e) {
										console.error('Failed to parse description JSON:', e);
										// Set plain text content if JSON parsing fails
										editor.commands.setContent(contest.description || '');
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

export default ContestForm;
