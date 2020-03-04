import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import SaveStateComponent from 'game/components/setup/save-state';

import { useStyles } from '../configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IGameConfigurationExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IGameConfigurationInternalProps {
}

type IGameConfigurationProps = IGameConfigurationExternalProps & IGameConfigurationInternalProps;

function SaveMenuComponent() {
	return (
		<List dense={true}>
			<ListItem button>
				<ListItemText
					primary="Save new"
				/>
			</ListItem>
			<ListItem button>
				<ListItemText
					primary="Auto Save"
					secondary="2019-08-29 18:24:56"
				/>
			</ListItem>
			<ListItem button>
				<ListItemText
					primary="Great progress 01"
					secondary="2019-08-09 16:24:56"
				/>
			</ListItem>
		</List>
	);
}

function GameConfigurationComponent(props: IGameConfigurationProps): any {
	const classes = useStyles();

	return (
		<Grid container>
			<Grid item xs={12} sm={3}>
				<SaveMenuComponent />
			</Grid>
			<Grid item xs={12} sm={9}>
				<SaveStateComponent classes={classes}/>
			</Grid>
		</Grid>
	);
}

export default hot(module)(GameConfigurationComponent);
