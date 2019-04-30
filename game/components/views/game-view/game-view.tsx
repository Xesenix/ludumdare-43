import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EventEmitter } from 'events';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
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
import { LanguageType } from 'lib/interfaces';

import BuildingsWidgetComponent from 'components/buildings-widget/buildings-widget';
import EventWidgetComponent from 'components/event-widget/event-widget';
import PhaserViewComponent from 'components/phaser-view/phaser-view';
import SacrificesWidgetComponent from 'components/sacrifices-widget/sacrifices-widget';
import StatusWidgetComponent from 'components/status-widget/status-widget';
import TrainWidgetComponent from 'components/train-widget/train-widget';
// import TurnDetailsComponent from 'components/turn-details/turn-details';
import UnitsWidgetComponent from 'components/units-widget/units-widget';

import { pickBy } from 'lodash';
import { styles } from './game-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IGameViewExternalProps {
	compact: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IGameViewInternalProps {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	di?: Container;
	em: EventEmitter;
	game: Game;
	store?: Store<any, any>;
}

/** Internal component state. */
interface IGameViewState {
	currentState: IGameState | null;
	language: LanguageType;
	compactMode: boolean;
}

const diDecorator = connectToInjector<IGameViewExternalProps, IGameViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
	em: {
		dependencies: ['event-manager'],
	},
	game: {
		dependencies: ['game'],
	},
	store: {
		dependencies: ['data-store'],
	},
});

type IGameViewProps = IGameViewExternalProps & IGameViewInternalProps & WithStyles<typeof styles>;

class GameViewComponent extends React.PureComponent<IGameViewProps, IGameViewState> {
	private unsubscribeDataStore?: any;
	private unsubscribeEventManager?: any;
	private backToIdleHandle?: number;

