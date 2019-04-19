import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nPluralTranslation, II18nTranslation } from 'lib/i18n';

import { styles } from './status-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IStatusWidgetProps {
	compact: boolean;
	population: { current: number; change: number; max: number };
	resources: { current: number; income: number };
	turn: number;
}

/** Internal component properties include properties injected via dependency injection. */
interface IStatusWidgetInternalProps {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	di?: Container;
	store?: Store<any, any>;
}

const diDecorator = connectToInjector<IStatusWidgetProps, IStatusWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
});

/** Internal component state. */
interface IStatusWidgetState {}

class StatusWidgetComponent extends React.PureComponent<IStatusWidgetProps & IStatusWidgetInternalProps & WithStyles<typeof styles>, IStatusWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const {} = this.state;
		const { classes, population, resources, turn, compact, __, _$ } = this.props;

		return (
			<Paper className={classes.root} elevation={0}>
				<Grid container>
					<Grid className={classes.resources} item xs={6} sm={4}>
						<Typography variant="h5">{__(`Resources`)}</Typography>
						<Typography className={classes.resourcesAmountLabel} variant="h4">
							{resources.current}
							<Typography
								// prettier-ignore
								className={resources.income > 0 ? classes.positiveChangeLabel : classes.negativeChangeLabel}
								variant="h5"
								component="span"
							>
								({resources.income > 0 ? '+' : ''}
								{resources.income})
							</Typography>
						</Typography>
						{compact ? null : <Typography variant="caption">{__(`Hire more workers to collect more resources.`)}</Typography>}
					</Grid>
					<Grid className={classes.year} item xs={12} sm={4}>
						<Typography variant="h4">{_$(turn + 1, `Year one`, `Year %{turn}`, { turn: turn + 1 })}</Typography>
					</Grid>
					<Grid className={classes.population} item xs={6} sm={4}>
						<Typography variant="h5">{__(`Population`)}</Typography>
						<Typography className={classes.populationAmountLabel} variant="h4">
							{population.current}
							<Typography
								// prettier-ignore
								className={population.change > 0 ? classes.positiveChangeLabel : classes.negativeChangeLabel}
								variant="h5"
								component="span"
							>
								{population.change ? `(${population.change > 0 ? '+' : ''}${population.change})` : null}
							</Typography>
							/{population.max}
						</Typography>
						{compact ? null : <Typography variant="caption">{__(`Build more cottages to increase max population.`)}</Typography>}
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

export default hot(module)(withStyles(styles)(diDecorator(StatusWidgetComponent)));
