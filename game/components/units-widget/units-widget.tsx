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

import { styles } from './units-widget.styles';

export interface IUnitsWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	label: string;
	amount: number;
	trained?: number;
	change: number;
	compact: boolean;
}

const diDecorator = connectToInjector<IUnitsWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IUnitsWidgetState {}

class UnitsWidgetComponent extends React.PureComponent<IUnitsWidgetProps & WithStyles<typeof styles>, IUnitsWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { label, amount, classes, __, children, change, compact } = this.props;

		return (
			<Paper className={classes.root} elevation={0}>
				<Typography className={classes.unitNameLabel} variant="headline" align="center">{ label }</Typography>
				<Typography className={classes.unitAmountLabel} variant="display2" align="center">
					{ amount }
					{ change === 0
						? null
						: (
							<Typography
								className={change > 0 ? classes.unitPositiveChangeLabel : classes.unitNegativeChangeLabel}
								variant="display1"
								component="span"
							>
								({change > 0 ? '+' : ''}{ change })
							</Typography>
						)
					}
				</Typography>
				{ compact ? null : <Typography className={classes.description} variant="caption" align="center">{ children }</Typography> }
			</Paper>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(UnitsWidgetComponent)));
