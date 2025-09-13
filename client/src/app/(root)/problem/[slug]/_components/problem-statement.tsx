import { getTranslations } from 'next-intl/server';

import RichTextRenderer from '~/components/rich-text-renderer';
import { Problem } from '~/types/problem.type';

interface ProblemStatementProps {
	problem: Problem;
}

const ProblemStatement = async ({ problem }: ProblemStatementProps) => {
	const t = await getTranslations('problem.detail.statement');

	return (
		<div className="space-y-6">
			{/* Problem Statement */}
			<h3 className="mb-4 text-lg font-semibold">{t('statement')}</h3>
			<RichTextRenderer
				content={(() => {
					if (typeof problem.statement === 'string') {
						try {
							return JSON.parse(problem.statement);
						} catch {
							// Fallback to empty content if parsing fails
							return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: problem.statement }] }] };
						}
					}
					return problem.statement;
				})()}
			/>
		</div>
	);
};

export default ProblemStatement;
