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

function TabPanel({ selected, index, children, ...props }) {
	return (
		<Container hidden={selected !== index} {...props}>
			{ children }
		</Container>
	);
}

export function ConfigurationViewComponent(props: IConfigurationViewProps) {
	const {
		// prettier-ignore
		__,
	} = props;

	const classes = useStyles();

	const [selectedTab, selectTab] = React.useState(0);

	const onTabChange = React.useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
		selectTab(newValue);
	}, [selectTab]);

	return (
		<Container className={classes.root}>
			<Tabs
				onChange={onTabChange}
				scrollButtons="on"
				value={selectedTab}
				variant="scrollable"
			>
				<Tab label={__('Sound configuration')}/>
				<Tab label={__('User interface configuration')}/>
			</Tabs>

			<TabPanel className={classes.section} index={0} selected={selectedTab}>
				<SoundConfigurationComponent />
			</TabPanel>

			<TabPanel className={classes.section} index={1} selected={selectedTab}>
				<UIConfigurationComponent />
			</TabPanel>

		</Container>
	);
}

export default hot(module)(diDecorator(ConfigurationViewComponent));
