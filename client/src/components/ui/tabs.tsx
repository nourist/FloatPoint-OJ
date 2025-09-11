'use client';

import * as React from 'react';

import { cn } from '~/lib/utils';

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	onValueChange: (value: string) => void;
	children: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, value, onValueChange, children, ...props }, ref) => {
	return (
		<TabsContext.Provider value={{ value, onValueChange }}>
			<div ref={ref} className={cn('w-full', className)} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1', className)} {...props} />
));
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, value, children, ...props }, ref) => {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error('TabsTrigger must be used within a Tabs component');
	}

	const isActive = context.value === value;

	return (
		<button
			ref={ref}
			className={cn(
				'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
				isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50',
				className,
			)}
			onClick={() => context.onValueChange(value)}
			{...props}
		>
			{children}
		</button>
	);
});
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, value, children, ...props }, ref) => {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error('TabsContent must be used within a Tabs component');
	}

	if (context.value !== value) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn('ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none', className)}
			{...props}
		>
			{children}
		</div>
	);
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
