import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';

import Loader from 'components/loader/loader';
import LoaderErrorView from 'components/loader/loader-error-view';
import LoginView from 'components/views/login-view/login-view';

import LazyLoaderFactory from 'lib/core/components/lazy-loader-factory';
import AuthenticationGuard from 'lib/user/components/authentication-guard';

const BigLoader = () => <Loader size={128}/>;

const IntroView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "intro" */ 'components/views/intro-view/intro-view'),
	BigLoader,
	LoaderErrorView,
);
const GameView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "game" */ 'components/views/game-view/game-view'),
	BigLoader,
	LoaderErrorView,
);
const ConfigurationView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "config" */ 'components/views/configuration-view/configuration-view'),
	BigLoader,
	LoaderErrorView,
);

function AppRouting(): React.ReactElement {
	return (
		<Switch>
			<Route
				path="/login/:redirectPath+"
				component={LoginView}
			/>
			<Route exact path="/" component={IntroView} />
			<Route path="/config" component={ConfigurationView}/>
			<Route
				path="/game"
				children={(
					<AuthenticationGuard
						allowed={<GameView/>}
						disallowed={<Redirect to="/login/game"/>}
					/>
				)}
			/>
		</Switch>
	);
}

export default hot(module)(AppRouting);
