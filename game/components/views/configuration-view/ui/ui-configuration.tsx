import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

// elements
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

import LanguageSelectorComponent from 'components/language/language-selector/language-selector';
import ThemeSelectorComponent from 'components/theme/theme-selector/theme-selector';

import { styles } from '../configuration-view.styles';

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

export function UIConfigurationComponent(props: IConfigurationViewProps) {
	const {
		// prettier-ignore
		__,
		classes,
	} = props;

	return (
		<>
			<Grid item xs={12} container component="section" className={classes.section}>
				<FormControl className={classes.formControl}>
					<InputLabel>{__('language')}</InputLabel>
					<LanguageSelectorComponent />
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel>{__('theme')}</InputLabel>
					<ThemeSelectorComponent />
				</FormControl>
			</Grid>
		</>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(UIConfigurationComponent))) as React.FunctionComponent<IConfigurationViewExternalProps>;
