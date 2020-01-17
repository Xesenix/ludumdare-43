import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { CottagesSystem } from 'game/systems/cottages';
import { WallsSystem } from 'game/systems/walls';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { useStyles } from './buildings-widget.styles';

/** Component public properties required to be provided by parent component. */
export interface IBuildingsWidgetExternalProps {
	disabled: boolean;
	compact: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IBuildingsWidgetInternalProps {
	__: II18nTranslation;
	cottages: CottagesSystem;
	walls: WallsSystem;
	di?: Container;
	store?: Store<any, any>;
}

type IBuildingsWidgetProps = IBuildingsWidgetExternalProps & IBuildingsWidgetInternalProps;

const diDecorator = connectToInjector<IBuildingsWidgetExternalProps, IBuildingsWidgetInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	cottages: {
		dependencies: ['game:system:cottages'],
	},
	walls: {
		dependencies: ['game:system:walls'],
	},
});

function BuildingsWidgetComponent(props: IBuildingsWidgetProps) {
	const {
		// prettier-ignore
		__,
		compact,
		disabled,
		cottages,
		walls,
	} = props;

	const classes = useStyles();

	const buildWall = React.useCallback(() => {
		walls.commitBuild();
	}, [walls]);

	const buildCottage = React.useCallback(() => {
		cottages.commitBuild();
	}, [cottages]);

	const cottagesBuildCost = cottages.getBuildCost();
	const cottagesLevel = cottages.getLevel();
	const wallLevel = walls.getLevel();
	const wallsBuildCost = walls.getBuildCost();
	const wallsReduction = walls.getWallsReduction();

	return (
		<Grid className={classes.root} container spacing={8}>
			<Grid item xs={12}>
				<Typography component="h3" variant="h4">
					{__(`Buildings`)}:
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography component="h4" variant="h6">
					{__(`Wall lvl %{wallLevel}`, { wallLevel })}
				</Typography>
				{compact ? null : (
					<Typography component="p" variant="caption">
						{__(`Build wall (current reduction: %{wallsReduction}) (+30 enemy power reduction cost %{wallsBuildCost} resources)`, {
							wallsReduction,
							wallsBuildCost,
						})}
					</Typography>
				)}
				<Button
					// prettier-ignore
					color="secondary"
					disabled={disabled || !walls.canBuild(1)}
					onClick={buildWall}
					variant="contained"
				>
					{__(`Build wall %{wallsBuildCost} resources`, { wallsBuildCost })}
				</Button>
			</Grid>

			<Grid item xs={12}>
				<Typography component="h4" variant="h6">
					{__(`Cottage lvl %{cottagesLevel}`, { cottagesLevel })}
				</Typography>
				{compact ? null : (
					<Typography component="p" variant="caption">
						{__(`Build cottage (%{cottagesLevel}) (+20 max population cost %{cottagesBuildCost} resources)`, {
							cottagesLevel,
							cottagesBuildCost,
						})}
					</Typography>
				)}
				<Button
					// prettier-ignore
					color="secondary"
					disabled={disabled || !cottages.canBuild(1)}
					onClick={buildCottage}
					variant="contained"
				>
					{__(`Build cottage %{cottagesBuildCost} resources`, { cottagesBuildCost })}
				</Button>
			</Grid>
		</Grid>
	);
}

export default hot(module)(diDecorator(BuildingsWidgetComponent));
