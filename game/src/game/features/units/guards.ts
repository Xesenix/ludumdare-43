import {
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === GUARDS_CURRENT

export const getCurrentGuards = get<number>('guards', 'current');
export const setCurrentGuards = set<number>('guards', 'current');
export const changeAmountOfCurrentGuards = changeAmountOf('guards', 'current');

// === GUARDS_TRAINED

export const getTrainedGuards = get<number>('guards', 'trained');
export const setTrainedGuards = set<number>('guards', 'trained');
export const changeAmountOfTrainedGuards = changeAmountOf('guards', 'trained');

// === GUARDS_KILLED

export const getKilledGuards = get<number>('guards', 'killed');
export const setKilledGuards = set<number>('guards', 'killed');
export const changeAmountOfKilledGuards = changeAmountOf('guards', 'killed');

// === GUARDS_MAX

export const getMaxGuards = get<number>('guards', 'max');
export const setMaxGuards = set<number>('guards', 'max');
export const changeAmountOfMaxGuards = changeAmountOf('guards', 'max');
