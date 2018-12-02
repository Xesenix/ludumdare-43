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
import { styles } from './turn-details.styles';

export interface ITurnDetailsProps {
	di?: Container;
	store?: Store<any, any>;
	__: (key: string) => string;
	disabled: boolean;
	consequences: any;
}

const diDecorator = connectToInjector<ITurnDetailsProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface ITurnDetailsState {}

class TurnDetailsComponent extends React.Component<ITurnDetailsProps & WithStyles<typeof styles>, ITurnDetailsState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public render(): any {
		const { } = this.state;
		const { classes, __, consequences } = this.props;

		return (
			<Paper className={classes.root} elevation={1}>
				<Typography variant="headline" component="h2">
					Next turn result details
				</Typography>
				<Grid container spacing={8}>
					<Grid className={classes.item} item xs={3}>
						<Typography variant="subheading" component="h3">Villagers {consequences.population}</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(totall killed: {consequences.totallKilled})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(resources stolen: {consequences.resourcesStolen})</Typography>
					</Grid>
					<Grid className={classes.item} item xs={3}>
						<Typography variant="subheading" component="h3">Workers {consequences.workers}</Typography>
						<Typography className={classes.positive} variant="caption" component="p">(trained: {consequences.trainedWorkers})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(sacrificed: {consequences.sacrificedWorkers})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.workersKilled})</Typography>
					</Grid>
					<Grid className={classes.item} item xs={3}>
						<Typography variant="subheading" component="h3">Guards {consequences.guards}</Typography>
						<Typography className={classes.positive} variant="caption" component="p">(trained: {consequences.trainedGuards})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(sacrificed: {consequences.sacrificedGuards})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.guardsKilled})</Typography>
					</Grid>
					<Grid className={classes.item} item xs={3}>
						<Typography variant="subheading" component="h3">Idle {consequences.idle}</Typography>
						<Typography className={classes.positive} variant="caption" component="p">(new adults: {consequences.newAdults})</Typography>
						<Typography className={classes.positive} variant="caption" component="p">(retrained: {consequences.trainedWorkers + consequences.trainedGuards})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(sacrificed: {consequences.sacrificedIdle})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.idleKilled})</Typography>
					</Grid>
					<Grid className={classes.item} item xs={3}>
						<Typography variant="subheading" component="h3">Children {consequences.babies}</Typography>
						<Typography className={classes.positive} variant="caption" component="p">(born: {consequences.newChildren})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(sacrificed: {consequences.sacrificedChildren})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.babiesKilled})</Typography>
					</Grid>
					<Grid className={classes.item} item xs={3}>
						<Typography variant="subheading" component="h3">Resources {consequences.resources}</Typography>
						<Typography className={classes.positive} variant="caption" component="p">(gathered: {consequences.resourceGathered})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(guard salary: {consequences.guardsPaid})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(sacrificed: {consequences.sacrificedResources})</Typography>
						<Typography className={classes.negative} variant="caption" component="p">(stolen: {consequences.resourcesStolen})</Typography>
					</Grid>
				</Grid>
			</Paper>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(TurnDetailsComponent)));
