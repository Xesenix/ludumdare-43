import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// icons
import ConfigIcon from '@material-ui/icons/Build';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import MenuIcon from '@material-ui/icons/Menu';
import PausedIcon from '@material-ui/icons/PauseCircleFilled';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import BackIcon from '@material-ui/icons/Undo';
import MuteOnIcon from '@material-ui/icons/VolumeOff';
import MuteOffIcon from '@material-ui/icons/VolumeUp';

import { connectToInjector } from 'lib/di';

import { GameEngine } from '../../src/engine';
import { styles } from './buildings-widget.styles';

export interface IBuildingsWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	engine: GameEngine;
}

const diDecorator = connectToInjector<IBuildingsWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IBuildingsWidgetState {}

class BuildingsWidgetComponent extends React.Component<IBuildingsWidgetProps & WithStyles<typeof styles>, IBuildingsWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, __, engine } = this.props;
		const { disabled, homesCount, wallPower } = engine.getState();

		return (
			<Paper className={classes.root} elevation={0}>
				<Typography variant="display1" component="h3">
					Buildings:
				</Typography>
				<Button
					color="secondary"
					variant="extendedFab"
					disabled={disabled || !engine.canBuildWall()}
					onClick={engine.buildWall}
				>
					Build wall (current reduction: { wallPower }) (+30 enemy power reduction cost { engine.wallCost() } resources)
				</Button>
				<Button
					color="secondary"
					variant="extendedFab"
					disabled={disabled || !engine.canBuildHome()}
					onClick={engine.buildHome}
				>
					Build home ({ homesCount }) (+20 max population cost { engine.homeCost() } resources)
				</Button>
			</Paper>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(BuildingsWidgetComponent)));
