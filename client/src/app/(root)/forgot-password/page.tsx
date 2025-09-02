'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';

const ForgotPassword = () => {
	const t = useTranslations('auth');

	const { forgotPassword } = createClientService(authServiceInstance);

	const schema = z.object({
		email: z.string().min(1, t('message.email_required')).email(t('message.email_invalid')),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		return forgotPassword(data)
			.then(() => {
				toast.success(t('success.forgot_password'));
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	return (
		<div className="bg-card mx-auto my-4 max-w-108 space-y-6 rounded-2xl border px-8 py-10 shadow-xs">
			<h1 className="mb-10 text-center text-2xl font-semibold">{t('forgot_password')}</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-foreground/80">{t('form.email')}</FormLabel>
								<FormControl>
									<Input className="h-10" placeholder={t('form.enter_email')} {...field} />
								</FormControl>
								<FormMessage />
								<FormDescription>{t('description.forgot_password')}</FormDescription>
							</FormItem>
						)}
					/>
					<Button disabled={form.formState.isSubmitting} className="h-10 w-full">
						{t('get_password')}
					</Button>
				</form>
			</Form>
			<p className="text-foreground/70 text-center text-sm">
				{t('already_have_password')}{' '}
				<Link className="text-primary hover:text-primary/80 font-semibold" href="/login">
					{t('login')}
				</Link>
			</p>
		</div>
	);
};

export default ForgotPassword;
