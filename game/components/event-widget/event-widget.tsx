import * as React from 'react';
import { hot } from 'react-hot-loader';

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
import { useStyles } from './event-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IEventWidgetExternalProps {
	consequences: IGameState;
	currentState: IGameState;
}

/** Internal component properties include properties injected via dependency injection. */
interface IEventWidgetInternalProps {
	__: II18nTranslation;
}

type IEventWidgetProps = IEventWidgetExternalProps & IEventWidgetInternalProps;

const diDecorator = connectToInjector<IEventWidgetExternalProps, IEventWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function EventWidgetComponent(props: IEventWidgetProps): any {
	const {
		// prettier-ignore
		__,
		consequences,
		currentState,
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

	return description;
}

export default hot(module)(diDecorator(EventWidgetComponent));
