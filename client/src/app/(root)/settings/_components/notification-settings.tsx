'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormLabel } from '~/components/ui/form';
import { Switch } from '~/components/ui/switch';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { userServiceInstance } from '~/services/user';

const notificationSettingsSchema = z.object({
	new_blog: z.boolean(),
	new_problem: z.boolean(),
	new_contest: z.boolean(),
	update_rating: z.boolean(),
	system: z.boolean(),
});

type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;

export const NotificationSettings = () => {
	const t = useTranslations('settings.notification');
	const { getProfile } = createClientService(authServiceInstance);
	const { updateNotificationSettings } = createClientService(userServiceInstance);
	const { data: user, mutate } = useSWR('/auth/me', getProfile);

	const form = useForm<NotificationSettingsFormValues>({
		resolver: zodResolver(notificationSettingsSchema),
		defaultValues: {
			new_blog: false,
			new_problem: false,
			new_contest: false,
			update_rating: false,
			system: false,
		},
	});

	// Update form values when user data changes
	useEffect(() => {
		if (user) {
			form.reset({
				new_blog: user.notificationSettings.new_blog || false,
				new_problem: user.notificationSettings.new_problem || false,
				new_contest: user.notificationSettings.new_contest || false,
				update_rating: user.notificationSettings.update_rating || false,
				system: user.notificationSettings.system || false,
			});
		}
	}, [user, form]);

	const onSubmit = async (values: NotificationSettingsFormValues) => {
		try {
			await updateNotificationSettings(values);
			mutate(); // Revalidate user data
			toast.success(t('form.update_success'));
		} catch (error) {
			toast.error(t('form.update_error'));
			console.error('Notification settings update error:', error);
		}
	};

	return (
		<div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
			<div className="mb-6 space-y-1">
				<h3 className="text-lg font-medium">{t('title')}</h3>
				<p className="text-muted-foreground text-sm">{t('description')}</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{Object.keys(notificationSettingsSchema.shape).map((key) => (
						<FormField
							key={key}
							control={form.control}
							name={key as keyof NotificationSettingsFormValues}
							render={({ field }) => (
								<div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border px-4 py-2 transition-colors">
									<FormLabel className="text-base font-medium">{t(`form.${key}`)}</FormLabel>
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
									</FormControl>
								</div>
							)}
						/>
					))}
					<Button type="submit" disabled={form.formState.isSubmitting} className="mt-2">
						{form.formState.isSubmitting ? t('form.saving') : t('form.save')}
					</Button>
				</form>
			</Form>
		</div>
	);
};
