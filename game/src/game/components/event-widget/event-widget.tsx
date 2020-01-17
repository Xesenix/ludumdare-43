import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { IGameState } from 'game';
import { BattleSystem } from 'game/systems/battle';
import { StatsSystem } from 'game/systems/stats';
import { WallsSystem } from 'game/systems/walls';
import { WeaknessSystem } from 'game/systems/weakness';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { useStyles } from './event-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IEventWidgetExternalProps {
	consequences: IGameState;
	currentState: IGameState;
}

/** Internal component properties include properties injected via dependency injection. */
interface IEventWidgetInternalProps {
	__: II18nTranslation;
	battle: BattleSystem;
	statistics: StatsSystem;
	walls: WallsSystem;
	weakness: WeaknessSystem;
}

type IEventWidgetProps = IEventWidgetExternalProps & IEventWidgetInternalProps;

const diDecorator = connectToInjector<IEventWidgetExternalProps, IEventWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	battle: {
		dependencies: ['game:system:battle'],
	},
	statistics: {
		dependencies: ['game:system:statistics'],
	},
	walls: {
		dependencies: ['game:system:walls'],
	},
	weakness: {
		dependencies: ['game:system:weakness'],
	},
});

function EventWidgetComponent(props: IEventWidgetProps): any {
	const {
		// prettier-ignore
		__,
		consequences,
		currentState,
		walls,
		weakness,
		statistics,
		battle,
	} = props;

	const classes = useStyles();

	const {
		// prettier-ignore
		event,
	} = currentState;
	let description;

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
					attackPower: Math.floor(battle.getAttackPower(currentState)),
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
								baseAttackPower: Math.floor(battle.getBaseAttackPower(currentState)),
							})}
						</Typography>
						<Typography
							// prettier-ignore
							className={classes.powerDescription}
							component="span"
							variant="caption"
						>
							{__(`weakness lvl %{weaknessLvl} reduced it by %{weaknessDamageReduction}%`, {
								weaknessDamageReduction: (weakness.getDamageReduction() * 100).toFixed(2),
								weaknessLvl: weakness.getLevel(),
							})}
						</Typography>
						<Typography
							// prettier-ignore
							className={classes.powerDescription}
							component="span"
							variant="caption"
						>
							{__(`wall lvl %{weaknessLvl} reduced it by %{wallsReduction}`, {
								wallsReduction: walls.getWallsReduction(),
								weaknessLvl: walls.getLevel(),
							})}
						</Typography>
					</Grid>
					<Grid
						// prettier-ignore
						className={classes.consequencesContainer}
						container
						item
						sm={8}
						xs={12}
					>
						<Grid item xs={12}>
							<Typography
								// prettier-ignore
								className={classes.label}
								component="p"
								variant="h5"
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
								{statistics.getPopulationKilledInLastTurn(consequences)}
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
								{statistics.getResourcesStolenInLastTurn(consequences)}
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

	return description;
}

export default hot(module)(diDecorator(EventWidgetComponent));
