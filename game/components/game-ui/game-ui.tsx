import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EventEmitter } from 'events';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import AppBar from '@material-ui/core/AppBar';
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
import { IUIState } from 'lib/ui';

import { GameEngine } from '../../src/engine';

import { styles } from './game-ui.styles';

export interface IGameUIProps {
	di?: Container;
	em?: EventEmitter;
	store?: Store<any, any>;
	__: (key: string) => string;
}

const diDecorator = connectToInjector<IGameUIProps>({
	store: {
		dependencies: ['data-store'],
	},
	em: {
		dependencies: ['event-manager'],
	},
	__: {
		dependencies: ['i18n:translate'],
	},
});

export interface IGameUIState {
	people: number;
	maxPopulation: number;
	babies: number;
	trainedWorkers: number;
	workers: number;
	trainedGuards: number;
	guards: number;
	idle: number;
	turn: number;
	resources: number;
	event: 'sacrafice' | 'orcs';
	sacrafice: 'babies' | 'idle' | 'workers' | 'resources' | 'guards';
	weakness: number;
	immunity: boolean;
	attackPower: number;
	sacraficeCost: number;
	sacraficeCount: number;
	blockNextTurn: boolean;
	wallPower: number;
	homesCount: number;
}

class GameUIComponent extends React.PureComponent<IGameUIProps & WithStyles<typeof styles>, IGameUIState & IUIState> {
	private unsubscribe?: any;
	private initialState = {
		idleKilled: 0,
		workersKilled: 0,
		babiesKilled: 0,
		guardsKilled: 0,
		resourcesStolen: 0,
		totallKilled: 0,
		sacraficedResources: 0,
		sacraficedChildren: 0,
		sacraficedIdle: 0,
		sacraficedGuards: 0,
		sacraficedWorkers: 0,
		people: 20,
		maxPopulation: 40,
		idle: 20,
		babies: 0,
		trainedWorkers: 0,
		workers: 0,
		trainedGuards: 0,
		guards: 0,
		turn: 0,
		resources: 0,
		blockNextTurn: false,
		event: 'orcs',
		weakness: 0,
		attackPower: 2,
		sacraficeCost: 1,
		sacraficeCount: 0,
		wallPower: 0,
		homesCount: 0,
		immunity: false,
	};

	private engine: GameEngine;

	constructor(props) {
		super(props);
		this.state = this.initialState;
		this.engine = new GameEngine(this.initialState, () => this.state, (data) => this.setState(data));
	}

