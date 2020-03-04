import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EventEmitter } from 'events';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Game, IGameState } from 'game';
import { connectToInjector } from 'lib/di';

import {
	// prettier-ignore
	II18nLanguagesState,
	II18nPluralTranslation,
	II18nTranslation,
} from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
	StoreComponent,
} from 'lib/utils/store.component';

// elements
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// icons
import ActionIcon from '@material-ui/icons/FlashOnRounded';
import WinIcon from '@material-ui/icons/Star';

// components
import PhaserViewComponent from 'phaser/components/phaser-view';

import BuildingsWidgetComponent from 'game/components/buildings-widget/buildings-widget';
import EventWidgetComponent from 'game/components/event-widget/event-widget';
import SacrificesWidgetComponent from 'game/components/sacrifices-widget/sacrifices-widget';
import StatusWidgetComponent from 'game/components/status-widget/status-widget';
import TrainWidgetComponent from 'game/components/train-widget/train-widget';
// import TurnDetailsComponent from 'game/components/turn-details/turn-details';
import UnitsWidgetComponent from 'game/components/units-widget/units-widget';

import { ChildrenSystem } from 'game/systems/children';
import { GuardsSystem } from 'game/systems/guards';
import { IdlesSystem } from 'game/systems/idles';
import { PopulationSystem } from 'game/systems/population';
import { ResourcesSystem } from 'game/systems/resources';
import { SacrificesSystem } from 'game/systems/sacrifices';
import { WorkersSystem } from 'game/systems/workers';

import DefeatComponent from './scenes/defeat/defeat';
import RestartComponent from './scenes/restart/restart';
import VictoryComponent from './scenes/victory/victory';

import { styles } from './game-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IGameViewExternalProps {
	compact: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IGameViewInternalProps extends IStoreComponentInternalProps<IGameViewState> {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	children: ChildrenSystem;
	di?: Container;
	em: EventEmitter;
	game: Game;
	guards: GuardsSystem;
	idles: IdlesSystem;
	population: PopulationSystem;
	resources: ResourcesSystem;
	sacrifices: SacrificesSystem;
	workers: WorkersSystem;
}

/** Internal component state. */
interface IGameViewState {
	compactMode: boolean;
	currentState: IGameState | null;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
}

type IGameViewProps = IGameViewExternalProps & IGameViewInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IGameViewProps, IGameViewInternalProps>({
	...diStoreComponentDependencies,
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
	children: {
		dependencies: ['game:system:children'],
	},
	em: {
		dependencies: ['event-manager'],
	},
	game: {
		dependencies: ['game'],
	},
	guards: {
		dependencies: ['game:system:guards'],
	},
	idles: {
		dependencies: ['game:system:idles'],
	},
	population: {
		dependencies: ['game:system:population'],
	},
	resources: {
		dependencies: ['game:system:resources'],
	},
	sacrifices: {
		dependencies: ['game:system:sacrifices'],
	},
	workers: {
		dependencies: ['game:system:workers'],
	},
});

class GameViewComponent extends StoreComponent<IGameViewProps, IGameViewState> {
	private unsubscribeEventManager?: any;
	private backToIdleHandle?: number;

	constructor(props) {
		super(props, [
			// prettier-ignore
			'compactMode',
			'language',
			'languages',
		]);

		this.state = {
			...this.state,
			currentState: null,
		};
	}

	public componentDidMount(): void {
		super.componentDidMount();
		this.bindToEventManager();
	}

	public componentWillUnmount(): void {
		super.componentWillUnmount();
		if (this.unsubscribeEventManager) {
			this.unsubscribeEventManager();
		}
	}

