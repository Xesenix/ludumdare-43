import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Game } from 'game/game';
import { StatsSystem } from 'game/systems/stats';
import { WeaknessSystem } from 'game/systems/weakness';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { useStyles } from './sacrifices-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface ISacrificesWidgetExternalProps {
	compact: boolean;
	disabled: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface ISacrificesWidgetInternalProps {
	__: II18nTranslation;
	game: Game;
	stats: StatsSystem;
	weakness: WeaknessSystem;
}

type ISacrificesWidgetProps = ISacrificesWidgetExternalProps & ISacrificesWidgetInternalProps;

const diDecorator = connectToInjector<ISacrificesWidgetExternalProps, ISacrificesWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	game: {
		dependencies: ['game'],
	},
	stats: {
		dependencies: ['game:system:statistics'],
	},
	weakness: {
		dependencies: ['game:system:weakness'],
	},
});

function SacrificesWidgetComponent(props: ISacrificesWidgetProps) {
	const {
		// prettier-ignore
		__,
		compact,
		disabled,
		game,
		stats,
		weakness,
	} = props;

	const classes = useStyles();

	const currentState = game.getState();

	const futureResourceCost = weakness.getNextLevelResourceCost();
	const nextLevelWeaknessReduction = (weakness.getNextLevelDamageReduction() * 100).toFixed(2);
	const perLevelWeaknessReduction = (weakness.getPerLevelReduction() * 100).toFixed(2);
	const populationCost = weakness.getPopulationCost(currentState);
	const powerReduction = (weakness.getDamageReduction() * 100).toFixed(2);
	const sacrificeCount = stats.getSacrificeCount(currentState);
	const weaknessLevel = weakness.getLevel();

	return (
		<Grid className={classes.root} container spacing={8}>
			<Grid item xs={12}>
				<Typography component="h3" variant="h4">
					{__(`Sacrifices made %{count}`, { count: sacrificeCount })}:
				</Typography>
				{compact ? null : (
					<Typography
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
						variant="caption"
					/>
				)}
			</Grid>

			<Grid item xs={12}>
				<Typography component="h4" variant="h6">
					{__(`Weakness lvl %{weaknessLevel}`, { weaknessLevel })}
				</Typography>
				{compact ? null : (
					<Typography
						component="p"
						dangerouslySetInnerHTML={{
							__html: __(`This sacrifice permanently weakness enemies by -%{perLevelWeaknessReduction}% multiplicative for every level.`, {
								perLevelWeaknessReduction,
							}),
						}}
						variant="caption"
					/>
				)}
				<Typography
					component="p"
					dangerouslySetInnerHTML={{
						__html: __(`Current enemy power reduction <strong>%{powerReduction}%</strong>`, {
							powerReduction,
						}),
					}}
					variant="caption"
				/>
				<Button
					color="secondary"
					disabled={disabled || !weakness.canLevelUp()}
					onClick={game.levelUpWeaknessAction}
					size="small"
					variant="contained"
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

export default hot(module)(diDecorator(SacrificesWidgetComponent));
