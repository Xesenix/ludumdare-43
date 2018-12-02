import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import AppBar from '@material-ui/core/AppBar';
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

import { styles } from './status-widget.styles';

export interface IStatusWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	population: { current: number, max: number };
	resources: { current: number, income: number };
	turn: number;
}

const diDecorator = connectToInjector<IStatusWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IStatusWidgetState {}

class StatusWidgetComponent extends React.PureComponent<IStatusWidgetProps & WithStyles<typeof styles>, IStatusWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, population, resources, turn } = this.props;

		return (
			<Paper className={classes.root}>
				<div className={classes.resources}>
					<Typography variant="headline" align="left">Resources</Typography>
					<Typography variant="display2" align="left">{resources.current }(+{resources.income})</Typography>
					<Typography variant="caption" align="left">
						Hire more workers to collect more resources.
					</Typography>
				</div>
				<div className={classes.year}>
					<Typography variant="display2" align="center">Year { turn }</Typography>
				</div>
				<div className={classes.population}>
					<Typography variant="headline" align="right">Population</Typography>
					<Typography variant="display2" align="right">{population.current}/{population.max}</Typography>
					<Typography variant="caption" align="right">
						Build more cottages to increase max population.
					</Typography>
				</div>
			</Paper>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(StatusWidgetComponent)));
