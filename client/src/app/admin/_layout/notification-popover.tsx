'use client';

import { Bell, Check, CheckCheck, Code, FileText, Settings, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { cn } from '~/lib/utils';
import { NotificationStatus, notificationServiceInstance } from '~/services/notification';
import { Notification, NotificationType } from '~/types/notification.type';

interface NotificationPopoverProps {
	className?: string;
}

type NotificationTab = 'all' | 'unread' | 'read';

const NotificationPopover = ({ className }: NotificationPopoverProps) => {
	const t = useTranslations('notifications');
	const [isOpen, setIsOpen] = useState(false);
	const [markingAsRead, setMarkingAsRead] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState<NotificationTab>('all');

	const { getNotifications, markAsRead, markMultipleAsRead } = createClientService(notificationServiceInstance);

	// Always fetch notifications to show badge count
	const {
		data: notificationsResponse,
		error,
		isLoading,
	} = useSWR('/notification', () => getNotifications({ status: NotificationStatus.ALL }), {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		refreshInterval: 60000, // Refresh every minute to get new notifications
		dedupingInterval: 30000, // Prevent duplicate requests within 30 seconds
	});

	const allNotifications = notificationsResponse?.notifications || [];
	const unreadCount = allNotifications.filter((n) => !n.isRead).length;
	const readCount = allNotifications.filter((n) => n.isRead).length;

	const getFilteredNotifications = () => {
		switch (activeTab) {
			case 'unread':
				return allNotifications.filter((n) => !n.isRead);
			case 'read':
				return allNotifications.filter((n) => n.isRead);
			default:
				return allNotifications;
		}
	};

	const notifications = getFilteredNotifications();

	const handleMarkAsRead = async (notificationId: string, event?: React.MouseEvent) => {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		setMarkingAsRead((prev) => [...prev, notificationId]);
		try {
			await markAsRead(notificationId);
			await mutate('/notification');
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		} finally {
			setMarkingAsRead((prev) => prev.filter((id) => id !== notificationId));
		}
	};

	const handleMarkAllAsRead = async () => {
		const unreadNotifications = allNotifications.filter((n) => !n.isRead);
		if (unreadNotifications.length === 0) return;

		const ids = unreadNotifications.map((n) => n.id);
		setMarkingAsRead(ids);

		try {
			await markMultipleAsRead(ids);
			await mutate('/notification');
		} catch (error) {
			console.error('Failed to mark all notifications as read:', error);
		} finally {
			setMarkingAsRead([]);
		}
	};

	const getNotificationIcon = (type: NotificationType) => {
		const iconProps = { className: 'size-4' };

		switch (type) {
			case NotificationType.NEW_PROBLEM:
				return <Code {...iconProps} className="size-4 text-blue-600" />;
			case NotificationType.NEW_CONTEST:
				return <Trophy {...iconProps} className="size-4 text-yellow-600" />;
			case NotificationType.NEW_BLOG:
				return <FileText {...iconProps} className="size-4 text-green-600" />;
			case NotificationType.UPDATE_RATING:
				return <Star {...iconProps} className="size-4 text-purple-600" />;
			case NotificationType.SYSTEM:
				return <Settings {...iconProps} className="size-4 text-gray-600" />;
			default:
				return <Bell {...iconProps} className="size-4 text-gray-600" />;
		}
	};

	const getNotificationTitle = (notification: Notification) => {
		switch (notification.type) {
			case NotificationType.NEW_PROBLEM:
				return notification.problem 
					? t('types.new_problem', { title: notification.problem.title }) 
					: t('types.new_problem_available');
			case NotificationType.NEW_CONTEST:
				return notification.contest 
					? t('types.new_contest', { title: notification.contest.title }) 
					: t('types.new_contest_available');
			case NotificationType.NEW_BLOG:
				return notification.blog 
					? t('types.new_blog', { title: notification.blog.title }) 
					: t('types.new_blog_post');
			case NotificationType.UPDATE_RATING:
				return t('types.rating_updated');
			case NotificationType.SYSTEM:
				return t('types.system');
			default:
				return 'Notification';
		}
	};

	const getNotificationLink = (notification: Notification) => {
		switch (notification.type) {
			case NotificationType.NEW_PROBLEM:
				return notification.problem ? `/admin/problem/${notification.problem.slug}` : '/problem';
			case NotificationType.NEW_CONTEST:
				return notification.contest ? `/admin/contest/${notification.contest.slug}` : '/contest';
			case NotificationType.NEW_BLOG:
				return notification.blog ? `/blog/${notification.blog.slug}` : '/blog';
			case NotificationType.UPDATE_RATING:
				return notification.contest ? `/admin/contest/${notification.contest.slug}` : '/standing';
			default:
				return '#';
		}
	};

	const formatRelativeTime = (date: Date) => {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

		if (diffInSeconds < 60) return t('just_now');
		if (diffInSeconds < 3600) return t('minutes_ago', { count: Math.floor(diffInSeconds / 60) });
		if (diffInSeconds < 86400) return t('hours_ago', { count: Math.floor(diffInSeconds / 3600) });
		if (diffInSeconds < 2592000) return t('days_ago', { count: Math.floor(diffInSeconds / 86400) });
		return new Date(date).toLocaleDateString();
	};

	const renderNotificationList = () => {
		if (isLoading) {
			return (
				<div className="text-muted-foreground p-6 text-center">
					<div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-current"></div>
					<p className="text-sm">{t('loading')}</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="p-6 text-center text-red-500">
					<div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-red-50">
						<Bell className="size-4" />
					</div>
					<p className="text-sm">{t('failed_to_load')}</p>
				</div>
			);
		}

		if (notifications.length === 0) {
			const emptyMessages = {
				all: t('no_notifications'),
				unread: t('unread_count', { count: 0 }),
				read: t('read_count', { count: 0 }),
			};

			return (
				<div className="text-muted-foreground p-6 text-center">
					<div className="bg-muted/30 mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
						<Bell className="size-6 opacity-50" />
					</div>
					<p className="text-sm font-medium">{emptyMessages[activeTab]}</p>
				</div>
			);
		}

		return (
			<div className="divide-border/60 divide-y">
				{notifications.map((notification) => {
					const isMarkingThisAsRead = markingAsRead.includes(notification.id);
					const link = getNotificationLink(notification);

					return (
						<div
							key={notification.id}
							className={cn(
								'group relative transition-all duration-200',
								!notification.isRead &&
									'bg-gradient-to-r from-blue-50/30 via-blue-50/10 to-transparent dark:from-blue-950/20 dark:via-blue-950/10 dark:to-transparent',
							)}
						>
							<Link
								href={link}
								className="hover:bg-muted/40 block p-4 transition-colors"
								onClick={() => {
									if (!notification.isRead) {
										handleMarkAsRead(notification.id);
									}
									setIsOpen(false);
								}}
							>
								<div className="flex items-center gap-3">
									<div className="mt-0.5 flex-shrink-0">
										<div className="bg-muted/50 flex size-8 items-center justify-center rounded-full">{getNotificationIcon(notification.type)}</div>
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<h4 className="line-clamp-1 text-sm leading-5 font-medium">{getNotificationTitle(notification)}</h4>
											{!notification.isRead && <div className="mt-1.5 size-2 flex-shrink-0 rounded-full bg-blue-500"></div>}
										</div>
										{notification.content && notification.content.trim() !== '' && (
											<p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">{notification.content}</p>
										)}
										<div className="flex h-6 items-center justify-between">
											<p className="text-muted-foreground text-xs">{formatRelativeTime(notification.createdAt)}</p>
											{!notification.isRead && (
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) => handleMarkAsRead(notification.id, e)}
													disabled={isMarkingThisAsRead}
													className="h-6 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
												>
													<Check className="mr-1 size-3" />
													{t('mark_as_read')}
												</Button>
											)}
										</div>
									</div>
								</div>
							</Link>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className={cn('text-card-foreground/80 hover:bg-muted/60 relative ml-auto rounded-full transition-colors', className)}>
					<Bell className="size-5" />
					{unreadCount > 0 && (
						<Badge variant="destructive" className="absolute -top-0 -right-0 flex size-2.5 items-center justify-center p-0 text-xs font-medium"></Badge>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent align="end" alignOffset={-8} sideOffset={10} className="w-96 space-y-2 p-0">
				<div>
					<div className="p-4 pb-0">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-lg font-semibold">{t('title')}</h3>
							{unreadCount > 0 && (
								<Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={markingAsRead.length > 0} className="h-7 text-xs">
									<CheckCheck className="mr-1 size-3" />
									{t('mark_all_read')}
								</Button>
							)}
						</div>

						<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationTab)} className="w-full">
							<TabsList className="grid h-8 w-full grid-cols-3 py-0">
								<TabsTrigger value="all" className="relative text-xs">
									{t('tabs.all')}
									{allNotifications.length > 0 && (
										<Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
											{allNotifications.length}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger value="unread" className="relative text-xs">
									{t('tabs.unread')}
									{unreadCount > 0 && (
										<Badge variant="destructive" className="ml-1 h-4 px-1.5 text-xs text-white">
											{unreadCount}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger value="read" className="relative text-xs">
									{t('tabs.read')}
									{readCount > 0 && (
										<Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
											{readCount}
										</Badge>
									)}
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>

				<ScrollArea className="h-80">{renderNotificationList()}</ScrollArea>
			</PopoverContent>
		</Popover>
	);
};

export default NotificationPopover;