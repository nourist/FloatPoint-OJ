import { Link } from 'react-router';

const Welcome = () => {
	return (
		<div className="dark:bg-gray-900 h-full">
			<div
				className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
				style={{
					background:
						'linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)',
				}}
			></div>
			<header className="w-full h-20 flex justify-between items-center py-6 px-8">
				<img src="./logo.png" alt="" className="size-9" />
				<div></div>
				<Link>Login</Link>
			</header>
		</div>
	);
};

export default Welcome;
