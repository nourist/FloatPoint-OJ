import PropTypes from 'prop-types';
import { Mail, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import DefaultLayout from '../DefaultLayout';

const DefaultLayoutWithFooter = ({ children }) => {
	const { t } = useTranslation();

	return (
		<DefaultLayout
			footer={
				<footer className=" border-t-gray-300 dark:border-neutral-700 border-t dark:text-gray-300 text-gray-600 py-6">
					<div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
						<div className="text-center sm:text-left">
							<h2 className="text-lg dark:text-gray-100 text-gray-700 font-medium">My Online Judge</h2>
							<p className="text-sm">© 2025 Hồ Đình Vỹ. All rights reserved.</p>
						</div>
						<div className="flex gap-4 mt-4 sm:mt-0">
							<Dialog>
								<DialogTrigger asChild>
									<button className="hover:dark:text-gray-100 hover:text-gray-500">
										<Mail size={24} />
									</button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md dark:!bg-neutral-900 dark:!border-neutral-800">
									<DialogHeader>
										<DialogTitle className="dark:text-white">{t('oops')}</DialogTitle>
										<DialogDescription>{t('no-mail')} ✉️❌</DialogDescription>
									</DialogHeader>
									<DialogFooter className="sm:justify-start">
										<DialogClose asChild>
											<Button type="button" variant="secondary" className="dark:!bg-neutral-800 dark:hover:!bg-neutral-700">
												Close
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							<a href="https://github.com/nourist" target="_blank" rel="noopener noreferrer" className="hover:dark:text-white hover:text-gray-500 ">
								<Github size={24} />
							</a>
						</div>
					</div>
				</footer>
			}
		>
			{children}
		</DefaultLayout>
	);
};

DefaultLayoutWithFooter.propTypes = {
	children: PropTypes.node,
};

export default DefaultLayoutWithFooter;
