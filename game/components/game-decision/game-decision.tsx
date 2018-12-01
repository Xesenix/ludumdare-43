import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EventEmitter } from 'events';
import { Container } from 'inversify';
import pipeline from 'pipeline-operator';
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
import { defaultUIState, IUIActions, IUIState } from 'lib/ui';

import { styles } from './game-decision.styles';

export interface IGameDecisionProps {
	di?: Container;
	em?: EventEmitter;
	store?: Store<any, any>;
	__: (key: string) => string;
}

const diDecorator = connectToInjector<IGameDecisionProps>({
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

export interface IGameDecisionState {
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

class GameDecisionComponent extends React.PureComponent<IGameDecisionProps & WithStyles<typeof styles>, IGameDecisionState & IUIState> {
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

	constructor(props) {
		super(props);
		this.state = this.initialState;
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
		const consequences = this.calculateConsequences();

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
						Villagers {people} / {this.getMaxPopulation()}
					</Grid>
					<Grid className={classes.resource} item xs={3}>
						Workers {workers} ({trainedWorkers})
						<Typography variant="caption" component="p">(generates 1 resources)</Typography>
						<Typography variant="caption" component="p">(new workers will start gathering resources in next year)</Typography>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.canTrainMoreWorkers()}
							onClick={this.scheduleWorkerTraining}
						>
							+
						</Button>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.canRealeseMoreWorkers()}
							onClick={this.releaseWorker}
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
							disabled={blockNextTurn || !this.canTrainMoreGuards()}
							onClick={this.scheduleGuardsTraining}
						>
							+
						</Button>
						<Button
							color="primary"
							variant="outlined"
							disabled={blockNextTurn || !this.canRealeseMoreGuards()}
							onClick={this.releaseGuard}
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
									<Typography variant="subheading" component="p">{event} power {consequences.attackPower} (weakness reduced it by { ((1 - Math.pow(0.5, weakness)) * 100).toFixed(0) }% wall reduced it by {wallPower})</Typography>
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
								disabled={blockNextTurn || !this.canMakeSacraficeForImmunity()}
								onClick={this.sacraficeResourcesForImmunity}
							>
								Make sacrafice for one turn immunity ({ sacraficeCost } resources)
							</Button>
							<Button
								color="secondary"
								variant="extendedFab"
								disabled={blockNextTurn || !this.canMakeSacraficeForWeakness()}
								onClick={this.sacraficeResourcesForEnemyWeakness}
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
								disabled={blockNextTurn || !this.canBuildWall()}
								onClick={this.buildWall}
							>
								Build wall (current reduction: { wallPower }) (+30 enemy power reduction cost { this.wallCost() } resources)
							</Button>
							<Button
								color="secondary"
								variant="extendedFab"
								disabled={blockNextTurn || !this.canBuildHome()}
								onClick={this.buildHome}
							>
								Build home ({ homesCount }) (+20 max population cost { this.homeCost() } resources)
							</Button>
						</Paper>
					</Grid>
					<Grid className={classes.resource} item xs={12}>
						<Button
							color="secondary"
							variant="extendedFab"
							disabled={blockNextTurn}
							onClick={this.reset}
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
					onClick={this.reset}
				>
					Restart
				</Button>
			</Grid>
		</Paper>);
	}

	private reset = () => {
		this.setState(this.initialState);
	}

	private getMaxPopulation() {
		const { homesCount, maxPopulation } = this.state;
		return homesCount * 20 + maxPopulation;
	}

	private homeCost() {
		const { homesCount } = this.state;
		return Math.floor((5 + homesCount * 10) * 1.5);
	}

	private canBuildHome() {
		const { resources } = this.state;
		return resources >= this.homeCost();
	}

	private buildHome = () => {
		const { homesCount, resources } = this.state;
		this.setState({
			homesCount: homesCount + 1,
			resources: resources - this.homeCost(),
		});
	}

	private wallCost() {
		const { wallPower } = this.state;
		return Math.floor((wallPower + 5) * 1.25);
	}

	private canBuildWall() {
		const { resources } = this.state;
		return resources >= this.wallCost();
	}

	private buildWall = () => {
		const { wallPower, resources } = this.state;
		this.setState({
			wallPower: wallPower + 30,
			resources: resources - this.wallCost(),
		});
	}

	private canMakeSacraficeForWeakness() {
		const { idle, sacraficeCost } = this.state;
		return idle >= sacraficeCost;
	}

	private sacraficeResourcesForEnemyWeakness = () => {
		const { weakness, idle, sacraficedIdle, sacraficeCost, turn, sacraficeCount } = this.state;

		this.setState({
			weakness: weakness + 1,
			sacrafice: 'idle',
			sacraficeCount: sacraficeCount + 1,
			sacraficeCost: 1 + 5 * turn + 3 * sacraficeCount,
			idle: idle - sacraficeCost,
			sacraficedIdle: sacraficedIdle + sacraficeCost,
		});
	}

	private canMakeSacraficeForImmunity() {
		const { resources, sacraficeCost, immunity } = this.state;
		return resources >= sacraficeCost && !immunity;
	}

	private sacraficeResourcesForImmunity = () => {
		const { immunity, resources, sacraficedResources, sacraficeCost, turn, sacraficeCount } = this.state;

		if (!immunity) {
			this.setState({
				immunity: true,
				sacrafice: 'resources',
				sacraficeCount: sacraficeCount + 1,
				sacraficeCost: 1 + 5 * turn + 3 * sacraficeCount,
				resources: resources - sacraficeCost,
				sacraficedResources: sacraficedResources + sacraficeCost,
			});
		}
	}

	private canRealeseMoreWorkers() {
		const { trainedWorkers, workers } = this.state;
		return workers > -trainedWorkers;
	}

	private releaseWorker = () => {
		const { trainedWorkers } = this.state;
		this.setState({ trainedWorkers: trainedWorkers - 1 });
	}

	private canTrainMoreWorkers() {
		const { idle, trainedWorkers, trainedGuards } = this.state;
		return trainedWorkers + trainedGuards < idle;
	}

	private scheduleWorkerTraining = () => {
		const { trainedWorkers } = this.state;
		this.setState({ trainedWorkers: trainedWorkers + 1 });
	}

	private canRealeseMoreGuards() {
		const { trainedGuards, guards } = this.state;
		return guards > -trainedGuards;
	}

	private releaseGuard = () => {
		const { trainedGuards } = this.state;
		this.setState({ trainedGuards: trainedGuards - 1 });
	}

	private canTrainMoreGuards() {
		const { idle, trainedWorkers, guards, trainedGuards, resources } = this.state;
		return guards + trainedGuards < resources && trainedWorkers + trainedGuards < idle;
	}

	private scheduleGuardsTraining = () => {
		const { trainedGuards } = this.state;
		this.setState({ trainedGuards: trainedGuards + 1 });
	}

	private handleEvent = (state) => {
		console.log('handleEvent', state.event);

		if (!state.immunity) {
			switch (state.event) {
				case 'orcs':
					return this.handleOrcAttack(state);
			}
		}

		return state;
	}

	private handleOrcAttack = (state) => {
		const { babies, workers, guards, idle, attackPower, resources } = state;
		let power = Math.floor(attackPower);
		const guardsKilled = Math.min(guards, Math.floor(power / 16));
		power = Math.max(0, power - guards * 16);
		const babiesKilled = Math.ceil(Math.min(babies, power * 2));
		power = Math.max(0, power - babiesKilled / 2);
		const resourcesStolen = Math.ceil(Math.min(resources, power * 2));
		power = Math.max(0, power - resourcesStolen / 2);
		const idleKilled = Math.ceil(Math.min(idle, power));
		power = Math.max(0, power - idleKilled);
		const workersKilled = Math.ceil(Math.min(workers, power));
		power = Math.max(0, power - workersKilled);

		const totallKilled = babiesKilled + workersKilled + idleKilled + guardsKilled;

		return {
			...state,
			idle: idle - idleKilled,
			resources: resources - resourcesStolen,
			workers: workers - workersKilled,
			guards: guards - guardsKilled,
			babies: babies - babiesKilled,
			idleKilled,
			workersKilled,
			babiesKilled,
			guardsKilled,
			resourcesStolen,
			totallKilled,
		};
	}

	private makeNewPeople = (state) => {
		const newChildren = Math.floor(state.idle / 2);
		const newAdults = state.babies;

		return {
			...state,
			idle: state.idle + newAdults,
			babies: newChildren,
			newChildren,
			newAdults,
		};
	}

	private payGuards = (state) => {
		const guardsPaid = Math.min(state.guards, state.resources);

		return {
			...state,
			guards: guardsPaid,
			idle: state.idle + state.guards - guardsPaid,
			resources: state.resources - guardsPaid,
			guardsPaid,
		};
	}

	private gatherResources = (state) => {
		const resourceGathered = state.workers;

		return {
			...state,
			resources: state.resources + resourceGathered,
			resourceGathered,
		};
	}

	private trainUnits = (state) => {
		const { idle, workers, trainedWorkers, guards, trainedGuards } = state;

		return {
			...state,
			idle: idle - trainedWorkers - trainedGuards,
			workers: workers + trainedWorkers,
			guards: guards + trainedGuards,
		};
	}

	private wallModifier = (state) => {
		const { attackPower, wallPower } = state;

		return {
			...state,
			attackPower: Math.max(0, attackPower - wallPower),
		};
	}

	private homes = (state) => {
		const { maxPopulation, homesCount } = state;

		return {
			...state,
			maxPopulation: maxPopulation + homesCount * 20,
		};
	}

	private populationLimit = (state) => {
		const { maxPopulation, workers, guards, idle, babies } = state;
		const maxIdle = Math.min(maxPopulation - workers - guards - babies, idle);

		return {
			...state,
			idle: maxIdle,
			babies: Math.min(maxPopulation - workers - guards - maxIdle, babies),
		};
	}

	private weakness = (state) => {
		const { attackPower, weakness } = state;

		return {
			...state,
			attackPower: attackPower * Math.pow(0.5, weakness),
		};
	}

	private calculateConsequences() {
		const { turn } = this.state;

		const newState = pipeline({
				...this.state,
				turn: turn + 1,
			},
			this.weakness,
			this.wallModifier,
			this.gatherResources,
			this.trainUnits,
			this.payGuards,
			// this.handleSacrafice,
			this.handleEvent,
			this.makeNewPeople,
			this.homes,
			this.populationLimit,
		);

		return {
			...newState,
			people: newState.babies + newState.idle + newState.workers + newState.guards,
		};
	}

	private progressToNextTurn = () => {
		const { em } = this.props;
		em.emit('mode:change', 'action');

		this.setState(this.calculateConsequences(), () => {
			const { turn, sacraficeCount } = this.state;
			console.log('state', this.state);
			this.setState({
				attackPower: (2 + 2 * turn * Math.ceil(turn / 2) + Math.floor(turn / 5) * 20),
				babiesKilled: 0,
				blockNextTurn: true,
				event: 'orcs',
				guardsKilled: 0,
				idleKilled: 0,
				immunity: false,
				maxPopulation: 40,
				resourcesStolen: 0,
				sacrafice: '',
				sacraficeCost: 1 + 5 * turn + 3 * sacraficeCount,
				sacraficedChildren: 0,
				sacraficedGuards: 0,
				sacraficedIdle: 0,
				sacraficedResources: 0,
				sacraficedWorkers: 0,
				totallKilled: 0,
				trainedGuards: 0,
				trainedWorkers: 0,
				workersKilled: 0,
			});
		});

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

export default hot(module)(diDecorator(withStyles(styles)(GameDecisionComponent)));
