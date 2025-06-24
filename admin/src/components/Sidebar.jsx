import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button } from '@material-tailwind/react';
import { LayoutDashboard, Code, Activity, Trophy, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

import logo from '~/assets/logo.png';
import { logout } from '~/services/auth';

const Sidebar = ({ classname = '' }) => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const [loading, setLoading] = useState(false);

	return (
		<div className={`bg-base-100 shadow-cmd fixed hidden h-[100vh] w-[250px] flex-col px-4 lg:flex ${classname}`}>
			<div className="px-4 py-6">
				<Link to="/" className="flex items-center gap-2">
					<img src={logo} className="size-8" alt="" />
					<h2 className="text-base-content text-2xl font-bold">FloatPoint</h2>
				</Link>
			</div>
			{[
				{
					path: '/',
					title: t('dashboard'),
					icon: LayoutDashboard,
				},
				{
					path: '/problem',
					title: t('problem'),
					icon: Code,
				},
				{
					path: '/submission',
					title: t('submission'),
					icon: Activity,
				},
				{
					path: '/contest',
					title: t('contest'),
					icon: Trophy,
				},
				{
					path: '/user',
					title: t('user'),
					icon: User,
				},
			].map((item, index) => (
				<Link key={index} to={item.path}>
					<Button
						data-active={item.path === '/' ? pathname === item.path : pathname.startsWith(item.path)}
						variant="text"
						ripple={false}
						className="hover:!bg-base-300 data-[active=true]:!bg-primary/15 text-base-content/70 my-1 flex h-[52px] w-full cursor-pointer items-center gap-2 px-4 text-[15px] font-normal capitalize"
					>
						<div
							data-active={item.path === '/' ? pathname === item.path : pathname.startsWith(item.path)}
							className="flex-center data-[active=true]:bg-primary size-8 rounded-md data-[active=true]:text-white"
						>
							<item.icon strokeWidth="1.5" className="size-5" />
						</div>
						{item.title}
					</Button>
				</Link>
			))}
			<Button
				onClick={() => {
					setLoading(true);
					logout()
						.then(toast.success)
						.finally(() => setLoading(false));
				}}
				loading={loading}
				variant="text"
				className="hover:!bg-error/20 hover:text-error text-base-content/70 mb-4 mt-auto flex h-[52px] w-full cursor-pointer items-center gap-2 px-4 text-[15px] font-normal capitalize"
			>
				<div className="flex-center size-8">
					<LogOut strokeWidth="1.5" className="size-5" />
				</div>
				{t('logout')}
			</Button>
		</div>
	);
};

Sidebar.propTypes = {
	classname: PropTypes.string,
};

export default Sidebar;
