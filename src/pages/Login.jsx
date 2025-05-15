import { login, logout } from '~/services/auth';

const Login = () => {
	return (
		<>
			<button
				onClick={() => {
					login('hodinhvys@gmail.com', 'Hodinhvy2010@').catch(console.error).then(console.log);
				}}
			>
				login
			</button>
			<br />
			<button onClick={logout}>logout</button>
		</>
	);
};

export default Login;
