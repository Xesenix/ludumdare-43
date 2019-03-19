import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { IGameState } from 'game/store';

// === COTTAGES_LEVEL

export const getCottagesLevel = get<number>('cottages.level', 0);
export const setCottagesLevel = set<number>('cottages.level');
export const changeCottagesLevel = changeAmountOf('cottages.level');

// === COTTAGES_BUILD_COST

export const getCottagesBuildCost = (state: IGameState) => (amount: number) => {
	const level = getCottagesLevel(state);
	return Math.floor((5 + level * 10) * 1.5);
};
