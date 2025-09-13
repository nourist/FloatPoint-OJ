import { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/utils';

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	subtitle?: string;
	status?: 'online' | 'offline' | 'warning';
	className?: string;
}

const MetricCard = ({ title, value, icon: Icon, subtitle, status, className }: MetricCardProps) => {
	return (
		<Card className={cn('h-full', className)}>
			<CardContent className="flex h-full flex-col justify-between p-6">
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p className="text-muted-foreground text-sm font-medium">{title}</p>
						<div className="flex items-center gap-2">
							<p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
							{status && (
								<div
									className={cn('h-2 w-2 rounded-full', {
										'bg-green-500': status === 'online',
										'bg-red-500': status === 'offline',
										'bg-yellow-500': status === 'warning',
									})}
								/>
							)}
						</div>
						{subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
					</div>
					<div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
						<Icon className="text-primary h-6 w-6" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default MetricCard;
