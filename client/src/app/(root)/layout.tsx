import Footer from './_layout/footer';
import Header from './_layout/header';
import { ScrollArea } from '~/components/ui/scroll-area';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<Header />
			<ScrollArea className="h-app overflow-x-auto">
				<div className="max-w-app min-h-app mx-auto py-6">{children}</div>
				<Footer />
			</ScrollArea>
		</>
	);
};

export default Layout;
