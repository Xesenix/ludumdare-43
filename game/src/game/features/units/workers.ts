import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === WORKERS_CURRENT

export const getCurrentWorkers = get<number>('workers.current', 0);
export const setCurrentWorkers = set<number>('workers.current');
export const changeAmountOfCurrentWorkers = changeAmountOf('workers.current');

// === WORKERS_TRAINED

export const getTrainedWorkers = get<number>('workers.trained', 0);
export const setTrainedWorkers = set<number>('workers.trained');
export const changeAmountOfTrainedWorkers = changeAmountOf('workers.trained');

// === WORKERS_KILLED_IN_THIS_TURN

export const getWorkersKilledInLastTurn = get<number>('workers.killed.current', 0);
export const setWorkersKilledInLastTurn = set<number>('workers.killed.current');
export const changeAmountOfWorkersKilledInLastTurn = changeAmountOf('workers.killed.current');

// === WORKERS_KILLED_IN_TOTAL

export const getWorkersKilledInTotal = get<number>('workers.killed.total', 0);
export const setWorkersKilledInTotal = set<number>('workers.killed.total');
export const changeAmountOfWorkersKilledInTotal = changeAmountOf('workers.killed.total');
