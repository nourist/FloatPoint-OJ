'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, ...props }: React.ComponentProps<typeof Link>) => {
	return <Link href={href} {...props} data-active={usePathname() === href} />;
};

export default NavLink;
