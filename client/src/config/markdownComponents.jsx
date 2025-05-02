const markdownComponents = {
	// eslint-disable-next-line no-unused-vars
	h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-4" {...props} />,
	// eslint-disable-next-line no-unused-vars
	h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3 mt-5" {...props} />,
	// eslint-disable-next-line no-unused-vars
	h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-4" {...props} />,
	// eslint-disable-next-line no-unused-vars
	h4: ({ node, ...props }) => <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-4" {...props} />,
	// eslint-disable-next-line no-unused-vars
	p: ({ node, ...props }) => <p className="text-neutral-700 dark:text-neutral-300 mb-2" {...props} />,
	// eslint-disable-next-line no-unused-vars
	code: ({ node, ...props }) => <code className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded" {...props} />,
	// eslint-disable-next-line no-unused-vars
	pre: ({ node, ...props }) => <pre className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 p-4 rounded mb-4 overflow-auto" {...props} />,
	// eslint-disable-next-line no-unused-vars
	ul: ({ node, ...props }) => <ul className="list-disc ml-6 text-neutral-700 dark:text-neutral-300 mb-2" {...props} />,
	// eslint-disable-next-line no-unused-vars
	ol: ({ node, ...props }) => <ol className="list-decimal ml-6 text-neutral-700 dark:text-neutral-300 mb-2" {...props} />,
	// eslint-disable-next-line no-unused-vars
	li: ({ node, ...props }) => <li className="mb-1" {...props} />,
	hr: () => <hr className="border-neutral-300 dark:border-neutral-700 my-4" />,
	// eslint-disable-next-line no-unused-vars
	blockquote: ({ node, ...props }) => (
		<blockquote className="border-l-4 border-neutral-400 dark:border-neutral-600 pl-4 italic text-neutral-600 dark:text-neutral-400 mb-4" {...props} />
	),
};

export default markdownComponents;
