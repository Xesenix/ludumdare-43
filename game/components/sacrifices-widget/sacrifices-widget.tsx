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
	getSacrificePopulationCost,
	getSacrificeResourcesCost,
} from 'game/features/skills/sacrifice';
import {
	// prettier-ignore
	changeAmountOfWeaknessLevel,
	getWeaknessDamageReduction,
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
		const { classes, game, compact, disabled } = this.props;
		const currentState = game.getState();
		const { turn, weakness, sacrifice } = currentState;

		return (
			<Grid className={classes.root} container spacing={8}>
				<Grid item xs={12}>
					<Typography variant="display1" component="h3">
						Sacrifices made {sacrifice.count}:
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Each sacrifice made increases cost of next sacrifices by&nbsp;<strong>5</strong> every turn increases cost by&nbsp;<strong>1</strong>
							and every 5th by additional&nbsp;<strong>5</strong>.<br/>
							Next turn cost will increase to&nbsp;<strong>{ getSacrificeResourcesCost({ ...currentState, turn: turn + 1 }) }</strong>
						</Typography>
					)}
				</Grid>
				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Immunity
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Make sacrifice for one turn immunity ({ getSacrificeResourcesCost(currentState) }&nbsp;resources). Enemies will ignore you in this year.
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !canSacraficeForImmunity(currentState)}
						onClick={game.sacrificeResourcesForImmunityAction}
						size="small"
					>
						Sacrifice { getSacrificeResourcesCost(currentState) }&nbsp;resources
					</Button>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Weakness lvl {weakness.level}
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							This sacrifice permanently weakness enemies by -{(currentState.weakness.perLevelReduction * 100).toFixed(2)}% multiplicative for every level.
						</Typography>
					)}
					<Typography variant="caption" component="p">
						Current enemy power reduction <strong>{(getWeaknessDamageReduction(currentState) * 100).toFixed(2)}%</strong>
					</Typography>
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !canSacraficeForEnemiesWeakness(currentState)}
						onClick={game.sacrificeIdlesForEnemiesWeaknessAction}
						size="small"
					>
						Sacrifice {getSacrificePopulationCost(currentState)}&nbsp;idle population (next level {(getWeaknessDamageReduction(changeAmountOfWeaknessLevel(1)(currentState)) * 100).toFixed(2)}%)
					</Button>
				</Grid>
			</Grid>
		);
	}
}

export default hot(module)(withStyles(styles)(diDecorator(SacrificesWidgetComponent)));
