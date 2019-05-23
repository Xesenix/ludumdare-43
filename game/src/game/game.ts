import produce, { createDraft, finishDraft } from 'immer';

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
import {
	// prettier-ignore
	setSacrificedPopulationInLastTurn,
	setSacrificedResourcesInLastTurn,
} from './features/skills/sacrifice';
import { setChildrenKilledInLastTurn } from './features/units/children';
import { setGuardsKilledInLastTurn } from './features/units/guards';
import { setIdlesKilledInLastTurn } from './features/units/idles';
import { getCurrentPopulation } from './features/units/population';
import { setWorkersKilledInLastTurn } from './features/units/workers';
import {
	// prettier-ignore
	reduceGatherResources,
	reduceHandleEvent,
	reduceMakeNewPeople,
	reducePayGuards,
	reducePopulationLimit,
	reduceTrainUnits,
} from './reducers';
import {
	// prettier-ignore
	DataStore,
	IGameState,
} from './store';

// prepare constant modifiers instead of recreating them with each method call

export class Game {
	constructor(
		// prettier-ignore
		private initialState: IGameState,
		private dataStore: DataStore<IGameState>,
	) {
		this.resetGame();
	}

	public getState(): IGameState {
		return produce(this.dataStore.getState(), () => {});
	}

	public sacrificeResourcesForImmunityAction = (): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), sacrificeResourcesForImmunity));
	}

	public sacrificeIdlesForEnemiesWeaknessAction = (): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), sacrificeIdlesForEnemiesWeakness));
	}

	public makeUltimateSacrificeAction = (): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), makeUltimateSacrifice));
	}

	public trainWorkers = (amount: number): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), scheduleTrainingWorkers(amount)));
	}

	public trainGuards = (amount: number): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), scheduleTrainingGuards(amount)));
	}

	public buildWalls = (amount: number = 1): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), buildWalls(amount)));
	}

	public buildCottages = (amount: number = 1): void => {
		this.dataStore.setState(produce(this.dataStore.getState(), buildCottages(amount)));
	}

	public resetGame = (): void => {
		this.dataStore.setState(produce(this.initialState, () => {}));
	}

	public commitNextTurn(): void {
		this.dataStore.setState(produce(this.dataStore.getState(), this.prepareNextTurn.bind(this)));
	}

	public calculateConsequences(): IGameState {
		return produce(this.getState(), this.progress);
	}

	private progress(state: IGameState): IGameState {
		reduceGatherResources(state);
		reducePayGuards(state);
		reduceMakeNewPeople(state);
		reduceTrainUnits(state);
		trainGuardsRule(state);
		reducePopulationLimit(state);
		reduceHandleEvent(state);
		state.turn ++;
		state.lose = getCurrentPopulation(state) === 0;
		return state;
	}

	private prepareNextTurn(state: IGameState): IGameState {
		// prettier-ignore
		const draft = createDraft(state);

		draft.event = 'orcs';
		draft.immunity = false;

		this.progress(draft);
		setResourcesUsedInLastTurn(0)(draft);
		setResourcesStolenInLastTurn(0)(draft);
		setChildrenKilledInLastTurn(0)(draft);
		setIdlesKilledInLastTurn(0)(draft);
		setGuardsKilledInLastTurn(0)(draft);
		setWorkersKilledInLastTurn(0)(draft);
		setSacrificedPopulationInLastTurn(0)(draft);
		setSacrificedResourcesInLastTurn(0)(draft);

		return finishDraft(draft);
	}
}
