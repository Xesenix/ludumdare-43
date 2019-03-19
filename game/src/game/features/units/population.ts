import { get } from 'game/data';
import { IGameState } from 'game/store';

import { getCottagesLevel } from '../buildings/cottages';
import {
	// prettier-ignore
	getChildrenKilledInLastTurn,
	getChildrenKilledInTotal,
	getCurrentChildren,
} from './children';
import {
	// prettier-ignore
	getCurrentGuards,
	getGuardsKilledInLastTurn,
	getGuardsKilledInTotal,
} from './guards';
import {
	// prettier-ignore
	getCurrentIdles,
	getIdlesKilledInLastTurn,
	getIdlesKilledInTotal,
} from './idles';
import {
	// prettier-ignore
	getCurrentWorkers,
	getWorkersKilledInLastTurn,
	getWorkersKilledInTotal,
} from './workers';

// === POPULATION_CURRENT

export const getCurrentPopulation = (state: IGameState) => getCurrentIdles(state)
	+ getCurrentWorkers(state)
	+ getCurrentChildren(state)
	+ getCurrentGuards(state);

// === POPULATION_KILLED_IN_THIS_TURN

export const getPopulationKilledInLastTurn = (state: IGameState) => getChildrenKilledInLastTurn(state)
	+ getIdlesKilledInLastTurn(state)
	+ getGuardsKilledInLastTurn(state)
	+ getWorkersKilledInLastTurn(state);

// === POPULATION_KILLED_IN_TOTAL

export const getPopulationKilledInTotal = (state: IGameState) => getChildrenKilledInTotal(state)
	+ getIdlesKilledInTotal(state)
	+ getGuardsKilledInTotal(state)
	+ getWorkersKilledInTotal(state);

// === POPULATION_MAX

const getBaseMaxPopulation = get<number>('population.max', 0);
export const getMaxPopulation = (state: IGameState) => getBaseMaxPopulation(state)
	+ getCottagesLevel(state) * 20;
