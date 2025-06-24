/* eslint-disable no-unused-vars */
const markdownComponents = {
	h1: ({ node, ...props }) => <h1 className="mb-4 text-3xl font-bold text-neutral-800 dark:text-neutral-200" {...props} />,
	h2: ({ node, ...props }) => <h2 className="mb-3 mt-5 text-2xl font-semibold text-neutral-800 dark:text-neutral-200" {...props} />,
	h3: ({ node, ...props }) => <h3 className="mb-2 mt-4 text-xl font-medium text-neutral-800 dark:text-neutral-200" {...props} />,
	h4: ({ node, ...props }) => <h4 className="mb-2 mt-4 text-lg font-medium text-neutral-800 dark:text-neutral-200" {...props} />,
	p: ({ node, ...props }) => <p className="mb-2 text-neutral-700 dark:text-neutral-300" {...props} />,
	code: ({ node, ...props }) => <code className="rounded bg-neutral-200 px-1 py-0.5 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200" {...props} />,
	pre: ({ node, ...props }) => <pre className="mb-4 overflow-auto rounded bg-neutral-100 p-4 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200" {...props} />,
	ul: ({ node, ...props }) => <ul className="mb-2 ml-6 list-disc text-neutral-700 dark:text-neutral-300" {...props} />,
	ol: ({ node, ...props }) => <ol className="mb-2 ml-6 list-decimal text-neutral-700 dark:text-neutral-300" {...props} />,
	li: ({ node, ...props }) => <li className="mb-1" {...props} />,
	hr: () => <hr className="my-4 border-neutral-300 dark:border-neutral-700" />,
	blockquote: ({ node, ...props }) => (
		<blockquote className="mb-4 border-l-4 border-neutral-400 pl-4 italic text-neutral-600 dark:border-neutral-600 dark:text-neutral-400" {...props} />
	),
};

export default markdownComponents;
