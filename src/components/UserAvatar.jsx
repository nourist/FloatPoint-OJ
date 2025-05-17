import PropTypes from 'prop-types';
import { Avatar } from '@material-tailwind/react';

import { getShortName } from '~/utils/avatar';
import { stringToBrightColor } from '~/utils/color';

const UserAvatar = ({ user, className = '' }) => {
	return user.avatar ? (
		<Avatar className={`size-8 ${className}`} src={`${user?.avatar}?timestamp=${new Date().getTime() + Math.round(Math.random() * 100000)}`} alt={user?.name}></Avatar>
	) : (
		<div className={`size-8 rounded-full ${className}`} style={{ backgroundColor: stringToBrightColor }}>
			{getShortName(user.name) || 'UR'}
		</div>
	);
};

UserAvatar.propTypes = {
	user: PropTypes.object.isRequired,
	className: PropTypes.string,
};

export default UserAvatar;
