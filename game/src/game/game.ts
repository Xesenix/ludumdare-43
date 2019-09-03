import produce, { createDraft, finishDraft } from 'immer';

import { inject } from 'lib/di';
import { IRandomGenerator } from 'lib/random-generator';

import { IGameState } from './game.interfaces';
import { setResourcesReserved } from './models/resources/resources';
import {
	// prettier-ignore
	setResourcesStolenInLastTurn,
	setResourcesUsedInLastTurn,
} from './models/resources/resources';
import {
	// prettier-ignore
	setSacrificedPopulationInLastTurn,
	setSacrificedResourcesInLastTurn,
} from './models/skills/sacrifice';
import { setChildrenKilledInLastTurn } from './models/units/children';
import { getCurrentGuards, setGuardsKilledInLastTurn } from './models/units/guards';
import { setIdlesKilledInLastTurn } from './models/units/idles';
import { getCurrentPopulation } from './models/units/population';
import { setWorkersKilledInLastTurn } from './models/units/workers';
import { eventRule } from './rules/turn/event.rule';
import { gatherResourcesRule } from './rules/turn/gather-resources';
import { guardsUpkeepRule } from './rules/turn/guards-upkeep';
import { populationIncreaseRule } from './rules/turn/population-increase';
import { populationLimitRule } from './rules/turn/population-limit';
import { DataStore } from './store';
import {
	// prettier-ignore
	buildCottages,
	buildWalls,
} from './systems/build';
import {
	// prettier-ignore
	makeUltimateSacrifice,
	sacrificeIdlesForEnemiesWeakness,
	sacrificeResourcesForImmunity,
} from './systems/sacrifice';
import { trainWorkersRule } from './systems/training';
import {
	// prettier-ignore
	scheduleTrainingGuards,
	scheduleTrainingWorkers,
	trainGuardsRule,
} from './systems/training';

// prepare constant modifiers instead of recreating them with each method call

@inject([
	'game:initial-state',
	'game:data-store',
	'game:rng-service',
])
export class Game {
	constructor(
		// prettier-ignore
		private initialState: IGameState,
		private dataStore: DataStore<IGameState>,
		private rngService: IRandomGenerator<number>,
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
		this.rngService.seed(Date.now().toString());
		this.dataStore.setState(produce(this.initialState, () => {}));
	}

	public commitNextTurn(): void {
		this.dataStore.setState(produce(this.dataStore.getState(), this.prepareNextTurn.bind(this)));
	}

	public calculateConsequences(): IGameState {
		return produce(this.getState(), this.progress);
	}

	private progress(state: IGameState): IGameState {
		guardsUpkeepRule(state);
		populationIncreaseRule(state);
		trainGuardsRule(state);
		trainWorkersRule(state);
		populationLimitRule(state);
		eventRule(state);
		gatherResourcesRule(state);
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

		this.rngService.next();

		setResourcesUsedInLastTurn(0)(draft);
		setResourcesStolenInLastTurn(0)(draft);
		setChildrenKilledInLastTurn(0)(draft);
		setIdlesKilledInLastTurn(0)(draft);
		setGuardsKilledInLastTurn(0)(draft);
		setWorkersKilledInLastTurn(0)(draft);
		setSacrificedPopulationInLastTurn(0)(draft);
		setSacrificedResourcesInLastTurn(0)(draft);
		// reserve resources for guards upkeep
		setResourcesReserved(getCurrentGuards(draft))(draft);

		return finishDraft(draft);
	}
}