	constructor(props) {
		super(props);

		const {
			// prettier-ignore
			compactMode,
			language,
		} = props.store.getState();

		this.state = {
			// prettier-ignore
			compactMode,
			currentState: null,
			language,
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
		const {
			// prettier-ignore
			__,
			_$,
			classes,
			game,
		} = this.props;
		const {
			// prettier-ignore
			compactMode,
		} = this.state;

		const blockNextTurn = false;
		const currentState = game.getState();
		const consequences: IGameState = game.calculateConsequences();

		const restartBlock = (
			<Grid item xs={12} style={{ padding: '24px', textAlign: 'center' }}>
				<Fab
					// prettier-ignore
					color="default"
					variant="extended"
					disabled={blockNextTurn}
					onClick={game.resetGame}
					size="large"
				>
					{__('Restart')}
				</Fab>
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
						<Typography variant="h4" component="h3" align="center">
							{__(`Your village is safe everybody are in heaven now.`)}
						</Typography>
						<Typography variant="subtitle1" component="p" align="center">
							{_$(
								// prettier-ignore
								currentState.turn,
								`Victory achieved in first year.`,
								`Victory achieved in %{turn} years.`,
								{
									turn: currentState.turn,
								},
							)}
							<br />
							{_$(
								// prettier-ignore
								sacrificedResources,
								`You have sacrificed one resource`,
								`You have sacrificed %{sacrificedResources}&nbsp;resources`,
								{
									sacrificedResources,
								},
							)}{' '}
							{_$(
								// prettier-ignore
								sacrificedPopulation,
								`and one person`,
								`and %{sacrificedPopulation}&nbsp;people`,
								{
									sacrificedPopulation,
								},
							)}{' '}
							{_$(
								// prettier-ignore
								sacrificesCount,
								`in one sacrifice.`,
								`in %{sacrificesCount} sacrifices.`,
								{
									sacrificesCount,
								},
							)}
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
						<Typography align="center" component="h1" variant="h4">
							{__(
								// prettier-ignore
								`Your village has perished after %{turn} years`,
								{
									turn: currentState.turn,
								},
							)}
						</Typography>
					</Grid>
				</Grid>
				{restartBlock}
			</Paper>
		);

		const gameBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={compactMode ? 8 : 24}>
					<Grid item sm={12} xs={12} style={{ marginBottom: '12px' }}>
						{compactMode ? null : <PhaserViewComponent keepInstanceOnRemove />}
						<EventWidgetComponent
							// prettier-ignore
							consequences={consequences}
							currentState={currentState}
							game={game}
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<StatusWidgetComponent
							// prettier-ignore
							compact={compactMode}
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
					<Grid item xs={compactMode ? 6 : 12} sm={compactMode ? 3 : 6}>
						<UnitsWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							compact={compactMode}
							label={__('Idlers')}
							amount={getCurrentIdles(currentState)}
							hideActionBar={true}
							change={getCurrentIdles(consequences) - getCurrentIdles(currentState)}
							height={180}
						>
							{__(`Population without occupation will produce children in rate 1 child per every 2 idle persons.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compactMode ? 6 : 12} sm={compactMode ? 3 : 6}>
						<UnitsWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							compact={compactMode}
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
					<Grid item xs={compactMode ? 6 : 12} sm={compactMode ? 3 : 6}>
						<UnitsWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							compact={compactMode}
							label={__('Workers')}
							amount={getCurrentWorkers(currentState)}
							trained={getTrainedWorkers(currentState)}
							change={getCurrentWorkers(consequences) - getCurrentWorkers(currentState)}
							height={180}
						>
							{__(`Each one will collect 1 resource per turn. Newly trained workers will start collecting resources in next year.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item xs={compactMode ? 6 : 12} sm={compactMode ? 3 : 6}>
						<UnitsWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							compact={compactMode}
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
							// prettier-ignore
							disabled={blockNextTurn}
							label={__('train/release workers')}
							canTrain={canTrainWorkers(currentState)}
							train={game.trainWorkers}
							trained={getTrainedWorkers(currentState)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TrainWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							label={__('train/release guards')}
							canTrain={canTrainGuards(currentState)}
							train={game.trainGuards}
							trained={getTrainedGuards(currentState)}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item xs={12} justify="center">
						<Fab
							// prettier-ignore
							color="primary"
							variant="extended"
							disabled={blockNextTurn}
							onClick={this.progressToNextTurn}
							size="large"
						>
							<ActionIcon />
							{currentState.immunity ? __('Continue') : __('Defend yourself')}
						</Fab>
					</Grid>
					<Grid item xs={12} sm={6}>
						<SacrificesWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							game={game}
							compact={compactMode}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<BuildingsWidgetComponent
							// prettier-ignore
							disabled={blockNextTurn}
							game={game}
							compact={compactMode}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item xs={12} justify="center">
						<Fab
							// prettier-ignore
							color="primary"
							variant="extended"
							disabled={blockNextTurn || !canMakeUltimateSacrifice(currentState)}
							onClick={game.makeUltimateSacrificeAction}
							size="large"
						>
							<WinIcon />{' '}
							{__(`Make ultimate sacrifice to save everybody (%{requiredPopulation}&nbsp;idle population and %{requiredResources}&nbsp;resources)`, {
								requiredPopulation: 1000,
								requiredResources: 1000,
							})}
						</Fab>
					</Grid>
					{compactMode ? null : (
						<Grid item xs={12}>
							{/* <TurnDetailsComponent consequences={consequences}/> */}
						</Grid>
					)}
					{restartBlock}
				</Grid>
			</Paper>
		);

		return currentState.win ? winBlock : currentState.lose ? loseBlock : gameBlock;
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

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			const keys = Object.keys(this.state);
			const filter = (state: IGameViewState) => pickBy(state, (_, key) => keys.indexOf(key) >= 0) as IGameViewState;
			this.unsubscribeDataStore = store.subscribe(() => {
				console.log('GameViewComponent:bindToStore', keys);
				if (!!store) {
					this.setState(filter(store.getState()));
				}
			});
			this.setState(filter(store.getState()));
		}
	}

	private bindToEventManager(): void {
		const { em } = this.props;

		if (!this.unsubscribeEventManager && em) {
			const handle = (state: IGameState) => {
				this.setState({ currentState: state });
			};
			// handle game state change
			em.addListener('state:update', handle);
			this.unsubscribeEventManager = () => {
				em.removeListener('state:update', handle);
			};
		}
	}
}

export default hot(module)(withStyles(styles)(diDecorator(GameViewComponent)));
