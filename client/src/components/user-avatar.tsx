import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { cn, getShortName, stringToBrightColor } from '~/lib/utils';
import { User } from '~/types/user.type';

interface Props {
	user: User;
	className?: string;
}

const UserAvatar = ({ user, className = '' }: Props) => {
	return (
		<Avatar className={cn('size-8', className)}>
			<AvatarImage src={user?.avatarUrl ?? undefined} alt={user.username} />
			<AvatarFallback style={{ background: stringToBrightColor(user.username) }} className={cn('text-sm text-gray-800', className)}>
				{getShortName(user.username)}
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;
