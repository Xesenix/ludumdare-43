import { cloneDeep } from 'lodash';
import pipeline from 'pipeline-operator';
import {
	// prettier-ignore
	setSacrificedPopulationInLastTurn,
	setSacrificedResourcesInLastTurn,
} from './features/skills/sacrifice';
import { getCurrentPopulation } from './features/units/population';

import {
	// prettier-ignore
	reduceGatherResources,
	reduceHandleEvent,
	reduceMakeNewPeople,
	reducePayGuards,
	reducePopulationLimit,
	reduceTrainUnits,
} from '../reducers/index';
import {
	// prettier-ignore
	buildCottages,
	buildWalls,
} from './actions/build';
import {
	// prettier-ignore
	makeUltimateSacrifice,
	sacrificeIdlesForEnemiesWeakness,
	sacrificeResourcesForImmunity,
} from './actions/sacrifice';
import {
	// prettier-ignore
	scheduleTrainingGuards,
	scheduleTrainingWorkers,
	trainGuardsRule,
} from './actions/training';
import {
	// prettier-ignore
	setResourcesStolenInLastTurn,
	setResourcesUsedInLastTurn,
} from './features/resources/resources';
import { setChildrenKilledInLastTurn } from './features/units/children';
import { setGuardsKilledInLastTurn } from './features/units/guards';
import { setIdlesKilledInLastTurn } from './features/units/idles';
import { setWorkersKilledInLastTurn } from './features/units/workers';
import {
	// prettier-ignore
	DataStore,
	IGameState,
} from './store';

// prepare constant modifiers instead of recreating them with each method call
const resetResourcesUsedInLastTurn = setResourcesUsedInLastTurn(0);
const resetResourcesStolenInLastTurn = setResourcesStolenInLastTurn(0);
const resetChildrenKilledInLastTurn = setChildrenKilledInLastTurn(0);
const resetIdlesKilledInLastTurn = setIdlesKilledInLastTurn(0);
const resetGuardsKilledInLastTurn = setGuardsKilledInLastTurn(0);
const resetWorkersKilledInLastTurn = setWorkersKilledInLastTurn(0);
const resetSacrificedPopulationInLastTurn = setSacrificedPopulationInLastTurn(0);
const resetSacrificedResourcesInLastTurn = setSacrificedResourcesInLastTurn(0);

export class Game {
	constructor(
		// prettier-ignore
		private initialState: IGameState,
		private dataStore: DataStore<IGameState>,
	) {
		this.resetGame();
	}

	public getState(): IGameState {
		return cloneDeep(this.dataStore.getState());
	}

	public sacrificeResourcesForImmunityAction = (): void => {
		this.dataStore.setState(sacrificeResourcesForImmunity(this.dataStore.getState()));
	}

	public sacrificeIdlesForEnemiesWeaknessAction = (): void => {
		this.dataStore.setState(sacrificeIdlesForEnemiesWeakness(this.dataStore.getState()));
	}

	public makeUltimateSacrificeAction = (): void => {
		this.dataStore.setState(makeUltimateSacrifice(this.dataStore.getState()));
	}

	public trainWorkers = (amount: number): void => {
		this.dataStore.setState(scheduleTrainingWorkers(amount)(this.dataStore.getState()));
	}

	public trainGuards = (amount: number): void => {
		this.dataStore.setState(scheduleTrainingGuards(amount)(this.dataStore.getState()));
	}

	public buildWalls = (amount: number = 1): void => {
		this.dataStore.setState(buildWalls(amount)(this.dataStore.getState()));
	}

	public buildCottages = (amount: number = 1): void => {
		this.dataStore.setState(buildCottages(amount)(this.dataStore.getState()));
	}

	public resetGame = (): void => {
		this.dataStore.setState(cloneDeep(this.initialState));
	}

	public commitNextTurn(): void {
		this.dataStore.setState(this.prepareNextTurn(this.calculateConsequences()));
	}

	public calculateConsequences(): IGameState {
		const state = this.getState();

		return pipeline(
			// prettier-ignore
			state,
			this.progress,
		);
	}

	private progress(state: IGameState): IGameState {
		return pipeline(
			// prettier-ignore
			state,
			reduceGatherResources,
			reducePayGuards,
			reduceMakeNewPeople,
			reduceTrainUnits,
			trainGuardsRule,
			reducePopulationLimit,
			reduceHandleEvent,
			(nextState: IGameState) => ({
				...nextState,
				turn: nextState.turn + 1,
				lose: getCurrentPopulation(nextState) === 0,
			}),
		);
	}

	private prepareNextTurn(state: IGameState): IGameState {
		// prettier-ignore
		return pipeline({
				...state,
				event: 'orcs',
				immunity: false,
			},
			resetResourcesUsedInLastTurn,
			resetResourcesStolenInLastTurn,
			resetChildrenKilledInLastTurn,
			resetIdlesKilledInLastTurn,
			resetGuardsKilledInLastTurn,
			resetWorkersKilledInLastTurn,
			resetSacrificedPopulationInLastTurn,
			resetSacrificedResourcesInLastTurn,
		);
	}
}
