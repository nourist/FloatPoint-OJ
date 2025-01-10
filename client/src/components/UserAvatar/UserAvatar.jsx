import PropTypes from 'prop-types';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

import { getShortName } from '~/utils/avatar';
import { stringToBrightColor } from '~/utils/color';

const UserAvatar = ({ user, className = '' }) => {
	return (
		<Avatar className={`size-8 ${className}`}>
			<AvatarImage src={user.avatar} alt={user.name} />
			<AvatarFallback style={{ background: stringToBrightColor(user.name) }} className="text-sm text-gray-800">
				{getShortName(user.name)}
			</AvatarFallback>
		</Avatar>
	);
};

UserAvatar.propTypes = {
	user: PropTypes.object.isRequired,
	className: PropTypes.string,
};

export default UserAvatar;
