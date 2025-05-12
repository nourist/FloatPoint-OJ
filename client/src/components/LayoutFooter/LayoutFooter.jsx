// import PropTypes from 'prop-types';
import { Mail, Github } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useTranslation } from 'react-i18next';

const LayoutFooter = () => {
	const { t } = useTranslation();

	return (
		<footer className="border-t border-t-gray-300 py-4 text-gray-600 dark:border-gray-600 dark:text-gray-300">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-4 sm:flex-row">
				<div className="text-center sm:text-left">
					<h2 className="text-lg font-medium text-gray-700 dark:text-gray-100">My Online Judge</h2>
					<p className="text-sm">© 2025 Nourist. All rights reserved.</p>
				</div>
				<div className="mt-4 flex gap-4 sm:mt-0">
					<Dialog>
						<DialogTrigger asChild>
							<button className="hover:text-gray-500 hover:dark:text-gray-100">
								<Mail size={24} />
							</button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md dark:!border-neutral-800 dark:!bg-neutral-900">
							<DialogHeader>
								<DialogTitle className="dark:text-white">{t('oops')}</DialogTitle>
								<DialogDescription>{t('no-mail')} ✉️❌</DialogDescription>
							</DialogHeader>
							<DialogFooter className="sm:justify-start">
								<DialogClose asChild>
									<Button type="button" variant="secondary" className="capitalize dark:!bg-neutral-800 dark:hover:!bg-neutral-700">
										{t('close')}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<a href="https://github.com/nourist" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 hover:dark:text-white">
						<Github size={24} />
					</a>
				</div>
			</div>
		</footer>
	);
};

LayoutFooter.propTypes = {};

export default LayoutFooter;
