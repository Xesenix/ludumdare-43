import { withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './train-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface ITrainUnitsWidgetExternalProps {
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
}

type ITrainUnitsWidgetProps = ITrainUnitsWidgetExternalProps & ITrainUnitsWidgetInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<ITrainUnitsWidgetExternalProps, ITrainUnitsWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function TrainUnitsWidgetComponent(props: ITrainUnitsWidgetProps) {
	const [ step, setStep ] = React.useState(1);

	const {
		// prettier-ignore
		__,
		canTrain,
		classes,
		disabled,
		label,
		train,
		trained = 0,
	} = props;

	const updateStep = React.useCallback((ev: KeyboardEvent) => {
		const newStep = ev.ctrlKey ? 25 : ev.altKey ? 5 : 1;

		if (step !== newStep) {
			setStep(newStep);
		}
	}, [step]);

	const add = React.useCallback(() => {
		if (train) {
			train(step);
		}
	}, [step]);

	const substract = React.useCallback(() => {
		if (train) {
			train(-step);
		}
	}, [step]);

	React.useEffect(() => {
		document.addEventListener('keydown', updateStep);
		document.addEventListener('keyup', updateStep);

		return () => {
			document.removeEventListener('keydown', updateStep);
			document.removeEventListener('keyup', updateStep);
		};
	}, [updateStep]);

	const canAdd = !disabled && canTrain && canTrain(step);
	const canSubstract = !disabled && canTrain && canTrain(-step);

	return (
		<div className={classes.root}>
			<Typography
				// prettier-ignore
				align="center"
				className={classes.label}
				variant="subtitle1"
			>
				{label}
			</Typography>
			<div className={classes.actions}>
				<Fab
					// prettier-ignore
					className={classes.actionButton}
					color="primary"
					disabled={!canAdd}
					onClick={add}
					variant="extended"
				>
					+
				</Fab>
				<span className={classes.actionLabelContainer}>
					<Typography
						// prettier-ignore
						className={classes.actionLabel}
						component="span"
						variant="h6"
					>
						{trained}
					</Typography>
					<Typography
						// prettier-ignore
						className={classes.actionLabel}
						component="span"
						variant="caption"
					>
						{__(`+/-%{step} hold ctrl/alt`, { step })}
					</Typography>
				</span>
				<Fab
					// prettier-ignore
					className={classes.actionButton}
					color="primary"
					disabled={!canSubstract}
					onClick={substract}
					variant="extended"
				>
					-
				</Fab>
			</div>
		</div>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(TrainUnitsWidgetComponent)));
