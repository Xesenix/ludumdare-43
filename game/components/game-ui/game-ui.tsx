import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EventEmitter } from 'events';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Store } from 'redux';

// elements
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ActionIcon from '@material-ui/icons/FlashOnRounded';
// icons
import WinIcon from '@material-ui/icons/Star';

import { connectToInjector } from 'lib/di';
import { IUIState } from 'lib/ui';

import { GameEngine } from '../../src/engine';

import { styles } from './game-ui.styles';

const Loader = () => <Grid container style={{justifyContent: 'center'}}><CircularProgress color="primary" size={64}/></Grid>;

const EventWidgetComponent = Loadable({ loading: Loader, loader: () => import('../event-widget/event-widget') });
const PhaserViewComponent = Loadable({ loading: Loader, loader: () => import('../phaser-view/phaser-view') });
const TrainWidgetComponent = Loadable({ loading: Loader, loader: () => import('../train-widget/train-widget') });
const UnitsWidgetComponent = Loadable({ loading: Loader, loader: () => import('../units-widget/units-widget') });
const StatusWidgetComponent = Loadable({ loading: Loader, loader: () => import('../status-widget/status-widget') });
const SacrificesWidgetComponent = Loadable({ loading: Loader, loader: () => import('../sacrifices-widget/sacrifices-widget') });
const BuildingsWidgetComponent = Loadable({ loading: Loader, loader: () => import('../buildings-widget/buildings-widget') });
const TurnDetailsComponent = Loadable({ loading: Loader, loader: () => import('../turn-details/turn-details') });

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
	population: number;
	maxPopulation: number;
	babies: number;
	trainedWorkers: number;
	workers: number;
	trainedGuards: number;
	guards: number;
	idle: number;
	turn: number;
	resources: number;
	event: 'sacrifice' | 'orcs';
	sacrifice: 'babies' | 'idle' | 'workers' | 'resources' | 'guards';
	weakness: number;
	immunity: boolean;
	attackPower: number;
	sacrificeCost: number;
	sacrificeCount: number;
	blockNextTurn: boolean;
	wallPower: number;
	homesCount: number;
}

class GameUIComponent extends React.PureComponent<IGameUIProps & WithStyles<typeof styles>, IGameUIState & IUIState> {
	private unsubscribe?: any;
	private backToIdleHandle?: number;
	private initialState = {
		// game state
		idleKilled: 0,
		workersKilled: 0,
		babiesKilled: 0,
		guardsKilled: 0,
		resourcesStolen: 0,
		totallKilled: 0,
		sacrificedResources: 0,
		sacrificedChildren: 0,
		sacrificedIdle: 0,
		sacrificedGuards: 0,
		sacrificedWorkers: 0,
		population: 20,
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
		weaknessReduction: 0.30,
		attackPower: 2,
		sacrificeCost: 1,
		sacrificeCount: 0,
		wallPower: 0,
		homesCount: 0,
		immunity: false,
		win: false,
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
		const { compact, classes, __, em } = this.props;
		const {
			population = 0,
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
			wallPower = 0,
			weakness = 0,
			immunity = false,
			win = false,
		} = this.state;

		const engine = this.engine;

		const restartBlock = (
			<Grid item xs={12} style={{padding: '24px', textAlign: 'center'}}>
				<Button
					color="default"
					variant="extendedFab"
					disabled={blockNextTurn}
					onClick={engine.reset}
					size="large"
				>
					Restart
				</Button>
			</Grid>);

		const { sacrificeCount, sacrificedIdle, sacrificedResources } = this.state;
		const winBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={0} alignItems="center">
					<Grid item xs={12} style={{ marginBottom: '12px' }}>
						<PhaserViewComponent keepInstanceOnRemove />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="display1" component="h3" align="center">
							Your village is safe everybody are in heaven now.
						</Typography>
						<Typography variant="subheading" component="p" align="center">
							Victory achieved in year {turn}. You have sacraficed {sacrificedResources} resources and {sacrificedIdle} people in {sacrificeCount} sacrafices.
						</Typography>
					</Grid>
				</Grid>
				{restartBlock}
			</Paper>);

		const consequences = engine.calculateConsequences();

