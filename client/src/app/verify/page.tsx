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
import { resendVerificationEmail } from '~/services/auth';

const Verify = () => {
	const t = useTranslations('auth');

	const schema = z.object({
		email: z.string().min(1, t('message.email-required')).email(t('message.email-invalid')),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		return resendVerificationEmail(data)
			.then(() => {
				toast.success(t('success.verify-email-send'), { description: t('toast.verify-email') });
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	return (
		<div className="bg-card mx-auto my-10 max-w-108 space-y-6 rounded-2xl border px-8 py-10 shadow-xs">
			<h1 className="mb-10 text-center text-2xl font-semibold">{t('verify-email')}</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-foreground/80">{t('form.email')}</FormLabel>
								<FormControl>
									<Input className="h-10" placeholder={t('form.enter-email')} {...field} />
								</FormControl>
								<FormMessage />
								<FormDescription>{t('description.verify-email')}</FormDescription>
							</FormItem>
						)}
					/>
					<Button disabled={form.formState.isSubmitting} className="h-10 w-full">
						{t('verify-email')}
					</Button>
				</form>
			</Form>
			<p className="text-foreground/70 text-center text-sm">
				{t('account-already-verified')}{' '}
				<Link className="text-primary hover:text-primary/80 font-semibold" href="/login">
					{t('login')}
				</Link>
			</p>
		</div>
	);
};

export default Verify;
