import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { GameEngine } from 'engine';
import { connectToInjector } from 'lib/di';

import { styles } from './buildings-widget.styles';

export interface IBuildingsWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	engine: GameEngine;
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
		const { classes, __, engine, compact } = this.props;
		const { disabled, homesCount, wallPower } = engine.getState();

		return (
			<Grid className={classes.root} container spacing={8}>
				<Grid item xs={12}>
					<Typography variant="display1" component="h3">
					Buildings:
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Wall lvl {wallPower / 30}
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Build wall (current reduction: { wallPower }) (+30 enemy power reduction cost { engine.wallCost() } resources)
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !engine.canBuildWall()}
						onClick={engine.buildWall}
					>
						Build wall { engine.wallCost() } resources
					</Button>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Cottage lvl {homesCount}
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Build cottage ({ homesCount }) (+20 max population cost { engine.homeCost() } resources)
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !engine.canBuildHome()}
						onClick={engine.buildHome}
					>
						Build cottage { engine.homeCost() } resources
					</Button>
				</Grid>
			</Grid>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(BuildingsWidgetComponent)));
