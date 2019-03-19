import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getResourcesStolenInLastTurn } from 'game/features/resources/resources';
import {
	// prettier-ignore
	getAttackPower,
	getBaseAttackPower,
} from 'game/features/skills/attack';
import {
	// prettier-ignore
	getWeaknessDamageReduction,
	getWeaknessLevel,
} from 'game/features/skills/weakness';
import { getPopulationKilledInLastTurn } from 'game/features/units/population';
import { IGameState } from 'game/store';
import { connectToInjector } from 'lib/di';

import { getWallsLevel, getWallsReduction } from 'game/features/buildings/walls';
import { styles } from './event-widget.styles';

export interface IEventWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	event: string;
	currentState: IGameState;
	consequences: IGameState;
}

const diDecorator = connectToInjector<IEventWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IEventWidgetState {}

class EventWidgetComponent extends React.PureComponent<IEventWidgetProps & WithStyles<typeof styles>, IEventWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, currentState, consequences } = this.props;
		const { event, immunity } = currentState;
		let description;

		if (immunity) {
			description = (
				<Paper className={classes.sacrifice}>
					<Typography className={classes.sacrificeTitle} variant="display1" component="p">
						You have prevented attack with resource sacrifice.
					</Typography>
				</Paper>
			);
		} else {
			description = (
				<Paper elevation={0}>
					<Typography className={classes.attackTitle} variant="display1" component="p">
						{event} attack power {Math.floor(getAttackPower(currentState))}
					</Typography>
					<Paper className={classes.attackContainer} elevation={0}>
						<Grid container>
							<Grid className={classes.powerContainer} item xs={12} sm={4}>
								<Typography className={classes.powerDescription} variant="subheading" component="p">
									Original power {Math.floor(getBaseAttackPower(currentState))}
								</Typography>
								<Typography className={classes.powerDescription} variant="caption" component="span">
									weakness lvl {getWeaknessLevel(currentState)} reduced it by { (getWeaknessDamageReduction(currentState) * 100).toFixed(2) }%
								</Typography>
								<Typography className={classes.powerDescription} variant="caption" component="span">
									wall lvl {getWallsLevel(currentState)} reduced it by {getWallsReduction(currentState)}
								</Typography>
							</Grid>
							<Grid className={classes.consequencesContainer} container item xs={12} sm={8}>
								<Grid item xs={12}>
									<Typography className={classes.label} variant="headline" component="p">Attack consequences</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography className={classes.amountDescription} variant="headline" component="p">{getPopulationKilledInLastTurn(consequences)}</Typography>
									<Typography className={classes.label} variant="caption" component="p">casualties</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography className={classes.amountDescription} variant="headline" component="p">{getResourcesStolenInLastTurn(consequences)}</Typography>
									<Typography className={classes.label} variant="caption" component="p">resources stolen</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Paper>
			);
		}

		return description;
	}
}

export default hot(module)(diDecorator(withStyles(styles)(EventWidgetComponent)));
