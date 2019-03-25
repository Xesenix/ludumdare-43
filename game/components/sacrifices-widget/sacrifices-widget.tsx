import { withStyles, WithStyles } from '@material-ui/core/styles';
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
export interface ISacrificesWidgetProps {
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

const diDecorator = connectToInjector<ISacrificesWidgetProps, ISacrificesWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	game: {
		dependencies: ['game'],
	},
});

/** Internal component state. */
interface ISacrificesWidgetState {}

class SacrificesWidgetComponent extends React.Component<ISacrificesWidgetProps & ISacrificesWidgetInternalProps & WithStyles<typeof styles>, ISacrificesWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const {
			__,
			classes,
			compact,
			disabled,
			game,
		} = this.props;
		const currentState = game.getState();

		const turn = currentState.turn;
		const sacrificeCount = getSacrificeCount(currentState);
		const populationCost = getSacrificePopulationCost(currentState);
		const resourceCost = getSacrificeResourcesCost(currentState);
		const futureResourceCost = getSacrificeResourcesCost({ ...currentState, turn: turn + 1 });
		const weaknessLevel = getWeaknessLevel(currentState);
		const nextLevelWeaknessReduction = (getWeaknessDamageReduction(changeAmountOfWeaknessLevel(1)(currentState)) * 100).toFixed(2);
		const powerReduction = (getWeaknessDamageReduction(currentState) * 100).toFixed(2);
		const perLevelWeaknessReduction = (getWeaknessPerLevelReduction(currentState) * 100).toFixed(2);

		return (
			<Grid className={classes.root} container spacing={8}>
				<Grid item xs={12}>
					<Typography variant="display1" component="h3">
						{__(`Sacrifices made %{count}`, { count: sacrificeCount })}:
					</Typography>
					{ compact ? null : (
						<Typography
							variant="caption"
							component="p"
							dangerouslySetInnerHTML={{
								__html: __(`Each sacrifice made increases cost of next sacrifices by&nbsp;<strong>5</strong> every turn increases cost by&nbsp;<strong>1</strong>
and every 5th by additional&nbsp;<strong>5</strong>.<br/>
Next turn cost will increase to&nbsp;<strong>%{futureResourceCost}</strong>`, {
									futureResourceCost,
								}),
							}}
						/>
					)}
				</Grid>
				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						{__(`Immunity`)}
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							{__(`Make sacrifice for one turn immunity (%{resourceCost}&nbsp;resources). Enemies will ignore you in this year.`, {
								resourceCost,
							})}
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !canSacraficeForImmunity(currentState)}
						onClick={game.sacrificeResourcesForImmunityAction}
						size="small"
					>
						{__(`Sacrifice %{resourceCost}&nbsp;resources`, { resourceCost })}
					</Button>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						{__(`Weakness lvl %{weaknessLevel}`, { weaknessLevel })}
					</Typography>
					{ compact ? null : (
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
						variant="raised"
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
}

export default hot(module)(withStyles(styles)(diDecorator(SacrificesWidgetComponent)));
