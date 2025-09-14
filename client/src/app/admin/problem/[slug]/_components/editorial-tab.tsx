'use client';

import { Editor } from '@tiptap/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { SimpleEditor } from '~/components/simple-editor/simple-editor';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';
import { ProblemEditorial } from '~/types/problem-editorial.type';
import { Problem } from '~/types/problem.type';

interface Props {
	problem: Problem;
	onEditorialUpdate?: (editorial: ProblemEditorial) => void;
}

const EditorialTab = ({ problem, onEditorialUpdate }: Props) => {
	const t = useTranslations('admin.problem.editorial');
	const problemService = createClientService(problemServiceInstance);
	const [editorial, setEditorial] = useState<ProblemEditorial | null>(problem.editorial || null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const editorRef = useRef<Editor | null>(null);

	// Initialize editor content when editorial exists
	useEffect(() => {
		if (editorial && editorRef.current) {
			try {
				const content = JSON.parse(editorial.content);
				editorRef.current.commands.setContent(content);
			} catch (e) {
				console.error('Failed to parse editorial content JSON:', e);
			}
		}
	}, [editorial, editorRef]);

	const handleCreateEditorial = async () => {
		setIsSubmitting(true);
		try {
			const content = editorRef.current?.getJSON() || '';
			const payload = {
				content: JSON.stringify(content),
			};

			const response = await problemService.createEditorial(problem.id, payload);
			setEditorial(response.editorial);
			onEditorialUpdate?.(response.editorial);
			toast.success(t('create_success'));
		} catch (error) {
			console.error('Failed to create editorial:', error);
			toast.error(t('create_error'));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSaveEditorial = async () => {
		if (!editorial) return;

		setIsSubmitting(true);
		try {
			const content = editorRef.current?.getJSON() || '';
			const payload = {
				content: JSON.stringify(content),
			};

			const response = await problemService.updateEditorial(problem.id, payload);
			setEditorial(response.editorial);
			onEditorialUpdate?.(response.editorial);
			toast.success(t('update_success'));
		} catch (error) {
			console.error('Failed to update editorial:', error);
			toast.error(t('update_error'));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteEditorial = async () => {
		if (!editorial) return;

		setIsDeleting(true);
		try {
			await problemService.deleteEditorial(problem.id);
			setEditorial(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onEditorialUpdate?.(null as any); // Pass null to indicate deletion
			toast.success(t('delete_success'));
		} catch (error) {
			console.error('Failed to delete editorial:', error);
			toast.error(t('delete_error'));
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCreateClick = () => {
		setIsEditing(true);
	};

	if (!isEditing && !editorial) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<p className="text-muted-foreground mb-4">{t('no_editorial')}</p>
				<Button onClick={handleCreateClick}>{t('create')}</Button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-md border">
				<SimpleEditor
					placeholder={t('placeholder')}
					onReady={(editor) => {
						editorRef.current = editor;
						editor.commands.setContent(editorial?.content ? JSON.parse(editorial.content) : '');
					}}
				/>
			</div>
			<div className="flex justify-end gap-2">
				{editorial && (
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="destructive" disabled={isSubmitting || isDeleting}>
								{t('delete')}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t('delete_confirmation_title')}</DialogTitle>
								<DialogDescription>{t('delete_confirmation_description')}</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">{t('cancel')}</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button variant="destructive" onClick={handleDeleteEditorial} disabled={isDeleting}>
										{isDeleting ? t('deleting') : t('delete')}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
				<Button onClick={editorial ? handleSaveEditorial : handleCreateEditorial} disabled={isSubmitting || isDeleting}>
					{editorial ? (isSubmitting ? t('saving') : t('save')) : t('create')}
				</Button>
			</div>
		</div>
	);
};

export default EditorialTab;
