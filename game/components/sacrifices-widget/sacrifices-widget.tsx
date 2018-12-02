import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// icons
import ConfigIcon from '@material-ui/icons/Build';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import MenuIcon from '@material-ui/icons/Menu';
import PausedIcon from '@material-ui/icons/PauseCircleFilled';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import BackIcon from '@material-ui/icons/Undo';
import MuteOnIcon from '@material-ui/icons/VolumeOff';
import MuteOffIcon from '@material-ui/icons/VolumeUp';

import { connectToInjector } from 'lib/di';

import { GameEngine } from '../../src/engine';
import { styles } from './sacrifices-widget.styles';

export interface ISacrificesWidgetProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	engine: GameEngine;
	compact: boolean;
}

const diDecorator = connectToInjector<ISacrificesWidgetProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface ISacrificesWidgetState {}

class SacrificesWidgetComponent extends React.Component<ISacrificesWidgetProps & WithStyles<typeof styles>, ISacrificesWidgetState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, __, engine, compact } = this.props;
		const { disabled, turn, weakness, weaknessReduction, sacrificeCost, sacrificeCount } = engine.getState();

		return (
			<Grid className={classes.root} container spacing={8}>
				<Grid item xs={12}>
					<Typography variant="display1" component="h3">
						Sacrifices made {sacrificeCount}:
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Each sacrifice made increases cost of next sacrifices by&nbsp;<strong>5</strong> every turn increases cost by&nbsp;<strong>1</strong>
							and every 5th by additional&nbsp;<strong>5</strong>.<br/>
							Next turn cost will increase to&nbsp;<strong>{engine.getSacrificeCost({ turn: turn + 1, sacrificeCount })}</strong>
						</Typography>
					)}
				</Grid>
				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Immunity
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Make sacrifice for one turn immunity ({ sacrificeCost }&nbsp;resources). Enemies will ignore you in this year.
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !engine.canMakeSacrificeForImmunity()}
						onClick={engine.sacrificeResourcesForImmunity}
						size="small"
					>
						Sacrafice { sacrificeCost }&nbsp;resources
					</Button>
				</Grid>

				<Grid item xs={12}>
					<Typography variant="title" component="h4">
						Weakness
					</Typography>
					{ compact ? null : (
						<Typography variant="caption" component="p">
							Make sacrifice for permament enemy weakness -{(weaknessReduction * 100).toFixed(2)}% multiplicative ({ sacrificeCost }&nbsp;idle population)
							Current reduction <strong>{engine.getWeaknessDamageReduction({ weaknessReduction, weakness })}%</strong>
						</Typography>
					)}
					<Button
						color="secondary"
						variant="raised"
						disabled={disabled || !engine.canMakeSacrificeForWeakness()}
						onClick={engine.sacrificeResourcesForEnemyWeakness}
						size="small"
					>
						Sacrafice { sacrificeCost }&nbsp;idle population (next level {engine.getWeaknessDamageReduction({ weaknessReduction, weakness: weakness + 1 })}%)
					</Button>
				</Grid>
			</Grid>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(SacrificesWidgetComponent)));
