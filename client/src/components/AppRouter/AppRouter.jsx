// import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';

import routesConfig from '~/config/routes';
import routes from '~/routes';
import useAuthStore from '~/stores/authStore';
import DefaultLayout from '~/layouts/DefaultLayout';

const AppRouter = () => {
	const { isAuth } = useAuthStore();

	return (
		<Router>
			<Routes>
				{routes.map((route, index) => {
					const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
					return (
						<Route
							key={index}
							path={route.path}
							element={
								isAuth && route.path == '/' ? (
									<Navigate to={routesConfig.home} />
								) : !isAuth && route.path == '/home' ? (
									<Navigate to={routesConfig.welcome} />
								) : route.type == 'auth' && !isAuth ? (
									<Navigate to={routesConfig.welcome} />
								) : route.type == 'redirect' && isAuth ? (
									<Navigate to={routesConfig.home} />
								) : (
									<Layout>
										<route.page />
									</Layout>
								)
							}
						/>
					);
				})}
				<Route path="*" element={<Navigate to={routesConfig.notFound} />} />
			</Routes>
		</Router>
	);
};

AppRouter.propTypes = {};

export default AppRouter;
