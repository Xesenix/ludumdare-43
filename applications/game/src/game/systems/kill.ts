import { IGameState } from 'game';
import {
	// prettier-ignore
	changeAmountOfChildrenKilledInLastTurn,
	changeAmountOfChildrenKilledInTotal,
	changeAmountOfCurrentChildren,
} from 'game/models/units/children';
import {
	// prettier-ignore
	changeAmountOfCurrentGuards,
	changeAmountOfGuardsKilledInLastTurn,
	changeAmountOfGuardsKilledInTotal,
} from 'game/models/units/guards';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	changeAmountOfIdlesKilledInLastTurn,
	changeAmountOfIdlesKilledInTotal,
} from 'game/models/units/idles';
import {
	// prettier-ignore
	changeAmountOfCurrentWorkers,
	changeAmountOfWorkersKilledInLastTurn,
	changeAmountOfWorkersKilledInTotal,
} from 'game/models/units/workers';

// === CHILDREN

const changeAmountOfChildrenKilled = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfChildrenKilledInLastTurn(amount)(state);
	changeAmountOfChildrenKilledInTotal(amount)(state);

	return state;
};

// === GUARDS

const changeAmountOfGuardsKilled = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfGuardsKilledInLastTurn(amount)(state);
	changeAmountOfGuardsKilledInTotal(amount)(state);

	return state;
};

// === IDLES

const changeAmountOfIdlesKilled = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfIdlesKilledInLastTurn(amount)(state);
	changeAmountOfIdlesKilledInTotal(amount)(state);

	return state;
};

// === WORKERS

const changeAmountOfWorkersKilled = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfWorkersKilledInLastTurn(amount)(state);
	changeAmountOfWorkersKilledInTotal(amount)(state);

	return state;
};

export const killIdles = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfCurrentIdles(-amount)(state);
	changeAmountOfIdlesKilled(amount)(state);

	return state;
};

export const killGuards = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfCurrentGuards(-amount)(state);
	changeAmountOfGuardsKilled(amount)(state);

	return state;
};

export const killWorkers = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfCurrentWorkers(-amount)(state);
	changeAmountOfWorkersKilled(amount)(state);

	return state;
};

export const killChildren = (amount: number) => (state: IGameState): IGameState => {
	changeAmountOfCurrentChildren(-amount)(state);
	changeAmountOfChildrenKilled(amount)(state);

	return state;
};
