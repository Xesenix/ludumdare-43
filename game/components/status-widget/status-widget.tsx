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

import { styles } from './status-widget.styles';

export interface IStatusWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	population: { current: number, change: number, max: number };
	resources: { current: number, income: number };
	compact: boolean;
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
		const { classes, population, resources, turn, compact } = this.props;

		return (
			<Paper className={classes.root} elevation={0}>
				<Grid container>
					<Grid className={classes.resources} item xs={6} sm={4}>
						<Typography variant="headline">Resources</Typography>
						<Typography className={classes.resourcesAmountLabel} variant="display1">
							{resources.current}
							<Typography
								className={resources.income > 0 ? classes.positiveChangeLabel : classes.negativeChangeLabel}
								variant="headline"
								component="span"
							>
								({resources.income > 0 ? '+' : ''}{resources.income})
							</Typography>
						</Typography>
						{ compact ? null : (
							<Typography variant="caption">
								Hire more workers to collect more resources.
							</Typography>
						)}
					</Grid>
					<Grid className={classes.year} item xs={12} sm={4}>
						<Typography variant="display1">Year { turn }</Typography>
					</Grid>
					<Grid className={classes.population} item xs={6} sm={4}>
						<Typography variant="headline">Population</Typography>
						<Typography className={classes.populationAmountLabel} variant="display1">
							{population.current}
							<Typography
								className={population.change > 0 ? classes.positiveChangeLabel : classes.negativeChangeLabel}
								variant="headline"
								component="span"
							>
								{population.change ? `(${population.change > 0 ? '+' : ''}${population.change})` : null}
							</Typography>
							/{population.max}
						</Typography>
						{ compact ? null : (
							<Typography variant="caption">
								Build more cottages to increase max population.
							</Typography>
						)}
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(StatusWidgetComponent)));
