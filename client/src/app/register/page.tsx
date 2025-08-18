'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import GoogleLoginButton from '~/components/google-login-button';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { createClientService } from '~/lib/service-client';
import { createAuthService } from '~/services/auth';

const Register = () => {
	const t = useTranslations('auth');

	const router = useRouter();

	const { signup } = createClientService(createAuthService);

	const schema = z.object({
		username: z.string().min(1, t('message.username-required')),
		email: z.string().min(1, t('message.email-required')).email(t('message.email-invalid')),
		password: z
			.string()
			.min(1, t('message.password-required'))
			.min(8, t('message.password-min'))
			.regex(/[A-Z]/, t('message.password-uppercase'))
			.regex(/[a-z]/, t('message.password-lowercase'))
			.regex(/[0-9]/, t('message.password-number'))
			.regex(/[^A-Za-z0-9]/, t('message.password-special')),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof schema>) => {
		return signup(data)
			.then(() => {
				toast.success(t('success.register'), { description: t('toast.verify-email') });
				router.push('/login');
			})
			.catch((error) => {
				toast.error(error.message);
			});
	};

	return (
		<div className="bg-card mx-auto my-10 max-w-108 space-y-6 rounded-2xl border px-8 py-10 shadow-xs">
			<h1 className="mb-10 text-center text-2xl font-semibold">{t('register')}</h1>
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
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-foreground/80">{t('form.username')}</FormLabel>
								<FormControl>
									<Input className="h-10" placeholder={t('form.enter-username')} {...field} />
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
									<Input className="h-10" type="password" placeholder={t('form.enter-password')} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={form.formState.isSubmitting} className="h-10 w-full">
						{t('register')}
					</Button>
				</form>
			</Form>
			<Separator className="opacity-70" />
			<GoogleLoginButton />
			<p className="text-foreground/70 text-center text-sm">
				{t('already-have-account')}{' '}
				<Link className="text-primary hover:text-primary/80 font-semibold" href="/login">
					{t('login')}
				</Link>
			</p>
		</div>
	);
};

export default Register;
