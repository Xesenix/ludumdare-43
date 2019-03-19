import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === GUARDS_CURRENT

export const getCurrentGuards = get<number>('guards.current', 0);
export const setCurrentGuards = set<number>('guards.current');
export const changeAmountOfCurrentGuards = changeAmountOf('guards.current');

// === GUARDS_TRAINED

export const getTrainedGuards = get<number>('guards.trained', 0);
export const setTrainedGuards = set<number>('guards.trained');
export const changeAmountOfTrainedGuards = changeAmountOf('guards.trained');

// === GUARDS_KILLED_IN_THIS_TURN

export const getGuardsKilledInLastTurn = get<number>('guards.killed.current', 0);
export const setGuardsKilledInLastTurn = set<number>('guards.killed.current');
export const changeAmountOfGuardsKilledInLastTurn = changeAmountOf('guards.killed.current');

// === GUARDS_KILLED_IN_TOTAL

export const getGuardsKilledInTotal = get<number>('guards.killed.total', 0);
export const setGuardsKilledInTotal = set<number>('guards.killed.total');
export const changeAmountOfGuardsKilledInTotal = changeAmountOf('guards.killed.total');
