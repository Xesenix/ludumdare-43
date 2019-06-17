import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Game } from 'game';
import {
	// prettier-ignore
	getCottagesBuildCost,
	getCottagesLevel,
} from 'game/models/buildings/cottages';
import {
	// prettier-ignore
	getWallsBuildCost,
	getWallsLevel,
	getWallsReduction,
} from 'game/models/buildings/walls';
import {
	// prettier-ignore
	canBuildCottages,
	canBuildWalls,
} from 'game/systems/build';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { styles } from './buildings-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IBuildingsWidgetExternalProps {
	disabled: boolean;
	compact: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IBuildingsWidgetInternalProps {
	__: II18nTranslation;
	di?: Container;
	game: Game;
	store?: Store<any, any>;
}

type IBuildingsWidgetProps = IBuildingsWidgetExternalProps & IBuildingsWidgetInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IBuildingsWidgetExternalProps, IBuildingsWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	game: {
		dependencies: ['game'],
	},
});

function BuildingsWidgetComponent(props: IBuildingsWidgetProps) {
	const {
		// prettier-ignore
		__,
		classes,
		compact,
		disabled,
		game,
	} = props;

	const buildWall = React.useCallback(() => {
		game.buildWalls(1);
	}, [game]);

	const buildCottage = React.useCallback(() => {
		game.buildCottages(1);
	}, [game]);

	const currentState = game.getState();
	const cottagesBuildCost = getCottagesBuildCost(currentState)(1);
	const cottagesLevel = getCottagesLevel(currentState);
	const wallLevel = getWallsLevel(currentState);
	const wallsBuildCost = getWallsBuildCost(currentState)(1);
	const wallsReduction = getWallsReduction(currentState);

	return (
		<Grid className={classes.root} container spacing={8}>
			<Grid item xs={12}>
				<Typography variant="h4" component="h3">
					{__(`Buildings`)}:
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h6" component="h4">
					{__(`Wall lvl %{wallLevel}`, { wallLevel })}
				</Typography>
				{compact ? null : (
					<Typography variant="caption" component="p">
						{__(`Build wall (current reduction: %{wallsReduction}) (+30 enemy power reduction cost %{wallsBuildCost} resources)`, {
							wallsReduction,
							wallsBuildCost,
						})}
					</Typography>
				)}
				<Button
					// prettier-ignore
					color="secondary"
					variant="contained"
					disabled={disabled || !canBuildWalls(currentState)(1)}
					onClick={buildWall}
				>
					{__(`Build wall %{wallsBuildCost} resources`, { wallsBuildCost })}
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Typography variant="h6" component="h4">
					{__(`Cottage lvl %{cottagesLevel}`, { cottagesLevel })}
				</Typography>
				{compact ? null : (
					<Typography variant="caption" component="p">
						{__(`Build cottage (%{cottagesLevel}) (+20 max population cost %{cottagesBuildCost} resources)`, {
							cottagesLevel,
							cottagesBuildCost,
						})}
					</Typography>
				)}
				<Button
					// prettier-ignore
					color="secondary"
					variant="contained"
					disabled={disabled || !canBuildCottages(currentState)(1)}
					onClick={buildCottage}
				>
					{__(`Build cottage %{cottagesBuildCost} resources`, { cottagesBuildCost })}
				</Button>
			</Grid>
		</Grid>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(BuildingsWidgetComponent)));
