import { withStyles, WithStyles } from '@material-ui/core/styles';
import produce from 'immer';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {
	// prettier-ignore
	canSacraficeForEnemiesWeakness,
	canSacraficeForImmunity,
} from 'game/actions/sacrifice';
import {
	// prettier-ignore
	getSacrificeCount,
	getSacrificePopulationCost,
	getSacrificeResourcesCost,
} from 'game/features/skills/sacrifice';
import {
	// prettier-ignore
	changeAmountOfWeaknessLevel,
	getWeaknessDamageReduction,
	getWeaknessLevel,
	getWeaknessPerLevelReduction,
} from 'game/features/skills/weakness';
import { Game } from 'game/game';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './sacrifices-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface ISacrificesWidgetExternalProps {
	compact: boolean;
	disabled: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface ISacrificesWidgetInternalProps {
	__: II18nTranslation;
	di?: Container;
	game: Game;
	store?: Store<any, any>;
}

type ISacrificesWidgetProps = ISacrificesWidgetExternalProps & ISacrificesWidgetInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<ISacrificesWidgetProps, ISacrificesWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	game: {
		dependencies: ['game'],
	},
});

function SacrificesWidgetComponent(props: ISacrificesWidgetProps) {
	const {
		// prettier-ignore
		__,
		classes,
		compact,
		disabled,
		game,
	} = props;
	const currentState = game.getState();

	const turn = currentState.turn;
	const futureResourceCost = getSacrificeResourcesCost({ ...currentState, turn: turn + 1 });
	const nextLevelWeaknessReduction = (getWeaknessDamageReduction(produce(currentState, changeAmountOfWeaknessLevel(1))) * 100).toFixed(2);
	const perLevelWeaknessReduction = (getWeaknessPerLevelReduction(currentState) * 100).toFixed(2);
	const populationCost = getSacrificePopulationCost(currentState);
	const powerReduction = (getWeaknessDamageReduction(currentState) * 100).toFixed(2);
	const resourceCost = getSacrificeResourcesCost(currentState);
	const sacrificeCount = getSacrificeCount(currentState);
	const weaknessLevel = getWeaknessLevel(currentState);

	return (
		<Grid className={classes.root} container spacing={8}>
			<Grid item xs={12}>
				<Typography variant="h4" component="h3">
					{__(`Sacrifices made %{count}`, { count: sacrificeCount })}:
				</Typography>
				{compact ? null : (
					<Typography
						variant="caption"
						component="p"
						dangerouslySetInnerHTML={{
							__html: __(
								// prettier-ignore
								`Each sacrifice made increases cost of next sacrifices by&nbsp;<strong>5</strong> every turn increases cost by&nbsp;<strong>1</strong>
and every 5th by additional&nbsp;<strong>5</strong>.<br/>
Next turn cost will increase to&nbsp;<strong>%{futureResourceCost}</strong>`,
								{
									futureResourceCost,
								},
							),
						}}
					/>
				)}
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h6" component="h4">
					{__(`Immunity`)}
				</Typography>
				{compact ? null : (
					<Typography variant="caption" component="p">
						{__(`Make sacrifice for one turn immunity (%{resourceCost}&nbsp;resources). Enemies will ignore you in this year.`, {
							resourceCost,
						})}
					</Typography>
				)}
				<Button
					// prettier-ignore
					color="secondary"
					variant="contained"
					disabled={disabled || !canSacraficeForImmunity(currentState)}
					onClick={game.sacrificeResourcesForImmunityAction}
					size="small"
				>
					{__(`Sacrifice %{resourceCost}&nbsp;resources`, { resourceCost })}
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Typography variant="h6" component="h4">
					{__(`Weakness lvl %{weaknessLevel}`, { weaknessLevel })}
				</Typography>
				{compact ? null : (
					<Typography
						variant="caption"
						component="p"
						dangerouslySetInnerHTML={{
							__html: __(`This sacrifice permanently weakness enemies by -%{perLevelWeaknessReduction}% multiplicative for every level.`, {
								perLevelWeaknessReduction,
							}),
						}}
					/>
				)}
				<Typography
					variant="caption"
					component="p"
					dangerouslySetInnerHTML={{
						__html: __(`Current enemy power reduction <strong>%{powerReduction}%</strong>`, {
							powerReduction,
						}),
					}}
				/>
				<Button
					color="secondary"
					variant="contained"
					disabled={disabled || !canSacraficeForEnemiesWeakness(currentState)}
					onClick={game.sacrificeIdlesForEnemiesWeaknessAction}
					size="small"
				>
					{__(`Sacrifice %{populationCost}&nbsp;idle population (next level %{nextLevelWeaknessReduction}%)`, {
						nextLevelWeaknessReduction,
						populationCost,
					})}
				</Button>
			</Grid>
		</Grid>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(SacrificesWidgetComponent)));
