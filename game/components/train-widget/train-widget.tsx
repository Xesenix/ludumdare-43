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

import { styles } from './train-widget.styles';

export interface ITrainUnitsWidgetProps {
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
}

const diDecorator = connectToInjector<ITrainUnitsWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface ITrainUnitsWidgetState {
	step: number;
}

class TrainUnitsWidgetComponent extends React.Component<ITrainUnitsWidgetProps & WithStyles<typeof styles>, ITrainUnitsWidgetState> {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
		};
	}

	public componentDidMount() {
		document.addEventListener('keydown', this.setStep);
		document.addEventListener('keyup', this.setStep);
	}

	public componentWillUnmount() {
		document.removeEventListener('keydown', this.setStep);
		document.removeEventListener('keyup', this.setStep);
	}

	public render(): any {
		const { step } = this.state;
		const { label, trained = 0, classes, __ } = this.props;

		return (
			<div className={classes.root}>
				<Typography className={classes.label} variant="subheading" align="center">{label}</Typography>
				<div className={classes.actions}>
					<Button
						className={classes.actionButton}
						color="primary"
						variant="extendedFab"
						disabled={!this.canHire()}
						onClick={this.hire}
					>
						+
					</Button>
					<span className={classes.actionLabelContainer}>
						<Typography className={classes.actionLabel} variant="title" component="span">{ trained }</Typography>
						<Typography className={classes.actionLabel} variant="caption" component="span">+/-{step} hold ctrl/alt</Typography>
					</span>
					<Button
						className={classes.actionButton}
						color="primary"
						variant="extendedFab"
						disabled={!this.canRelease()}
						onClick={this.release}
					>
						-
					</Button>
				</div>
			</div>
		);
	}

	private setStep = (ev: KeyboardEvent) => {
		const { step } = this.state;
		const newStep = ev.ctrlKey ? 25 : ev.altKey ? 5 : 1;

		if (step !== newStep) {
			this.setState({
				step: newStep,
			});
		}
	}

	private canHire = () => {
		const { disabled, canHire } = this.props;
		const { step } = this.state;

		return !disabled && canHire && canHire(step);
	}

	private hire = (ev) => {
		const { hire } = this.props;
		const { step } = this.state;

		if (hire) {
			hire(step);
		}
	}

	private canRelease = () => {
		const { disabled, canRelease } = this.props;
		const { step } = this.state;

		return !disabled && canRelease && canRelease(step);
	}

	private release = (ev) => {
		const { release } = this.props;
		const { step } = this.state;

		if (release) {
			release(step);
		}
	}
}

export default hot(module)(diDecorator(withStyles(styles)(TrainUnitsWidgetComponent)));
