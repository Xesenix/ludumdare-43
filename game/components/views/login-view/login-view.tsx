import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, useParams } from 'react-router-dom';

// elements
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';
import AuthenticationGuard from 'lib/user/components/authentication-guard';
import { SessionService } from 'lib/user/session.service';

import { useStyles } from './login-view.styles';

/** Component public properties required to be provided by parent component. */
export interface ILoginViewExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface ILoginViewInternalProps {
	__: II18nTranslation;
	sessionService: SessionService;
}

type ILoginViewProps = ILoginViewExternalProps & ILoginViewInternalProps;

const diDecorator = connectToInjector<ILoginViewExternalProps, ILoginViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	sessionService: {
		dependencies: ['user:session'],
	},
});

function LoginViewComponent(props: ILoginViewProps): any {
	const {
		// prettier-ignore
		__,
		sessionService,
	} = props;
	const { redirectPath } = useParams();
	const login = React.useCallback(() => {
		sessionService.authenticate({});
	}, [sessionService]);
	const classes = useStyles();

	const loginForm = (
		<Paper className={classes.root}>
			<Fab onClick={login}>{ __('Login') }</Fab>
		</Paper>
	);

	return (
		<AuthenticationGuard
			allowed={<Redirect to={`/${redirectPath}`}/>}
			disallowed={loginForm}
		/>
	);
}

export default hot(module)(diDecorator(LoginViewComponent));
