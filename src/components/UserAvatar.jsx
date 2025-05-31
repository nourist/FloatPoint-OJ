import PropTypes from 'prop-types';
import { Avatar } from '@material-tailwind/react';

import { getShortName } from '~/utils/avatar';
import { stringToBrightColor } from '~/utils/color';

const UserAvatar = ({ user, className = '' }) => {
	return user.avatar ? (
		<Avatar className={`${className}`} src={`${user?.avatar}?timestamp=${new Date().getTime() + Math.round(Math.random() * 100000)}`} alt={user?.name}></Avatar>
	) : (
		<span className={`flex-center !inline-flex size-12 rounded-full ${className}`} style={{ backgroundColor: stringToBrightColor(user.name) }}>
			{getShortName(user.name) || 'UR'}
		</span>
	);
};

UserAvatar.propTypes = {
	user: PropTypes.object.isRequired,
	className: PropTypes.string,
};

export default UserAvatar;
