import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === CHILDREN_CURRENT

export const getCurrentChildren = get<number>('children.current', 0);
export const setCurrentChildren = set<number>('children.current');
export const changeAmountOfCurrentChildren = changeAmountOf('children.current');

// === CHILDREN_KILLED_IN_THIS_TURN

export const getChildrenKilledInLastTurn = get<number>('children.killed.current', 0);
export const setChildrenKilledInLastTurn = set<number>('children.killed.current');
export const changeAmountOfChildrenKilledInLastTurn = changeAmountOf('children.killed.current');

// === CHILDREN_KILLED_IN_TOTAL

export const getChildrenKilledInTotal = get<number>('children.killed.total', 0);
export const setChildrenKilledInTotal = set<number>('children.killed.total');
export const changeAmountOfChildrenKilledInTotal = changeAmountOf('children.killed.total');
