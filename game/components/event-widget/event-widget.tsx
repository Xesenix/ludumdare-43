import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { IGameState } from 'game';
import { getResourcesStolenInLastTurn } from 'game/models/resources/resources';
import {
	// prettier-ignore
	getAttackPower,
	getBaseAttackPower,
} from 'game/models/skills/attack';
import {
	// prettier-ignore
	getWeaknessDamageReduction,
	getWeaknessLevel,
} from 'game/models/skills/weakness';
import { getPopulationKilledInLastTurn } from 'game/models/units/population';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { getWallsLevel, getWallsReduction } from 'game/models/buildings/walls';
import { styles } from './event-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IEventWidgetExternalProps {
	consequences: IGameState;
	currentState: IGameState;
	event: string;
}

/** Internal component properties include properties injected via dependency injection. */
interface IEventWidgetInternalProps {
	__: II18nTranslation;
	di?: Container;
	store?: Store<any, any>;
}

/** Internal component state. */
interface IEventWidgetState {}

const diDecorator = connectToInjector<IEventWidgetExternalProps, IEventWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

type IEventWidgetProps = IEventWidgetExternalProps & IEventWidgetInternalProps & WithStyles<typeof styles>;

class EventWidgetComponent extends React.PureComponent<IEventWidgetProps, IEventWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const {
			// prettier-ignore
			__,
			classes,
			consequences,
			currentState,
		} = this.props;
		const {
			// prettier-ignore
			event,
			immunity,
		} = currentState;
		let description;

		if (immunity) {
			description = (
				<Paper className={classes.sacrifice}>
					<Typography
						// prettier-ignore
						className={classes.sacrificeTitle}
						component="p"
						variant="h4"
					>
						{__(`You have prevented attack with resource sacrifice.`)}
					</Typography>
				</Paper>
			);
		} else {
			description = (
				<Paper elevation={5}>
					<Typography
						// prettier-ignore
						className={classes.attackTitle}
						component="p"
						variant="h4"
					>
						{__(`%{event} attack power %{attackPower}`, {
							event,
							attackPower: Math.floor(getAttackPower(currentState)),
						})}
					</Typography>
					<Paper
						// prettier-ignore
						className={classes.attackContainer}
						elevation={0}
					>
						<Grid container>
							<Grid
								// prettier-ignore
								className={classes.powerContainer}
								item
								sm={4}
								xs={12}
							>
								<Typography
									// prettier-ignore
									className={classes.powerDescription}
									component="p"
									variant="subtitle1"
								>
									{__(`Original power %{baseAttackPower}`, {
										baseAttackPower: Math.floor(getBaseAttackPower(currentState)),
									})}
								</Typography>
								<Typography
									// prettier-ignore
									className={classes.powerDescription}
									component="span"
									variant="caption"
								>
									{__(`weakness lvl %{weaknessLvl} reduced it by %{weaknessDamageReduction}%`, {
										weaknessDamageReduction: (getWeaknessDamageReduction(currentState) * 100).toFixed(2),
										weaknessLvl: getWeaknessLevel(currentState),
									})}
								</Typography>
								<Typography
									// prettier-ignore
									className={classes.powerDescription}
									component="span"
									variant="caption"
								>
									{__(`wall lvl %{weaknessLvl} reduced it by %{wallsReduction}`, {
										wallsReduction: getWallsReduction(currentState),
										weaknessLvl: getWallsLevel(currentState),
									})}
								</Typography>
							</Grid>
							<Grid
								// prettier-ignore
								className={classes.consequencesContainer}
								container
								item
								xs={12}
								sm={8}
							>
								<Grid item xs={12}>
									<Typography
										// prettier-ignore
										className={classes.label}
										variant="h5"
										component="p"
									>
										{__(`Attack consequences`)}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography
										// prettier-ignore
										className={classes.amountDescription}
										component="p"
										variant="h5"
									>
										{getPopulationKilledInLastTurn(consequences)}
									</Typography>
									<Typography
										// prettier-ignore
										className={classes.label}
										component="p"
										variant="caption"
									>
										{__(`casualties`)}
									</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography
										// prettier-ignore
										className={classes.amountDescription}
										component="p"
										variant="h5"
									>
										{getResourcesStolenInLastTurn(consequences)}
									</Typography>
									<Typography
										// prettier-ignore
										className={classes.label}
										component="p"
										variant="caption"
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

export default hot(module)(withStyles(styles)(diDecorator(EventWidgetComponent)));
