import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export const MetricCardSkeleton = () => (
	<Card>
		<CardContent className="p-6">
			<div className="flex items-center justify-between">
				<div className="space-y-3">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-8 w-16" />
				</div>
				<Skeleton className="h-12 w-12 rounded-lg" />
			</div>
		</CardContent>
	</Card>
);

export const ChartSkeleton = () => (
	<Card>
		<CardHeader>
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-8 w-12" />
					<Skeleton className="h-8 w-12" />
					<Skeleton className="h-8 w-12" />
				</div>
			</div>
		</CardHeader>
		<CardContent>
			<div className="h-80 w-full">
				<Skeleton className="h-full w-full rounded-lg" />
			</div>
		</CardContent>
	</Card>
);

export const TopUsersTableSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-48" />
			<Skeleton className="h-4 w-64" />
		</CardHeader>
		<CardContent className="px-6">
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center gap-4">
						<Skeleton className="h-8 w-8 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-20" />
						</div>
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

export const PopularProblemsTableSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-48" />
			<Skeleton className="h-4 w-64" />
		</CardHeader>
		<CardContent className="px-6">
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center gap-4">
						<Skeleton className="h-4 w-8" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-3 w-20" />
						</div>
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

export const DashboardSkeleton = () => (
	<div className="space-y-4">
		{/* Header Section - Key Metrics Cards */}
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
			{Array.from({ length: 5 }).map((_, i) => (
				<MetricCardSkeleton key={i} />
			))}
		</div>

		{/* Chart Rows */}
		{Array.from({ length: 3 }).map((_, rowIndex) => (
			<div key={rowIndex} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ChartSkeleton />
				<ChartSkeleton />
			</div>
		))}

		{/* Bottom Section Tables */}
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<TopUsersTableSkeleton />
			<PopularProblemsTableSkeleton />
		</div>
	</div>
);
