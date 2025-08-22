'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { z } from 'zod';

import GoogleLoginButton from '~/components/google-login-button';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { createClientService } from '~/lib/service-client';
import { createAuthService } from '~/services/auth';

const Login = () => {
	const t = useTranslations('auth');

	const router = useRouter();

	const { signin } = createClientService(createAuthService);

	const schema = z.object({
		email: z.string().min(1, t('message.email_required')).email(t('message.email_invalid')),
		password: z.string().min(1, t('message.password_required')),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		return signin(data)
			.then((res) => {
				toast.success(t('success.login'));
				router.push('/');
				mutate('/auth/me', res, false);
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	return (
		<div className="bg-card mx-auto my-10 max-w-108 space-y-6 rounded-2xl border px-8 py-10 shadow-xs">
			<h1 className="mb-10 text-center text-2xl font-semibold">{t('login')}</h1>
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
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-foreground/80">{t('form.password')}</FormLabel>
								<FormControl>
									<Input className="h-10" type="password" placeholder={t('form.enter_password')} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="text-foreground/80 flex items-center justify-between text-sm font-semibold">
						<Link className="hover:text-foreground" href="/verify">
							{t('verify_email')}
						</Link>
						<Link className="hover:text-foreground" href="/forgot-password">
							{t('forgot_password')}?
						</Link>
					</div>
					<Button disabled={form.formState.isSubmitting} className="h-10 w-full">
						{t('login')}
					</Button>
				</form>
			</Form>
			<Separator className="opacity-70" />
			<GoogleLoginButton />
			<p className="text-foreground/70 text-center text-sm">
				{t('dont_have_account')}{' '}
				<Link className="text-primary hover:text-primary/80 font-semibold" href="/register">
					{t('register')}
				</Link>
			</p>
		</div>
	);
};

export default Login;