	public componentDidMount(): void {
		this.bindToStore();
		this.bindToEventManager();
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public componentWillUnmount(): void {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	public render(): any {
		const { classes, __, em } = this.props;
		const {
			people = 0,
			babies = 0,
			trainedWorkers = 0,
			workers = 0,
			idle = 0,
			trainedGuards = 0,
			guards = 0,
			turn = 0,
			resources = 0,
			blockNextTurn = false,
			event = '',
			sacraficeCost = 0,
			attackPower = 0,
			wallPower = 0,
			homesCount = 0,
			weakness = 0,
		} = this.state;
		const consequences = this.engine.calculateConsequences();

		return people ? (<Paper className={classes.root} elevation={2}>
				<Grid container spacing={0} alignItems="center">
					<Grid item xs={12}>
						<Typography variant="display1" component="h1">
							Years survived: {turn}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="headline" component="h2">
							Units
						</Typography>
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Villagers {people} / {this.engine.getMaxPopulation()}
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Workers {workers} ({trainedWorkers})
						<Typography variant="caption" component="p">(generates 1 resources)</Typography>
						<Typography variant="caption" component="p">(new workers will start gathering resources in next year)</Typography>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.engine.canTrainMoreWorkers()}
							onClick={this.engine.scheduleWorkerTraining}
						>
							+
						</Button>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.engine.canRealeseMoreWorkers()}
							onClick={this.engine.releaseWorker}
						>
							-
						</Button>
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Guards {guards} ({trainedGuards})
						<Typography variant="caption" component="p">
							(1 guard dies instead of any other 2 units that would be killed in fight)
							(requires 1 resource per turn or will be demoted to idle)
						</Typography>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.engine.canTrainMoreGuards()}
							onClick={this.engine.scheduleGuardsTraining}
						>
							+
						</Button>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.engine.canRealeseMoreGuards()}
							onClick={this.engine.releaseGuard}
						>
							-
						</Button>
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Idle {idle}
						<Typography variant="caption" component="p">(gives +1 villager per 2 idle persons)</Typography>
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Babies {babies}
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Resources {resources}
					</Grid>
					<Grid item xs={12}>
						<Paper className={classes.actionbar} elevation={2}>
							<Typography variant="headline" component="h3">
								Next turn consequences
							</Typography>
							<Grid className={classes.consequences} container spacing={0} alignItems="center">
								<Grid className={classes.resource} item xs={12}>
									<Typography variant="headline" component="h3">Event</Typography>
									<Typography variant="subheading" component="p">{event} power {consequences.attackPower} (weakness reduced it by { ((1 - Math.pow(0.5, weakness)) * 100).toFixed(2) }% wall reduced it by {wallPower})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.totallKilled})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(stolen: {consequences.resourcesStolen})</Typography>
								</Grid>
								<Grid className={classes.resource} item xs={3}>
									Villagers {consequences.people}
								</Grid>
								<Grid className={classes.resource} item xs={3}>
									Workers {consequences.workers}
									<Typography className={classes.positive} variant="caption" component="p">(trained: {consequences.trainedWorkers})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(sacraficed: {consequences.sacraficedWorkers})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.workersKilled})</Typography>
								</Grid>
								<Grid className={classes.resource} item xs={3}>
									Guards {consequences.guards}
									<Typography className={classes.positive} variant="caption" component="p">(trained: {consequences.trainedGuards})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(sacraficed: {consequences.sacraficedGuards})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.guardsKilled})</Typography>
								</Grid>
								<Grid className={classes.resource} item xs={3}>
									Idle {consequences.idle}
									<Typography className={classes.positive} variant="caption" component="p">(new adult: {consequences.newAdults})</Typography>
									<Typography className={classes.positive} variant="caption" component="p">(retrained: {consequences.trainedWorkers + consequences.trainedGuards})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(sacraficed: {consequences.sacraficedIdle})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.idleKilled})</Typography>
								</Grid>
								<Grid className={classes.resource} item xs={3}>
									Babies {consequences.babies}
									<Typography className={classes.positive} variant="caption" component="p">(born: {consequences.newChildren})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(sacraficed: {consequences.sacraficedChildren})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(killed: {consequences.babiesKilled})</Typography>
								</Grid>
								<Grid className={classes.resource} item xs={3}>
									Resources {consequences.resources}
									<Typography className={classes.positive} variant="caption" component="p">(gathered: {consequences.resourceGathered})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(guard salary: {consequences.guardsPaid})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(sacraficed: {consequences.sacraficedResources})</Typography>
									<Typography className={classes.negative} variant="caption" component="p">(stolen: {consequences.resourcesStolen})</Typography>
								</Grid>
							</Grid>
							<Button
								color="secondary"
								variant="extendedFab"
								disabled={blockNextTurn || !this.engine.canMakeSacraficeForImmunity()}
								onClick={this.engine.sacraficeResourcesForImmunity}
							>
								Make sacrafice for one turn immunity ({ sacraficeCost } resources)
							</Button>
							<Button
								color="secondary"
								variant="extendedFab"
								disabled={blockNextTurn || !this.engine.canMakeSacraficeForWeakness()}
								onClick={this.engine.sacraficeResourcesForEnemyWeakness}
							>
								Make sacrafice for permament enemy weakness -50% multiplicative ({ sacraficeCost } idle)
							</Button>
							<Button
								color="primary"
								variant="extendedFab"
								disabled={blockNextTurn}
								onClick={this.progressToNextTurn}
							>
								{ event !== 'sacrafice' ? 'Defend yourself' : 'Continuue' }
							</Button>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						<Paper className={classes.box}>
							<Typography variant="headline" component="h2">
								Buildings
							</Typography>
							<Button
								color="secondary"
								variant="extendedFab"
								disabled={blockNextTurn || !this.engine.canBuildWall()}
								onClick={this.engine.buildWall}
							>
								Build wall (current reduction: { wallPower }) (+30 enemy power reduction cost { this.engine.wallCost() } resources)
							</Button>
							<Button
								color="secondary"
								variant="extendedFab"
								disabled={blockNextTurn || !this.engine.canBuildHome()}
								onClick={this.engine.buildHome}
							>
								Build home ({ homesCount }) (+20 max population cost { this.engine.homeCost() } resources)
							</Button>
						</Paper>
					</Grid>
					<Grid className={classes.resource} item xs={12}>
						<Button
							color="secondary"
							variant="extendedFab"
							disabled={blockNextTurn}
							onClick={this.engine.reset}
						>
							Restart
						</Button>
					</Grid>
				</Grid>
			</Paper>
		) : (<Paper className={classes.root} elevation={2}>
			<Grid container spacing={0} alignItems="center">
				<Grid item xs={12}>
					<Typography variant="display1" component="h1">
						Your village perished after {turn} years
					</Typography>
				</Grid>
			</Grid>
			<Grid className={classes.resource} item xs={12}>
				<Button
					color="secondary"
					variant="extendedFab"
					disabled={blockNextTurn}
					onClick={this.engine.reset}
				>
					Restart
				</Button>
			</Grid>
		</Paper>);
	}

	private progressToNextTurn = () => {
		const { em } = this.props;
		em.emit('mode:change', 'action');

		this.setState(this.engine.calculateConsequences(), this.engine.startNewTurn);

		setTimeout(this.waitForDecisions, 5000);
	}

	private waitForDecisions = () => {
		const { em } = this.props;
		em.emit('mode:change', 'idle');
		this.setState({ blockNextTurn: false });
	}

	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribe && store) {
			this.unsubscribe = store.subscribe(() => {
				if (store) {
					this.setState(store.getState());
				}
			});
			this.setState(store.getState());
		}
	}

	private bindToEventManager(): void {
		const { em } = this.props;

		if (em) {
			em.addListener('mode:change', (ev) => {
				console.log('DECISION:bindToEventManager', ev);
			});
		}
	}
}

export default hot(module)(diDecorator(withStyles(styles)(GameUIComponent)));
