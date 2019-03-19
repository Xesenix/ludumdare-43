import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';

import { styles } from './train-widget.styles';

export interface ITrainUnitsWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	label: string;
	amount: number;
	canTrain?: (amount: number) => boolean;
	train?: (amount: number) => void;
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
						disabled={!this.canTrain()}
						onClick={this.train}
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

	private canTrain = () => {
		const { disabled, canTrain } = this.props;
		const { step } = this.state;

		return !disabled && canTrain && canTrain(step);
	}

	private train = (ev) => {
		const { train } = this.props;
		const { step } = this.state;

		if (train) {
			train(step);
		}
	}

	private canRelease = () => {
		const { disabled, canTrain } = this.props;
		const { step } = this.state;

		return !disabled && canTrain && canTrain(-step);
	}

	private release = (ev) => {
		const { train } = this.props;
		const { step } = this.state;

		if (train) {
			train(-step);
		}
	}
}

export default hot(module)(diDecorator(withStyles(styles)(TrainUnitsWidgetComponent)));
