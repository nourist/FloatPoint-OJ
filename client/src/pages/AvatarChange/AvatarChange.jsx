import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { RotateCcw } from 'lucide-react';

import useAuthStore from '~/stores/authStore';
import UserAvatar from '~/components/UserAvatar';
import { changeAvatar, editUser } from '~/services/user';

const AvatarChange = () => {
	const { user } = useAuthStore();
	const { t } = useTranslation('avatarChange');

	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
	};

	const handleUpdate = () => {
		if (!file) return;
		setLoading(true);
		changeAvatar(file)
			.then(() => toast.success(t('success-msg')))
			.catch((err) => toast.error(err.response.data.msg || t('error-msg')))
			.finally(() => {
				setFile(null);
				setLoading(false);
			});
	};

	const handleDelete = () => {
		editUser({ avatar: null })
			.then(() => toast.success(t('success-msg')))
			.catch((err) => toast.error(err.response.data.msg || t('error-msg')))
			.finally(() => {
				setFile(null);
				setLoading(false);
			});
	};

	return (
		<div className="flex flex-1 justify-center px-2 py-6">
			<div className="flex max-w-[544px] flex-1 flex-col items-center gap-4 rounded-md bg-white p-8 shadow-md dark:bg-neutral-800">
				<h2 className="mb-2 text-xl font-semibold dark:text-white">{t('change-your-avatar')}</h2>
				{file ? <img src={URL.createObjectURL(file)} alt="" className="size-44 rounded-full" /> : <UserAvatar className="size-44" user={user}></UserAvatar>}
				<div className="w-[calc(100%-32px)] rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center dark:border-white">
					<svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
						<path
							fillRule="evenodd"
							d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
							clipRule="evenodd"
						/>
					</svg>
					<div className="mt-4 flex justify-center text-sm/6 text-gray-600">
						<label
							htmlFor="file-upload"
							className="focus-within:outline-hidden relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
						>
							<span>{t('upload-a-file')}</span>
							<input onChange={handleChange} id="file-upload" name="file-upload" type="file" className="sr-only" />
						</label>
						<p className="pl-1 dark:text-gray-200">{t('drag-and-drop')}</p>
					</div>
					<p className="text-xs/5 text-gray-600 dark:text-gray-200">{t('file-msg')}</p>
				</div>
				<p className="self-start px-4 text-sm text-gray-400 dark:text-gray-300">{t('avatar-warn')}</p>
				<div className="self-start">
					<Button disabled={!file} onClick={handleUpdate} className="mx-4 w-24 !bg-sky-500 capitalize hover:!bg-sky-600 dark:text-white">
						{loading ? <RotateCcw className="animate-spin" /> : t('change')}
					</Button>
					<Button onClick={handleDelete} className="w-36 !bg-red-500 capitalize hover:!bg-red-600 dark:text-white">
						{loading ? <RotateCcw className="animate-spin" /> : t('set-to-default')}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AvatarChange;
