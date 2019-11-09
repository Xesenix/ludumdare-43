import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps } from 'react-router';
import { Link, Route, Switch, useLocation } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AclGuard from 'lib/acl/components/acl-guard';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

// elements
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import GameConfigurationComponent from './game/game-configuration';
import SoundConfigurationComponent from './sound/sound-configuration';
import UIConfigurationComponent from './ui/ui-configuration';

import { ConfigureGameLink, ConfigureUILink } from 'components/core/navigation-links';
import { useStyles } from './configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
}

type IConfigurationViewProps = IConfigurationViewExternalProps & IConfigurationViewInternalProps & RouteComponentProps;

const diDecorator = connectToInjector<IConfigurationViewExternalProps, IConfigurationViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export function ConfigurationViewComponent(props: IConfigurationViewProps) {
	const {
		// prettier-ignore
		__,
	} = props;
	const location = useLocation();
	const classes = useStyles();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Container className={classes.root}>
			<Tabs
				scrollButtons={ matches ? 'on' : 'off' }
				value={location.pathname}
				variant="scrollable"
			>
				<Tab
					component={Link}
					label={__('Sound configuration')}
					to="/config"
					value="/config"
				/>
				<Tab
					component={ConfigureUILink}
					label={__('User interface configuration')}
					value="/config/ui"
				/>
				<Tab
					component={ConfigureGameLink}
					label={__('Game configuration')}
					value="/config/game"
				/>
			</Tabs>

			<Fade
				in={true}
				key={location.pathname.split('/')[2]}
			>
				<Container className={classes.section}>
					<Switch>
						<Route
							exact
							path="/config"
							component={SoundConfigurationComponent}
						/>
						<Route
							exact
							path="/config/ui"
							component={UIConfigurationComponent}
						/>
						<Route
							exact
							path="/config/game"
							children={(
								<AclGuard
									resource="game"
									permissions="setup"
									allowed={<GameConfigurationComponent/>}
									disallowed={<Snackbar open={true} message={__(`You don't have access to this part`)}/>}
								/>
							)}
						/>
					</Switch>
				</Container>
			</Fade>
		</Container>
	);
}

export default hot(module)(diDecorator(ConfigurationViewComponent));
