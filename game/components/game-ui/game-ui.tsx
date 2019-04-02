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
import { IGameState } from 'game/store';

import { canMakeUltimateSacrifice } from 'game/actions/sacrifice';
import {
	// prettier-ignore
	canTrainGuards,
	canTrainWorkers,
} from 'game/actions/training';
import { getResourcesAmount } from 'game/features/resources/resources';
import {
	// prettier-ignore
	getSacrificeCount,
	getSacrificedPopulationInTotal,
	getSacrificedResourcesInTotal,
} from 'game/features/skills/sacrifice';
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
import {
	// prettier-ignore
	II18nPluralTranslation,
	II18nTranslation,
} from 'lib/i18n';
import { styles } from './game-ui.styles';

const Loader = () => <Grid container style={{justifyContent: 'center'}}><CircularProgress color="primary" size={64}/></Grid>;

const BuildingsWidgetComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../buildings-widget/buildings-widget') });
const EventWidgetComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../event-widget/event-widget') });
const PhaserViewComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../phaser-view/phaser-view') });
const SacrificesWidgetComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../sacrifices-widget/sacrifices-widget') });
const StatusWidgetComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../status-widget/status-widget') });
const TrainWidgetComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../train-widget/train-widget') });
// const TurnDetailsComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../turn-details/turn-details') });
const UnitsWidgetComponent = Loadable({ loading: Loader, loader: () => import(/* webpackChunkName: "game-components" */ '../units-widget/units-widget') });

/** Component public properties required to be provided by parent component. */
export interface IGameUIProps {
	compact: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IGameUIInternalProps {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	di?: Container;
	em: EventEmitter;
	game: Game;
	store?: Store<any, any>;
}

const diDecorator = connectToInjector<IGameUIProps, IGameUIInternalProps>({
	store: {
		dependencies: ['data-store'],
	},
	em: {
		dependencies: ['event-manager'],
	},
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
	game: {
		dependencies: ['game'],
	},
});

/** Internal component state. */
interface IGameUIState {
	currentState: IGameState | null;
}

class GameUIComponent extends React.PureComponent<IGameUIProps & IGameUIInternalProps & WithStyles<typeof styles>, IGameUIState> {
	private unsubscribeDataStore?: any;
	private unsubscribeEventManager?: any;
	private backToIdleHandle?: number;

	constructor(props) {
		super(props);

		this.state = {
			currentState: null,
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
		if (this.unsubscribeDataStore) {
			this.unsubscribeDataStore();
		}
		if (this.unsubscribeEventManager) {
			this.unsubscribeEventManager();
		}
	}

	public render(): any {
		const { game, compact, classes, __, _$ } = this.props;
		const blockNextTurn = false;

		const currentState = game.getState();
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
					{__('Restart')}
				</Button>
			</Grid>
		);

		const sacrificedResources = getSacrificedResourcesInTotal(currentState);
		const sacrificedPopulation = getSacrificedPopulationInTotal(currentState);
		const sacrificesCount = getSacrificeCount(currentState);

		const winBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={0} alignItems="center">
					<Grid item xs={12} style={{ marginBottom: '12px' }}>
						<PhaserViewComponent keepInstanceOnRemove />
					</Grid>
					<Grid item xs={12}>
						<Typography variant="display1" component="h3" align="center">
							{__(`Your village is safe everybody are in heaven now.`)}
						</Typography>
						<Typography variant="subheading" component="p" align="center">
							{_$(currentState.turn, `Victory achieved in first year.`, `Victory achieved in %{turn} years.`, {
								turn: currentState.turn,
							})}
							<br/>
							{_$(sacrificedResources, `You have sacrificed one resource`, `You have sacrificed %{sacrificedResources}&nbsp;resources`, {
								sacrificedResources,
							})} {_$(sacrificedPopulation, `and one person`, `and %{sacrificedPopulation}&nbsp;people`, {
								sacrificedPopulation,
							})} {_$(sacrificesCount, `in one sacrifice.`, `in %{sacrificesCount} sacrifices.`, {
								sacrificesCount,
							})}
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
						<Typography align="center" component="h1" variant="display1">
							{__(`Your village has perished after %{turn} years`, {
								turn: currentState.turn,
							})}
						</Typography>
					</Grid>
				</Grid>
				{restartBlock}
			</Paper>
		);

		const gameBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={compact ? 8 : 24}>
					<Grid item sm={12} xs={12} style={{ marginBottom: '12px' }}>
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
							label={__('Idlers')}
							amount={getCurrentIdles(currentState)}
							hideActionBar={true}
							change={getCurrentIdles(consequences) - getCurrentIdles(currentState)}
							height={180}
						>
							{__(`Population without occupation will produce children in rate 1 child per every 2 idle persons.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label={__('Children')}
							amount={getCurrentChildren(currentState)}
							hideActionBar={true}
							change={getCurrentChildren(consequences) - getCurrentChildren(currentState)}
							height={180}
						>
							{__(`Those young villagers will become idle population in next year (if they survive next year attack).
They are also most vulnerable for attacks and will die in first order if attackers wont fins enough resources to pillage.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label={__('Workers')}
							amount={getCurrentWorkers(currentState)}
							trained={getTrainedWorkers(currentState)}
							change={getCurrentWorkers(consequences) - getCurrentWorkers(currentState)}
							height={180}
						>
							{__(`Each one will collect 1 resource per turn. Newly trained workers will start collecting resources in next year.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compact ? 6 : 12} sm={compact ? 3 : 6}>
						<UnitsWidgetComponent
							disabled={blockNextTurn}
							compact={compact}
							label={__('Guards')}
							amount={getCurrentGuards(currentState)}
							trained={getTrainedGuards(currentState)}
							change={getCurrentGuards(consequences) - getCurrentGuards(currentState)}
							height={180}
						>
							{__(`They will protect other units from being attacked and resources from being stolen.
Each one requires 1 resource per year to be operational if there are no enough resources they will become idle population once again.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TrainWidgetComponent
							disabled={blockNextTurn}
							label={__('train/release workers')}
							canTrain={canTrainWorkers(currentState)}
							train={game.trainWorkers}
							trained={getTrainedWorkers(currentState)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TrainWidgetComponent
							disabled={blockNextTurn}
							label={__('train/release guards')}
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
							<ActionIcon/>{ currentState.immunity ? __('Continue') : __('Defend yourself') }
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
							<WinIcon/> {__(`Make ultimate sacrifice to save everybody (%{requiredPopulation}&nbsp;idle population and %{requiredResources}&nbsp;resources)`, {
								requiredPopulation: 1000,
								requiredResources: 1000,
							})}
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
		const { game } = this.props;
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

		if (!this.unsubscribeDataStore && store) {
			this.unsubscribeDataStore = store.subscribe(() => {
				if (store) {
					this.setState(store.getState());
				}
			});
			this.setState(store.getState());
		}
	}

	private bindToEventManager(): void {
		const { em } = this.props;

		if (!this.unsubscribeEventManager && em) {
			console.log('GameUIComponent:bindToEventManager:subscribe');
			const handle = (state: IGameState) => {
				console.log('GameUIComponent:bindToEventManager:state', state);
				this.setState({ currentState: state });
			};
			em.addListener('state:update', handle);
			this.unsubscribeEventManager = () => {
				console.log('GameUIComponent:bindToEventManager:unsubscribe');
				em.removeListener('state:update', handle);
			};
		}
	}
}

export default hot(module)(withStyles(styles)(diDecorator(GameUIComponent)));
