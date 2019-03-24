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
import { II18nTranslation } from 'lib/i18n';

import { getWallsLevel, getWallsReduction } from 'game/features/buildings/walls';
import { styles } from './event-widget.styles';

export interface IEventWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: II18nTranslation;
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
		const { classes, currentState, consequences, __ } = this.props;
		const { event, immunity } = currentState;
		let description;

		if (immunity) {
			description = (
				<Paper className={classes.sacrifice}>
					<Typography
						className={classes.sacrificeTitle}
						component="p"
						variant="display1"
					>
						{__(`You have prevented attack with resource sacrifice.`)}
					</Typography>
				</Paper>
			);
		} else {
			description = (
				<Paper elevation={0}>
					<Typography
						className={classes.attackTitle}
						component="p"
						variant="display1"
					>
						{event} attack power {Math.floor(getAttackPower(currentState))}
					</Typography>
					<Paper
						className={classes.attackContainer}
						elevation={0}
					>
						<Grid container>
							<Grid
								className={classes.powerContainer}
								item
								sm={4}
								xs={12}
							>
								<Typography
									className={classes.powerDescription}
									component="p"
									variant="subheading"
								>
									Original power {Math.floor(getBaseAttackPower(currentState))}
								</Typography>
								<Typography
									className={classes.powerDescription}
									component="span"
									variant="caption"
								>
									{__(`weakness lvl %{weaknessLvl} reduced it by %{weaknessDamageReduction}%`, {
										weaknessLvl: getWeaknessLevel(currentState),
										weaknessDamageReduction: (getWeaknessDamageReduction(currentState) * 100).toFixed(2),
									})}
								</Typography>
								<Typography
									className={classes.powerDescription}
									component="span"
									variant="caption"
								>
									{__(`wall lvl %{weaknessLvl} reduced it by %{wallsReduction}`, {
										weaknessLvl: getWallsLevel(currentState),
										wallsReduction: getWallsReduction(currentState),
									})}
								</Typography>
							</Grid>
							<Grid
								className={classes.consequencesContainer}
								container
								item
								xs={12}
								sm={8}
							>
								<Grid item xs={12}>
									<Typography
										className={classes.label}
										variant="headline"
										component="p"
									>
										{__(`Attack consequences`)}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography
										className={classes.amountDescription}
										variant="headline"
										component="p"
									>
										{getPopulationKilledInLastTurn(consequences)}
									</Typography>
									<Typography
										className={classes.label}
										variant="caption"
										component="p"
									>
										{__(`casualties`)}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography
										className={classes.amountDescription}
										variant="headline"
										component="p"
									>
										{getResourcesStolenInLastTurn(consequences)}
									</Typography>
									<Typography
										className={classes.label}
										variant="caption"
										component="p"
									>
										{__(`resources stolen`)}
									</Typography>
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
