import { withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './units-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IUnitsWidgetExternalProps {
	amount: number;
	change: number;
	compact: boolean;
	label: string;
	trained?: number;
	children: React.ReactElement | string;
}

/** Internal component properties include properties injected via dependency injection. */
interface IUnitsWidgetInternalProps {
	__: II18nTranslation;
}

type IUnitsWidgetProps = IUnitsWidgetExternalProps & IUnitsWidgetInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IUnitsWidgetExternalProps, IUnitsWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function UnitsWidgetComponent(props: IUnitsWidgetProps): any {
	const {
		// prettier-ignore
		amount,
		change,
		children,
		classes,
		compact,
		label,
	} = props;

	return (
		<Paper
			// prettier-ignore
			className={classes.root}
			elevation={0}
		>
			<Typography
				// prettier-ignore
				align="center"
				className={classes.unitNameLabel}
				variant="h5"
			>
				{label}
			</Typography>
			<Typography
				// prettier-ignore
				align="center"
				className={classes.unitAmountLabel}
				variant="h3"
			>
				{amount}
				{change === 0 ? null : (
					<Typography
						// prettier-ignore
						className={change > 0 ? classes.unitPositiveChangeLabel : classes.unitNegativeChangeLabel}
						component="span"
						variant="h4"
					>
						({change > 0 ? '+' : ''}
						{change})
					</Typography>
				)}
			</Typography>
			{compact ? null : (
				<Typography
					// prettier-ignore
					align="center"
					className={classes.description}
					variant="caption"
				>
					{children}
				</Typography>
			)}
		</Paper>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(UnitsWidgetComponent)));
