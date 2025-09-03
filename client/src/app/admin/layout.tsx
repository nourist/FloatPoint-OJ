'use client';

import AdminSidebar from './_layout/sidebar';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';

interface Props {
	children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset className="bg-card">{children}</SidebarInset>
		</SidebarProvider>
	);
};

export default AdminLayout;
