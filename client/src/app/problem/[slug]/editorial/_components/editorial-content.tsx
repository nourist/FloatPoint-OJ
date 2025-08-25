import { BookOpen, Lock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import RichTextRenderer from '~/components/rich-text-renderer';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { ProblemEditorial } from '~/types/problem-editorial.type';

interface EditorialContentProps {
	editorial: ProblemEditorial | null;
	title: string;
}

const EditorialContent = async ({ editorial, title }: EditorialContentProps) => {
	const t = await getTranslations('editorial');

	if (!editorial) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Lock className="text-muted-foreground mb-4 h-12 w-12" />
				<h3 className="mb-2 text-lg font-semibold">{t('not_available')}</h3>
				<p className="text-muted-foreground mb-4">{t('not_available_description')}</p>
			</div>
		);
	}

	const processedContent = (() => {
		if (typeof editorial.content === 'string') {
			try {
				return JSON.parse(editorial.content);
			} catch {
				// Fallback to empty content if parsing fails
				return {
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: editorial.content }],
						},
					],
				};
			}
		}
		return editorial.content;
	})();

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<BookOpen className="h-5 w-5" />
				<h3 className="text-lg font-semibold">
					{t('title')}: {title}
				</h3>
			</div>

			<Alert>
				<AlertDescription>{t('warning')}</AlertDescription>
			</Alert>

			<div className="prose dark:prose-invert max-w-none">
				<RichTextRenderer content={processedContent} className="max-w-none" />
			</div>

			{/* Author Footer */}
			{editorial.creator && (
				<div className="mt-8 border-t pt-6">
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<span>{t('created_by', { username: editorial.creator.username })}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditorialContent;
