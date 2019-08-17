import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

// elements
import Typography from '@material-ui/core/Typography';

import { styles } from './configuration-view.styles';
import SoundConfigurationComponent from './sound/sound-configuration';
import UIConfigurationComponent from './ui/ui-configuration';

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
}

type IConfigurationViewProps = IConfigurationViewExternalProps & IConfigurationViewInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IConfigurationViewExternalProps, IConfigurationViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export function ConfigurationViewComponent(props: IConfigurationViewProps) {
	const {
		// prettier-ignore
		__,
		classes,
	} = props;

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

export default hot(module)(withStyles(styles)(diDecorator(ConfigurationViewComponent)));
