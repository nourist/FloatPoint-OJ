// import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';

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
								isAuth && route.path === '/login' ? (
									<Navigate to="/" />
								) : !isAuth && route.path !== '/login' ? (
									<Navigate to="/login" />
								) : (
									<Layout>
										<route.page />
									</Layout>
								)
							}
						/>
					);
				})}
				<Route path="*" element={<Navigate to="/404" />} />
			</Routes>
		</Router>
	);
};

AppRouter.propTypes = {};

export default AppRouter;
