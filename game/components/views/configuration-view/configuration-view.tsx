import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

// elements
import Container from '@material-ui/core/Container';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import GameConfigurationComponent from './game/game-configuration';
import SoundConfigurationComponent from './sound/sound-configuration';
import UIConfigurationComponent from './ui/ui-configuration';

import { useStyles } from './configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
}

type IConfigurationViewProps = IConfigurationViewExternalProps & IConfigurationViewInternalProps;

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

	const classes = useStyles();
	return (
		<form className={classes.root}>
			<Typography className={classes.section} component="h1" variant="h5">
				{__('Sound configuration')}
			</Typography>
			<SoundConfigurationComponent />
			<Typography className={classes.section} component="h1" variant="h5">
				{__('User interface configuration')}
			</Typography>
			<UIConfigurationComponent />
		</form>
	);
}

export default hot(module)(diDecorator(ConfigurationViewComponent));
