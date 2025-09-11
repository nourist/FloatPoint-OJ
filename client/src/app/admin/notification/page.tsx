'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { createClientService } from '~/lib/service-client';
import { notificationServiceInstance } from '~/services/notification';

export default function NotificationPage() {
	const t = useTranslations('admin.notification');
	const [content, setContent] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	const notificationService = createClientService(notificationServiceInstance);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!content.trim()) {
			toast.error(t('errors.content_required'));
			return;
		}

		setIsSubmitting(true);
		try {
			await notificationService.sendSystemNotification({ content });
			toast.success(t('success.sent'));
			setContent('');
		} catch (error) {
			console.error('Failed to send system notification:', error);
			toast.error(t('errors.send_failed'));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold leading-none tracking-tight">{t('send_system_notification')}</h1>
				<p className="text-muted-foreground text-sm">{t('send_system_notification_description')}</p>
			</div>
			
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Textarea
							placeholder={t('content_placeholder')}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={6}
							disabled={isSubmitting}
						/>
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={isSubmitting || !content.trim()}>
							{isSubmitting ? t('sending') : t('send')}
						</Button>
					</div>
				</form>
		</>
	);
}