import { Metadata } from 'next';

import AdminHeader from './_layout/header';
import AdminSidebar from './_layout/sidebar';
import { ScrollArea } from '~/components/ui/scroll-area';
import { SidebarProvider } from '~/components/ui/sidebar';

interface Props {
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: 'FloatPoint OJ - Admin',
};

const AdminLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<ScrollArea className="h-[100vh] w-full md:w-[calc(100%-var(--sidebar-width))]">
				<div className="bg-card space-y-4 p-4">
					<AdminHeader />
					{children}
				</div>
			</ScrollArea>
		</SidebarProvider>
	);
};

export default AdminLayout;
