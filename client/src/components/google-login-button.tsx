'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mutate } from 'swr';

import { Button } from './ui/button';
import { createClientService } from '~/lib/service-client';
import { createAuthService } from '~/services/auth';

const GoogleLoginButton = () => {
	const t = useTranslations('auth');

	const router = useRouter();

	const { googleSignin } = createClientService(createAuthService);

	const handle = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			googleSignin({ idToken: tokenResponse.access_token })
				.then((res) => {
					toast.success(t('success.login'));
					router.push('/');
					mutate('/auth/me', res, false);
				})
				.catch((err) =>
					toast.error(t('error.login'), {
						description: err.message,
					}),
				);
		},
		onError: () => {
			toast.error(t('error.login'));
		},
	});

	return (
		<Button variant="outline" onClick={() => handle()} className="h-10 w-full">
			<Image src="/google-logo.svg" alt="google-logo" width={20} height={20}></Image>
			{t('continue-with-google')}
		</Button>
	);
};

export default GoogleLoginButton;
