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

import { Game } from 'game/game';
import { DataStore, IGameState } from 'game/store';

import { canMakeUltimateSacrifice } from 'game/actions/sacrifice';
import {
	// prettier-ignore
	canTrainGuards,
	canTrainWorkers,
} from 'game/actions/training';
import { getResourcesAmount } from 'game/features/resources/resources';
import { getSacrificeCount, getSacrificedPopulationInTotal, getSacrificedResourcesInTotal } from 'game/features/skills/sacrifice';
import { getCurrentChildren } from 'game/features/units/children';
import {
	// prettier-ignore
	getCurrentGuards,
	getTrainedGuards,
} from 'game/features/units/guards';
import { getCurrentIdles } from 'game/features/units/idles';
import {
	// prettier-ignore
	getCurrentPopulation,
	getMaxPopulation,
} from 'game/features/units/population';
import {
	// prettier-ignore
	getCurrentWorkers,
	getTrainedWorkers,
} from 'game/features/units/workers';
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
	em: EventEmitter;
	store?: Store<any, any>;
	compact: boolean;
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
	game?: Game;
	currentState: IGameState;
}

class GameUIComponent extends React.PureComponent<IGameUIProps & WithStyles<typeof styles>, IGameUIState> {
	private unsubscribe?: any;
	private backToIdleHandle?: number;

	private initialState: IGameState = {
		population: {
			current: 20,
			max: 20,
		},
		idles: {
			current: 20,
			killed: { current: 0, total: 0 },
		},
		guards: {
			current: 0,
			trained: 0,
			killed: { current: 0, total: 0 },
		},
		workers: {
			current: 0,
			trained: 0,
			killed: { current: 0, total: 0 },
		},
		children: {
			current: 0,
			killed: { current: 0, total: 0 },
		},
		resources: {
			amount: 0,
			reserved: 0,
			used: { current: 0, total: 0 },
			stolen: { current: 0, total: 0 },
		},
		cottages: {
			level: 1,
		},
		walls: {
			level: 0,
			perLevelReduction: 30,
			costMultiplier: 1.25,
		},
		sacrifice: {
			count: 0,
			cost: {
				resources: { current: 0, total: 0 },
				population: { current: 0, total: 0 },
			},
		},
		turn: 0,
		win: false,
		lose: false,
		event: 'orcs',
		weakness: {
			level: 0,
			perLevelReduction: 0.3,
		},
		immunity: false,
	};

	constructor(props) {
		super(props);

		const { em } = this.props;

		const dataStore = new DataStore<IGameState>(this.initialState, em);

		this.state = {
			game: new Game(this.initialState, dataStore),
			currentState: this.initialState,
		};
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
		const { compact, classes } = this.props;
		const { game = {} as Game, currentState } = this.state;
		const blockNextTurn = false;

		const consequences: IGameState = game.calculateConsequences();

		const restartBlock = (
			<Grid item xs={12} style={{ padding: '24px', textAlign: 'center' }}>
				<Button
					color="default"
					variant="extendedFab"
					disabled={blockNextTurn}
					onClick={game.resetGame}
					size="large"
				>
					Restart
				</Button>
			</Grid>
		);

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
							Victory achieved in year {currentState.turn}.
							You have sacrificed {getSacrificedResourcesInTotal(currentState)}
							resources and {getSacrificedPopulationInTotal(currentState)}
							people in {getSacrificeCount(currentState)} sacrifices.
						</Typography>
					</Grid>
				</Grid>
				{restartBlock}
			</Paper>
		);

		const loseBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={0} alignItems="center">
					<Grid item xs={12} style={{ marginBottom: '12px' }}>
						<PhaserViewComponent keepInstanceOnRemove />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="display1" component="h1" align="center">
							Your village has perished after {currentState.turn} years
						</Typography>
					</Grid>
				</Grid>
				{restartBlock}
			</Paper>
		);

		const gameBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={compact ? 8 : 24}>
					<Grid item xs={12} sm={12} style={{ marginBottom: '12px' }}>
						{ compact ? null : <PhaserViewComponent keepInstanceOnRemove /> }
						<EventWidgetComponent
							consequences={consequences}
							currentState={currentState}
							game={game}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<StatusWidgetComponent
							compact={compact}
							population={{
								current: getCurrentPopulation(currentState),
								change: getCurrentPopulation(consequences) - getCurrentPopulation(currentState),
								max: getMaxPopulation(currentState),
							}}
							resources={{
								current: getResourcesAmount(currentState),
								income: getResourcesAmount(consequences) - getResourcesAmount(currentState),
							}}
							turn={currentState.turn}
						/>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label="Idlers"
							amount={getCurrentIdles(currentState)}
							hideActionBar={true}
							change={getCurrentIdles(consequences) - getCurrentIdles(currentState)}
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
							amount={getCurrentChildren(currentState)}
							hideActionBar={true}
							change={getCurrentChildren(consequences) - getCurrentChildren(currentState)}
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
							amount={getCurrentWorkers(currentState)}
							trained={getTrainedWorkers(currentState)}
							change={getCurrentWorkers(consequences) - getCurrentWorkers(currentState)}
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
							amount={getCurrentGuards(currentState)}
							trained={getTrainedGuards(currentState)}
							change={getCurrentGuards(consequences) - getCurrentGuards(currentState)}
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
							canTrain={canTrainWorkers(currentState)}
							train={game.trainWorkers}
							trained={getTrainedWorkers(currentState)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TrainWidgetComponent
							disabled={blockNextTurn}
							label="train/release guards"
							canTrain={canTrainGuards(currentState)}
							train={game.trainGuards}
							trained={getTrainedGuards(currentState)}
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
							<ActionIcon/>{ currentState.immunity ? 'Continue' : 'Defend yourself' }
						</Button>
					</Grid>
					<Grid item xs={12} sm={6}>
						<SacrificesWidgetComponent
							disabled={blockNextTurn}
							game={game}
							compact={compact}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<BuildingsWidgetComponent
							disabled={blockNextTurn}
							game={game}
							compact={compact}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item xs={12} justify="center">
						<Button
							color="primary"
							variant="extendedFab"
							disabled={blockNextTurn || !canMakeUltimateSacrifice(currentState)}
							onClick={game.makeUltimateSacrificeAction}
							size="large"
						>
							<WinIcon/> Make ultimate sacrifice to save everybody
							(1000&nbsp;idle population and 1000&nbsp;resources)
						</Button>
					</Grid>
					{ compact ? null : (
						<Grid item xs={12}>
							{/* <TurnDetailsComponent consequences={consequences}/> */}
						</Grid>
					)}
					{restartBlock}
				</Grid>
			</Paper>
		);

		return currentState.win
			? winBlock
			: currentState.lose
			? loseBlock
			: gameBlock;
	}

	private progressToNextTurn = () => {
		const { game } = this.state;
		if (game) {
			game.commitNextTurn();
		}
		const { em } = this.props;
		// plays action soundtrack
		if (em) {
			em.emit('mode:change', 'action');
		}
		// TODO: add logic to play win lose soundtrack

		if (this.backToIdleHandle) {
			clearTimeout(this.backToIdleHandle);
		}

		this.backToIdleHandle = setTimeout(this.backToIdle, 15000) as any;
	}

	private backToIdle = () => {
		const { em } = this.props;
		// plays idle soundtrack
		if (em) {
			em.emit('mode:change', 'idle');
		}
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
			em.addListener('state:update', (state: IGameState) => {
				console.log('GameUIComponent:state', state);
				this.setState({ currentState: state });
			});
		}
	}
}

export default hot(module)(diDecorator(withStyles(styles)(GameUIComponent)));
