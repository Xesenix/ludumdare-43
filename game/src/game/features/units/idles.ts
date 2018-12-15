import {
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === IDLES_CURRENT

export const getCurrentIdles = get<number>('idles', 'current');
export const setCurrentIdles = set<number>('idles', 'current');
export const changeAmountOfCurrentIdles = changeAmountOf('idles', 'current');

// === IDLES_TRAINED

export const getTrainedIdles = get<number>('idles', 'trained');
export const setTrainedIdles = set<number>('idles', 'trained');
export const changeAmountOfTrainedIdles = changeAmountOf('idles', 'trained');

// === IDLES_KILLED

export const getKilledIdles = get<number>('idles', 'killed');
export const setKilledIdles = set<number>('idles', 'killed');
export const changeAmountOfKilledIdles = changeAmountOf('idles', 'killed');

// === IDLES_MAX

export const getMaxIdles = get<number>('idles', 'max');
export const setMaxIdles = set<number>('idles', 'max');
export const changeAmountOfMaxIdles = changeAmountOf('idles', 'max');
