'use client';

interface SourceCodeTabProps {
	sourceCode: string;
}

export const SourceCodeTab = ({ sourceCode }: SourceCodeTabProps) => {
	return (
		<pre className="bg-muted overflow-x-auto rounded-lg p-4">
			<code className="font-mono text-sm">{sourceCode}</code>
		</pre>
	);
};
