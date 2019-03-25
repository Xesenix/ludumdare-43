import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './train-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface ITrainUnitsWidgetProps {
	amount: number;
	canTrain?: (amount: number) => boolean;
	disabled: boolean;
	label: string;
	release?: (amount: number) => void;
	train?: (amount: number) => void;
	trained?: number;
}

/** Internal component properties include properties injected via dependency injection. */
interface ITrainUnitsWidgetInternalProps {
	__: II18nTranslation;
	di?: Container;
	store?: Store<any, any>;
}

const diDecorator = connectToInjector<ITrainUnitsWidgetProps, ITrainUnitsWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

/** Internal component state. */
interface ITrainUnitsWidgetState {
	step: number;
}

class TrainUnitsWidgetComponent extends React.Component<ITrainUnitsWidgetProps & ITrainUnitsWidgetInternalProps & WithStyles<typeof styles>, ITrainUnitsWidgetState> {
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
		const {
			__,
			classes,
			label,
			trained = 0,
		} = this.props;

		return (
			<div className={classes.root}>
				<Typography
					align="center"
					className={classes.label}
					variant="subheading"
				>
					{label}
				</Typography>
				<div className={classes.actions}>
					<Button
						className={classes.actionButton}
						color="primary"
						disabled={!this.canTrain()}
						onClick={this.train}
						variant="extendedFab"
					>
						+
					</Button>
					<span className={classes.actionLabelContainer}>
						<Typography
							className={classes.actionLabel}
							component="span"
							variant="title"
						>
							{trained}
						</Typography>
						<Typography
							className={classes.actionLabel}
							component="span"
							variant="caption"
						>
							{__(`+/-%{step} hold ctrl/alt`, { step })}
						</Typography>
					</span>
					<Button
						className={classes.actionButton}
						color="primary"
						disabled={!this.canRelease()}
						onClick={this.release}
						variant="extendedFab"
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

export default hot(module)(withStyles(styles)(diDecorator(TrainUnitsWidgetComponent)));
