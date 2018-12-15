import {
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === CHILDREN_CURRENT

export const getCurrentChildren = get<number>('children', 'current');
export const setCurrentChildren = set<number>('children', 'current');
export const changeAmountOfCurrentChildren = changeAmountOf('children', 'current');

// === CHILDREN_TRAINED

export const getTrainedChildren = get<number>('children', 'trained');
export const setTrainedChildren = set<number>('children', 'trained');
export const changeAmountOfTrainedChildren = changeAmountOf('children', 'trained');

// === CHILDREN_KILLED

export const getKilledChildren = get<number>('children', 'killed');
export const setKilledChildren = set<number>('children', 'killed');
export const changeAmountOfKilledChildren = changeAmountOf('children', 'killed');

// === CHILDREN_MAX

export const getMaxChildren = get<number>('children', 'max');
export const setMaxChildren = set<number>('children', 'max');
export const changeAmountOfMaxChildren = changeAmountOf('children', 'max');
