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
	canBuildCottages,
	canBuildWalls,
} from 'game/actions/build';
import {
	// prettier-ignore
	getCottagesBuildCost,
	getCottagesLevel,
} from 'game/features/buildings/cottages';
import {
	// prettier-ignore
	getWallsBuildCost,
	getWallsLevel,
	getWallsReduction,
} from 'game/features/buildings/walls';
import { Game } from 'game/game';
import { connectToInjector } from 'lib/di';

import { styles } from './buildings-widget.styles';

export interface IBuildingsWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	game: Game;
	compact: boolean;
}

const diDecorator = connectToInjector<IBuildingsWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IBuildingsWidgetState {}

class BuildingsWidgetComponent extends React.Component<IBuildingsWidgetProps & WithStyles<typeof styles>, IBuildingsWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { disabled, classes, game, compact } = this.props;
		const currentState = game.getState();

		return (
			<Grid className={classes.root} container spacing={8}>
				<Grid item xs={12}>
					<Typography variant="display1" component="h3">
					Buildings:
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Wall lvl { getWallsLevel(currentState) }
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Build wall (current reduction: { getWallsReduction(currentState) }) (+30 enemy power reduction cost { getWallsBuildCost(currentState)(1) } resources)
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !canBuildWalls(currentState)(1)}
						onClick={this.buildWall}
					>
						Build wall { getWallsBuildCost(currentState)(1) } resources
					</Button>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Cottage lvl { getCottagesLevel(currentState) }
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Build cottage ({ getCottagesLevel(currentState) }) (+20 max population cost { getCottagesBuildCost(currentState)(1) } resources)
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !canBuildCottages(currentState)(1)}
						onClick={this.buildCottage}
					>
						Build cottage { getCottagesBuildCost(currentState)(1) } resources
					</Button>
				</Grid>
			</Grid>
		);
	}

	private buildWall = () => {
		const { game } = this.props;

		game.buildWalls(1);
	}

	private buildCottage = () => {
		const { game } = this.props;

		game.buildCottages(1);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(BuildingsWidgetComponent)));
