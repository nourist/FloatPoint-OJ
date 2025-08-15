'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';

const ResetPassword = () => {
	const t = useTranslations('auth');

	const schema = z
		.object({
			password: z
				.string()
				.min(1, t('message.password-required'))
				.min(8, t('message.password-min'))
				.regex(/[A-Z]/, t('message.password-uppercase'))
				.regex(/[a-z]/, t('message.password-lowercase'))
				.regex(/[0-9]/, t('message.password-number'))
				.regex(/[^A-Za-z0-9]/, t('message.password-special')),
			confirmPassword: z.string().min(1, t('message.confirm-password-required')),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('message.confirm-password-not-match'),
			path: ['confirmPassword'],
		});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		console.log(data);
	};

	return (
		<div className="bg-card mx-auto my-10 max-w-108 space-y-6 rounded-2xl border px-8 py-10 shadow-xs">
			<h1 className="mb-10 text-center text-2xl font-semibold">{t('reset-password')}</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-foreground/80">{t('form.password')}</FormLabel>
								<FormControl>
									<Input className="h-10" placeholder={t('form.enter-password')} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-foreground/80">{t('form.confirm-password')}</FormLabel>
								<FormControl>
									<Input className="h-10" placeholder={t('form.enter-confirm-password')} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={form.formState.isSubmitting} className="h-10 w-full">
						{t('reset-password')}
					</Button>
				</form>
			</Form>
			<p className="text-foreground/70 text-center text-sm">
				{t('already-have-password')}{' '}
				<Link className="text-primary hover:text-primary/80 font-semibold" href="/login">
					{t('login')}
				</Link>
			</p>
		</div>
	);
};

export default ResetPassword;
