import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './units-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IUnitsWidgetProps {
	amount: number;
	change: number;
	compact: boolean;
	disabled: boolean;
	label: string;
	trained?: number;
}

/** Internal component properties include properties injected via dependency injection. */
interface IUnitsWidgetInternalProps {
	__: II18nTranslation;
	di?: Container;
	store?: Store<any, any>;
}

const diDecorator = connectToInjector<IUnitsWidgetProps, IUnitsWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

/** Internal component state. */
interface IUnitsWidgetState {}

class UnitsWidgetComponent extends React.PureComponent<IUnitsWidgetProps & IUnitsWidgetInternalProps & WithStyles<typeof styles>, IUnitsWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const {
			amount,
			change,
			children,
			classes,
			compact,
			label,
		} = this.props;

		return (
			<Paper
				className={classes.root}
				elevation={0}
			>
				<Typography
					className={classes.unitNameLabel}
					variant="headline"
					align="center"
				>
					{label}
				</Typography>
				<Typography
					className={classes.unitAmountLabel}
					variant="display2"
					align="center"
				>
					{amount}
					{ change === 0
						? null
						: (
							<Typography
								className={change > 0 ? classes.unitPositiveChangeLabel : classes.unitNegativeChangeLabel}
								variant="display1"
								component="span"
							>
								({change > 0 ? '+' : ''}{change})
							</Typography>
						)
					}
				</Typography>
				{ compact
					? null
					: (
						<Typography
							className={classes.description}
							variant="caption"
							align="center"
						>
							{children}
						</Typography>
					)
				}
			</Paper>
		);
	}
}

export default hot(module)(withStyles(styles)(diDecorator(UnitsWidgetComponent)));
