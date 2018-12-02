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
	canHire?: (amount: number) => boolean;
	hire?: (amount: number) => void;
	canRelease?: (amount: number) => boolean;
	release?: (amount: number) => void;
	trained?: number;
	change?: number;
	height: number;
	hideActionBar: boolean;
}

const diDecorator = connectToInjector<IUnitsWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IUnitsWidgetState {
	amount: number;
}

class UnitsWidgetComponent extends React.PureComponent<IUnitsWidgetProps & WithStyles<typeof styles>, IUnitsWidgetState> {
	constructor(props) {
		super(props);
		this.state = {
			amount: 1,
		};
	}

	public componentDidMount() {
		document.addEventListener('keydown', this.setAmount);
		document.addEventListener('keyup', this.setAmount);
	}

	public componentWillUnmount() {
		document.removeEventListener('keydown', this.setAmount);
		document.removeEventListener('keyup', this.setAmount);
	}

	public render(): any {
		const { amount: incAmount } = this.state;
		const { label, amount, trained = 0, classes, __, children, hideActionBar = false, change = 0, height = 270 } = this.props;

		const actionsBar = hideActionBar ? null : (<div className={classes.actions}>
			<Button
				className={classes.actionButton}
				color="primary"
				variant="extendedFab"
				disabled={!this.canHire()}
				onClick={this.hire}
			>
				+
			</Button>
			<Typography className={classes.actionLabel} variant="subheading">{ trained } (+/-{incAmount})</Typography>
			<Button
				className={classes.actionButton}
				color="primary"
				variant="extendedFab"
				disabled={!this.canRelease()}
				onClick={this.release}
			>
				-
			</Button>
		</div>);

		return (
			<div className={classes.root}>
				<Paper className={classes.unit} style={{ height: `${height}px` }}>
					<Typography className={classes.unitAmountLabel} variant="display2" align="center">{ amount }</Typography>
					<Typography className={classes.unitNameLabel} variant="headline" align="center">{ label }</Typography>
					<Typography className={classes.description} variant="caption" align="center">{ children }</Typography>
				</Paper>
				{ hideActionBar ? null : <Typography className={classes.unitLabel} variant="subheading" align="center">train/release</Typography>}
				{ actionsBar }
			</div>
		);
	}

	private setAmount = (ev: KeyboardEvent) => {
		const { amount } = this.state;
		const newAmount = ev.shiftKey ? 5 : 1;
		console.log('newAmount', newAmount, ev);
		if (amount !== newAmount) {
			this.setState({
				amount: newAmount,
			});
		}
	}

	private canHire = () => {
		const { disabled, canHire } = this.props;
		const { amount } = this.state;

		return !disabled && canHire(amount);
	}

	private hire = (ev) => {
		const { hire } = this.props;
		const { amount } = this.state;

		hire(amount);
	}

	private canRelease = () => {
		const { disabled, canRelease } = this.props;
		const { amount } = this.state;

		return !disabled && canRelease(amount);
	}

	private release = (ev) => {
		const { release } = this.props;
		const { amount } = this.state;

		release(amount);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(UnitsWidgetComponent)));
