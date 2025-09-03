'use client';

import AdminHeader from './_layout/header';
import AdminSidebar from './_layout/sidebar';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';

interface Props {
	children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset className="bg-card space-y-4 p-4">
				<AdminHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
};

export default AdminLayout;
