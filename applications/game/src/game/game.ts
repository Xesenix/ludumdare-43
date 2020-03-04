import produce, { createDraft, finishDraft } from 'immer';

import { inject } from 'lib/di';
import { IRandomGenerator } from 'lib/random-generator';

import { IGameState } from './interfaces';
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
import { DataStore } from './store';
import { GuardsSystem } from './systems/guards';
import { PopulationSystem } from './systems/population';
import { ResourcesSystem } from './systems/resources';
import { WeaknessSystem } from './systems/weakness';
import { WorkersSystem } from './systems/workers';

// prepare constant modifiers instead of recreating them with each method call

@inject([
	'game:initial-state',
	'game:data-store',
	'game:rng-service',
	'game:system:guards',
	'game:system:workers',
	'game:system:population',
	'game:system:resources',
	'game:system:weakness',
	'game:system:sacrifices',
])
export class Game {
	constructor(
		// prettier-ignore
		private initialState: IGameState,
		private dataStore: DataStore<IGameState>,
		private rngService: IRandomGenerator<number>,
		private guards: GuardsSystem,
		private workers: WorkersSystem,
		private population: PopulationSystem,
		private resources: ResourcesSystem,
		private weakness: WeaknessSystem,
	) {
		this.resetGame();
	}

	public getState(): IGameState {
		return produce(this.dataStore.getState(), () => {});
	}

	public levelUpWeaknessAction = (): void => {
		this.dataStore.setState(finishDraft(this.weakness.buyLevel(1)));
	}

	public resetGame = (): void => {
		this.rngService.seed(Date.now().toString());
		this.dataStore.setState(produce(this.initialState, () => {}));
	}

	public commitNextTurn(): void {
		this.dataStore.setState(produce(this.dataStore.getState(), this.prepareNextTurn));
	}

	public calculateConsequences(): IGameState {
		return produce(this.getState(), this.progress);
	}

	private progress = (state: IGameState): IGameState => {
		this.guards.upkeepRule(state);
		this.population.populationIncreaseRule(state);
		this.guards.trainRule(state);
		this.workers.trainRule(state);
		this.population.populationLimitRule(state);
		eventRule(state);
		this.resources.gatherResourcesRule(state);
		state.turn ++;
		state.lose = getCurrentPopulation(state) === 0;
		return state;
	}

	private prepareNextTurn = (state: IGameState): IGameState => {
		// prettier-ignore
		const draft = createDraft(state);

		draft.event = 'orcs';

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
