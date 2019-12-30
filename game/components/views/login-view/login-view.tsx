import React, { useRef } from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, useParams } from 'react-router-dom';

// elements
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

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
	bindToStore: (keys: (keyof IAppState)[]) => IAppState;
	sessionService: SessionService;
}

type ILoginViewProps = ILoginViewExternalProps & ILoginViewInternalProps;

const diDecorator = connectToInjector<ILoginViewExternalProps, ILoginViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	sessionService: {
		dependencies: ['user:session'],
	},
});

function LoginViewComponent(props: ILoginViewProps): any {
	const {
		// prettier-ignore
		__,
		bindToStore,
		sessionService,
	} = props;
	const { authenticationError = false } = bindToStore([
		// prettier-ignore
		'authenticationError',
	]);
	const { redirectPath } = useParams();
	const loginRef = useRef(null);
	const passwordRef = useRef(null);
	const onAuthenticate = React.useCallback(() => {
		sessionService.authenticate({
			method: 'kongregate',
			login: loginRef && loginRef.current && loginRef.current.value ? loginRef.current.value : '',
			password: passwordRef && passwordRef.current && passwordRef.current.value ? passwordRef.current.value : '',
		});
	}, [sessionService, loginRef, passwordRef]);
	const classes = useStyles();

	const loginForm = (
		<Dialog
			open={true}
		>
			<DialogTitle>{ __('Authenticate') }</DialogTitle>
			<DialogContent>
				<FormControl
					className={classes.formControl}
				>
					<TextField
						// prettier-ignore
						error={!!authenticationError}
						fullWidth
						label={__('login')}
						size="small"
						variant="outlined"
						inputRef={loginRef}
					/>
				</FormControl>
				<FormControl
					className={classes.formControl}
				>
					<TextField
						// prettier-ignore
						error={!!authenticationError}
						fullWidth
						label={__('password')}
						type="password"
						size="small"
						variant="outlined"
						inputRef={passwordRef}
					/>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					onClick={onAuthenticate}
					variant="contained"
				>
					{ __('Login') }
				</Button>
			</DialogActions>
		</Dialog>
	);

	return (
		<AuthenticationGuard
			allowed={<Redirect to={`/${redirectPath}`}/>}
			disallowed={loginForm}
		/>
	);
}

export default hot(module)(diDecorator(LoginViewComponent));
