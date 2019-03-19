import pipeline from 'pipeline-operator';

import {
	// prettier-ignore
	changeAmountOfChildrenKilledInLastTurn,
	changeAmountOfChildrenKilledInTotal,
	changeAmountOfCurrentChildren,
} from 'game/features/units/children';
import {
	// prettier-ignore
	changeAmountOfCurrentGuards,
	changeAmountOfGuardsKilledInLastTurn,
	changeAmountOfGuardsKilledInTotal,
} from 'game/features/units/guards';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	changeAmountOfIdlesKilledInLastTurn,
	changeAmountOfIdlesKilledInTotal,
} from 'game/features/units/idles';
import {
	// prettier-ignore
	changeAmountOfCurrentWorkers,
	changeAmountOfWorkersKilledInLastTurn,
	changeAmountOfWorkersKilledInTotal,
} from 'game/features/units/workers';
import { IGameState } from 'game/store';

// === CHILDREN

const changeAmountOfChildrenKilled = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfChildrenKilledInLastTurn(amount),
	changeAmountOfChildrenKilledInTotal(amount),
);

// === GUARDS

const changeAmountOfGuardsKilled = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfGuardsKilledInLastTurn(amount),
	changeAmountOfGuardsKilledInTotal(amount),
);

// === IDLES

const changeAmountOfIdlesKilled = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfIdlesKilledInLastTurn(amount),
	changeAmountOfIdlesKilledInTotal(amount),
);

// === WORKERS

const changeAmountOfWorkersKilled = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfWorkersKilledInLastTurn(amount),
	changeAmountOfWorkersKilledInTotal(amount),
);


export const killIdles = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfCurrentIdles(-amount),
	changeAmountOfIdlesKilled(amount),
);

export const killGuards = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfCurrentGuards(-amount),
	changeAmountOfGuardsKilled(amount),
);

export const killWorkers = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfCurrentWorkers(-amount),
	changeAmountOfWorkersKilled(amount),
);

export const killChildren = (amount: number) => (state: IGameState) => pipeline(
	state,
	changeAmountOfCurrentChildren(-amount),
	changeAmountOfChildrenKilled(amount),
);
