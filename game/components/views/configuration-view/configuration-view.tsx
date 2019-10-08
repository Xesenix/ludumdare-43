import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

// elements
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
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
		location,
	} = props;

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
							component={GameConfigurationComponent}
						/>
					</Switch>
				</Container>
			</Fade>
		</Container>
	);
}

export default hot(module)(withRouter(diDecorator(ConfigurationViewComponent)));