	public render(): any {
		const {
			// prettier-ignore
			__,
			children,
			classes,
			game,
			guards,
			idles,
			population,
			resources,
			sacrifices,
			workers,
		} = this.props;
		const {
			// prettier-ignore
			compactMode,
		} = this.state;

		const blockNextTurn = false;
		const currentState: IGameState = game.getState();
		const consequences: IGameState = game.calculateConsequences();

		const gameBlock = (
			<Paper className={classes.root} elevation={0}>
				<Grid container spacing={compactMode ? 1 : 3}>
					<Grid item sm={12} style={{ marginBottom: '12px' }} xs={12}>
						{compactMode ? null : <PhaserViewComponent keepInstanceOnRemove />}
						<EventWidgetComponent
							// prettier-ignore
							consequences={consequences}
							currentState={currentState}
						/>
					</Grid>
					<Grid item sm={12} xs={12}>
						<StatusWidgetComponent
							// prettier-ignore
							compact={compactMode}
							population={{
								current: population.getCurrentAmount(),
								change: population.getCurrentAmountDiff(consequences),
								max: population.getMaxAmount(),
							}}
							resources={{
								current: resources.getAmount(),
								income: resources.getAmountDiff(consequences),
							}}
							turn={currentState.turn}
						/>
					</Grid>
					<Grid item sm={compactMode ? 3 : 6} xs={compactMode ? 6 : 12}>
						<UnitsWidgetComponent
							// prettier-ignore
							amount={idles.getCurrentAmount()}
							change={idles.getCurrentAmountDiff(consequences)}
							compact={compactMode}
							label={__('Idlers')}
						>
							{__(`Population without occupation will produce children in rate 1 child per every 2 idle persons.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item sm={compactMode ? 3 : 6} xs={compactMode ? 6 : 12}>
						<UnitsWidgetComponent
							// prettier-ignore
							amount={children.getCurrentAmount()}
							change={children.getCurrentAmountDiff(consequences)}
							compact={compactMode}
							label={__('Children')}
						>
							{__(`Those young villagers will become idle population in next year (if they survive next year attack).
They are also most vulnerable for attacks and will die in first order if attackers wont fins enough resources to pillage.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item sm={compactMode ? 3 : 6} xs={compactMode ? 6 : 12}>
						<UnitsWidgetComponent
							// prettier-ignore
							amount={workers.getCurrentAmount()}
							change={workers.getCurrentAmountDiff(consequences)}
							compact={compactMode}
							label={__('Workers')}
							trained={workers.getTrainedAmount()}
						>
							{__(`Each one will collect 1 resource per turn. Newly trained workers will start collecting resources in next year.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item sm={compactMode ? 3 : 6} xs={compactMode ? 6 : 12}>
						<UnitsWidgetComponent
							// prettier-ignore
							amount={guards.getCurrentAmount()}
							change={guards.getCurrentAmountDiff(consequences)}
							compact={compactMode}
							label={__('Guards')}
							trained={guards.getTrainedAmount()}
						>
							{__(`They will protect other units from being attacked and resources from being stolen.
Each one requires 1 resource per year to be operational if there are no enough resources they will become idle population once again.`)}
						</UnitsWidgetComponent>
					</Grid>
					<Grid item sm={6} xs={12}>
						<TrainWidgetComponent
							// prettier-ignore
							canTrain={workers.canTrain}
							disabled={blockNextTurn}
							label={__('train/release workers')}
							train={workers.scheduleTrainingAction}
							trained={workers.getTrainedAmount()}
						/>
					</Grid>
					<Grid item sm={6} xs={12}>
						<TrainWidgetComponent
							// prettier-ignore
							canTrain={guards.canTrain}
							disabled={blockNextTurn}
							label={__('train/release guards')}
							train={guards.scheduleTrainingAction}
							trained={guards.getTrainedAmount()}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item justify="center" xs={12}>
						<Fab
							// prettier-ignore
							color="primary"
							disabled={blockNextTurn}
							onClick={this.progressToNextTurn}
							size="large"
							variant="extended"
						>
							<ActionIcon />
							{__('Defend yourself')}
						</Fab>
					</Grid>
					<Grid item sm={6} xs={12}>
						<SacrificesWidgetComponent
							// prettier-ignore
							compact={compactMode}
							disabled={blockNextTurn}
						/>
					</Grid>
					<Grid item sm={6} xs={12}>
						<BuildingsWidgetComponent
							// prettier-ignore
							compact={compactMode}
							disabled={blockNextTurn}
						/>
					</Grid>
					<Grid className={classes.actionbar} container item justify="center" xs={12}>
						<Fab
							// prettier-ignore
							color="primary"
							disabled={blockNextTurn || !sacrifices.canMakeUltimateSacrifice()}
							onClick={sacrifices.makeUltimateSacrificeAction}
							size="large"
							variant="extended"
						>
							<WinIcon />{' '}
							{__(`Make ultimate sacrifice to save everybody (%{requiredPopulation}&nbsp;idle population and %{requiredResources}&nbsp;resources)`, {
								requiredPopulation: sacrifices.getSacrificeCost(),
								requiredResources: sacrifices.getSacrificeCost(),
							})}
						</Fab>
					</Grid>
					{compactMode ? null : (
						<Grid item xs={12}>
							{/* <TurnDetailsComponent consequences={consequences}/> */}
						</Grid>
					)}
					<RestartComponent/>
				</Grid>
			</Paper>
		);

		return currentState.win ? <VictoryComponent/> : currentState.lose ? <DefeatComponent/> : gameBlock;
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
