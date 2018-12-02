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
import { styles } from './sacrifices-widget.styles';

export interface ISacrificesWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	engine: GameEngine;
}

const diDecorator = connectToInjector<ISacrificesWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface ISacrificesWidgetState {}

class SacrificesWidgetComponent extends React.Component<ISacrificesWidgetProps & WithStyles<typeof styles>, ISacrificesWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, __, engine } = this.props;
		const { disabled, weaknessReduction, sacrificeCost, sacrificeCount } = engine.getState();

		return (
			<Paper className={classes.root} elevation={0}>
				<Typography variant="display1" component="h3">
					Sacrifices made {sacrificeCount}:
				</Typography>
				<Button
					color="secondary"
					variant="extendedFab"
					disabled={disabled || !engine.canMakeSacrificeForImmunity()}
					onClick={engine.sacrificeResourcesForImmunity}
					size="large"
				>
					Make sacrifice for one turn immunity ({ sacrificeCost }&nbsp;resources)
				</Button>
				<Button
					color="secondary"
					variant="extendedFab"
					disabled={disabled || !engine.canMakeSacrificeForWeakness()}
					onClick={engine.sacrificeResourcesForEnemyWeakness}
					size="large"
				>
					Make sacrifice for permament enemy weakness -{(weaknessReduction * 100).toFixed(2)}% multiplicative ({ sacrificeCost }&nbsp;idle population)
				</Button>
			</Paper>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(SacrificesWidgetComponent)));
