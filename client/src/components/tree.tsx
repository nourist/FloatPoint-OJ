'use client';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '~/lib/utils';

// Tree Context
interface TreeContextType {
	expandedIds: Set<string>;
	selectedIds: string[];
	toggleExpanded: (nodeId: string) => void;
	handleSelection: (nodeId: string, ctrlKey?: boolean) => void;
	showLines: boolean;
	showIcons: boolean;
	selectable: boolean;
	multiSelect: boolean;
	animateExpand: boolean;
	indent: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onNodeClick?: (nodeId: string, data?: any) => void;
	onNodeExpand?: (nodeId: string, expanded: boolean) => void;
}

const TreeContext = React.createContext<TreeContextType | null>(null);

const useTree = () => {
	const context = React.useContext(TreeContext);
	if (!context) {
		throw new Error('Tree components must be used within a TreeProvider');
	}
	return context;
};

// Tree variants
const treeVariants = cva('w-full rounded-ele', {
	variants: {
		variant: {
			default: '',
			outline: 'border-2',
			ghost: 'border-transparent bg-transparent',
		},
		size: {
			sm: 'text-sm',
			default: '',
			lg: 'text-lg',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

const treeItemVariants = cva('flex items-center py-2 px-3 cursor-pointer transition-all duration-200 relative group rounded-[calc(var(--card-radius)-8px)]', {
	variants: {
		variant: {
			default: 'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
			ghost: 'hover:bg-accent/50',
			subtle: 'hover:bg-muted/50',
		},
		selected: {
			true: 'bg-accent text-accent-foreground',
			false: '',
		},
	},
	defaultVariants: {
		variant: 'default',
		selected: false,
	},
});

// Provider Props
export interface TreeProviderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof treeVariants> {
	defaultExpandedIds?: string[];
	selectedIds?: string[];
	onSelectionChange?: (selectedIds: string[]) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onNodeClick?: (nodeId: string, data?: any) => void;
	onNodeExpand?: (nodeId: string, expanded: boolean) => void;
	showLines?: boolean;
	showIcons?: boolean;
	selectable?: boolean;
	multiSelect?: boolean;
	animateExpand?: boolean;
	indent?: number;
}

// Tree Provider
const TreeProvider = React.forwardRef<HTMLDivElement, TreeProviderProps>(
	(
		{
			className,
			variant,
			size,
			children,
			defaultExpandedIds = [],
			selectedIds = [],
			onSelectionChange,
			onNodeClick,
			onNodeExpand,
			showLines = true,
			showIcons = true,
			selectable = true,
			multiSelect = false,
			animateExpand = true,
			indent = 20,
			...props
		},
		ref,
	) => {
		const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set(defaultExpandedIds));
		const [internalSelectedIds, setInternalSelectedIds] = React.useState<string[]>(selectedIds);

		const isControlled = onSelectionChange !== undefined;
		const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

		const toggleExpanded = React.useCallback(
			(nodeId: string) => {
				setExpandedIds((prev) => {
					const newSet = new Set(prev);
					const isExpanded = newSet.has(nodeId);
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					isExpanded ? newSet.delete(nodeId) : newSet.add(nodeId);
					onNodeExpand?.(nodeId, !isExpanded);
					return newSet;
				});
			},
			[onNodeExpand],
		);

		const handleSelection = React.useCallback(
			(nodeId: string, ctrlKey = false) => {
				if (!selectable) return;

				let newSelection: string[];

				if (multiSelect && ctrlKey) {
					newSelection = currentSelectedIds.includes(nodeId) ? currentSelectedIds.filter((id) => id !== nodeId) : [...currentSelectedIds, nodeId];
				} else {
					newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
				}

				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				isControlled ? onSelectionChange?.(newSelection) : setInternalSelectedIds(newSelection);
			},
			[selectable, multiSelect, currentSelectedIds, isControlled, onSelectionChange],
		);

		const contextValue: TreeContextType = {
			expandedIds,
			selectedIds: currentSelectedIds,
			toggleExpanded,
			handleSelection,
			showLines,
			showIcons,
			selectable,
			multiSelect,
			animateExpand,
			indent,
			onNodeClick,
			onNodeExpand,
		};

		return (
			<TreeContext.Provider value={contextValue}>
				<motion.div
					className={cn(treeVariants({ variant, size, className }))}
					ref={ref}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: 'easeOut' }}
				>
					<div className="p-2" {...props}>
						{children}
					</div>
				</motion.div>
			</TreeContext.Provider>
		);
	},
);

TreeProvider.displayName = 'TreeProvider';

// Tree Props
export interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
}