		return win
			? winBlock
			: population
			? (<Paper className={classes.root} elevation={0}>

				<Grid container spacing={compact ? 8 : 24}>
					<Grid item xs={12} sm={12} style={{ marginBottom: '12px' }}>
						{ compact ? null : <PhaserViewComponent keepInstanceOnRemove /> }
						<EventWidgetComponent consequences={consequences} currentState={this.state}/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<StatusWidgetComponent
							compact={compact}
							population={{ current: population, change: consequences.population - population, max: engine.getMaxPopulation() }}
							resources={{ current: resources, income: consequences.resources - resources }}
							turn={turn}
						/>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label="Idlers"
							amount={idle}
							hideActionBar={true}
							change={consequences.idle - idle}
							height={180}
						>
							Population without occupation will produce children in rate 1 child per every 2 idle persons.
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label="Children"
							amount={babies}
							hideActionBar={true}
							change={consequences.babies - babies}
							height={180}
						>
							Those young villagers will become idle population in next year (if they survive next year attack).
							They are also most vulnerable for attacks and will die in first order if attackers wont fins enough resources to pillage.
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label="Workers"
							amount={workers}
							trained={trainedWorkers}
							change={consequences.workers - workers}
							height={180}
						>
							Each one will collect 1 resource per turn.
							Newly trained workers will start collecting resources in next year.
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label="Guards"
							amount={guards}
							trained={trainedGuards}
							change={consequences.guards - guards}
							height={180}
						>
							They will protect other units from being attacked and resources from being stolen.
							Each one requires 1 resource per year to be operational if there are no enough resources they will become idle population once again.
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TrainWidgetComponent
							disabled={blockNextTurn}
							label="train/release workers"
							canHire={engine.canTrainMoreWorkers}
							hire={engine.scheduleWorkerTraining}
							canRelease={engine.canRealeseMoreWorkers}
							release={engine.releaseWorker}
							trained={trainedWorkers}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TrainWidgetComponent
							disabled={blockNextTurn}
							label="train/release guards"
							canHire={engine.canTrainMoreGuards}
							hire={engine.scheduleGuardsTraining}
							canRelease={engine.canRealeseMoreGuards}
							release={engine.releaseGuard}
							trained={trainedGuards}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item xs={12} justify="center">
						<Button
							color="primary"
							variant="extendedFab"
							disabled={blockNextTurn}
							onClick={this.progressToNextTurn}
							size="large"
						>
							<ActionIcon/>{ immunity ? 'Continue' : 'Defend yourself' }
						</Button>
					</Grid>
					<Grid item xs={12} sm={6}>
						<SacrificesWidgetComponent
							disabled={blockNextTurn}
							engine={engine}
							compact={compact}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<BuildingsWidgetComponent
							disabled={blockNextTurn}
							engine={engine}
							compact={compact}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item xs={12} justify="center">
						<Button
							color="primary"
							variant="extendedFab"
							disabled={blockNextTurn || !engine.canMakeUltimateSacrifice()}
							onClick={engine.makeUltimateSacrifice}
							size="large"
						>
							<WinIcon/> Make ultimate sacrifice to save everybody
							(1000&nbsp;idle population and 1000&nbsp;resources)
						</Button>
					</Grid>
					{ compact ? null : (
						<Grid item xs={12}>
							<TurnDetailsComponent consequences={consequences}/>
						</Grid>
					)}
					{restartBlock}
				</Grid>
			</Paper>
		) : (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={0} alignItems="center">
					<Grid item xs={12} style={{ marginBottom: '12px' }}>
						<PhaserViewComponent keepInstanceOnRemove />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="display1" component="h1" align="center">
							Your village has perished after {turn} years
						</Typography>
					</Grid>
				</Grid>
				{restartBlock}
			</Paper>
		);
	}

	private progressToNextTurn = () => {
		const { em } = this.props;
		// plays action soundtrack
		em.emit('mode:change', 'action');
		// TODO: add logic to play win lose soundtrack

		this.setState(this.engine.calculateConsequences(), this.engine.startNewTurn);

		if (this.backToIdleHandle) {
			clearTimeout(this.backToIdleHandle);
		}
		this.backToIdleHandle = setTimeout(this.backToIdle, 15000);
	}

	private backToIdle = () => {
		const { em } = this.props;
		// plays idle soundtrack
		em.emit('mode:change', 'idle');
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