// Tree
const Tree = React.forwardRef<HTMLDivElement, TreeProps>(({ className, asChild = false, children, ...props }, ref) => {
	const Comp = asChild ? Slot : 'div';

	return (
		<Comp className={cn('space-y-1', className)} ref={ref} {...props}>
			{children}
		</Comp>
	);
});

Tree.displayName = 'Tree';

// Tree Item Props
export interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof treeItemVariants> {
	nodeId: string;
	label: string;
	icon?: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any;
	level?: number;
	isLast?: boolean;
	parentPath?: boolean[];
	hasChildren?: boolean;
	asChild?: boolean;
	actions?: React.ReactNode; // Add actions prop for action buttons
}

// Tree Item
const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
	(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		{ className, variant, nodeId, label, icon, data, level = 0, isLast = false, parentPath = [], hasChildren = false, asChild = false, children, actions, onClick, ...props },
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ref,
	) => {
		const { expandedIds, selectedIds, toggleExpanded, handleSelection, showLines, showIcons, animateExpand, indent, onNodeClick } = useTree();

		const isExpanded = expandedIds.has(nodeId);
		const isSelected = selectedIds.includes(nodeId);
		const currentPath = [...parentPath, isLast];

		const getDefaultIcon = () => (hasChildren ? isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />);

		const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
			if (hasChildren) toggleExpanded(nodeId);
			handleSelection(nodeId, e.ctrlKey || e.metaKey);
			onNodeClick?.(nodeId, data);
			onClick?.(e);
		};

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const Comp = asChild ? Slot : 'div';

		return (
			<div className="relative select-none">
				<motion.div
					className={cn(treeItemVariants({ variant, selected: isSelected, className }))}
					style={{ paddingLeft: level * indent + 8 }}
					onClick={handleClick}
					whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
				>
					{/* Tree Lines */}
					{showLines && level > 0 && (
						<div className="pointer-events-none absolute top-0 bottom-0 left-0">
							{currentPath.map((isLastInPath, pathIndex) => (
								<div
									key={pathIndex}
									className="border-border/40 absolute top-0 bottom-0 border-l"
									style={{
										left: pathIndex * indent + 12,
										display: pathIndex === currentPath.length - 1 && isLastInPath ? 'none' : 'block',
									}}
								/>
							))}
							<div
								className="border-border/40 absolute top-1/2 border-t"
								style={{
									left: (level - 1) * indent + 12,
									width: indent - 4,
									transform: 'translateY(-1px)',
								}}
							/>
							{isLast && (
								<div
									className="border-border/40 absolute top-0 border-l"
									style={{
										left: (level - 1) * indent + 12,
										height: '50%',
									}}
								/>
							)}
						</div>
					)}

					{/* Expand Icon */}
					<motion.div
						className="mr-1 flex h-4 w-4 items-center justify-center"
						animate={{ rotate: hasChildren && isExpanded ? 90 : 0 }}
						transition={{ duration: 0.2, ease: 'easeInOut' }}
					>
						{hasChildren && <ChevronRight className="text-muted-foreground h-3 w-3" />}
					</motion.div>

					{/* Node Icon */}
					{showIcons && (
						<motion.div className="text-muted-foreground mr-2 flex h-4 w-4 items-center justify-center" whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
							{icon || getDefaultIcon()}
						</motion.div>
					)}

					{/* Label */}
					<span className="text-foreground flex-1 truncate text-sm">{label}</span>

					{/* Action Buttons */}
					{actions && <div className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">{actions}</div>}
				</motion.div>

				{/* Children */}
				<AnimatePresence>
					{hasChildren && isExpanded && children && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{
								duration: animateExpand ? 0.3 : 0,
								ease: 'easeInOut',
							}}
							className="overflow-hidden"
						>
							<motion.div
								initial={{ y: -10 }}
								animate={{ y: 0 }}
								exit={{ y: -10 }}
								transition={{
									duration: animateExpand ? 0.2 : 0,
									delay: animateExpand ? 0.1 : 0,
								}}
							>
								{children}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

TreeItem.displayName = 'TreeItem';

export { TreeProvider, Tree, TreeItem, treeVariants, treeItemVariants };
