import { IGameState } from 'game/store';

// === COTTAGES_LEVEL

export const getCottagesLevel = (state: IGameState) => state.cottages.level;
export const setCottagesLevel = (value: number) => (state: IGameState) => { state.cottages.level = value; return state; };
export const changeCottagesLevel = (amount: number) => (state: IGameState) => { state.cottages.level += amount; };

// === COTTAGES_BUILD_COST

export const getCottagesBuildCost = (state: IGameState) => (amount: number) => {
	const level = getCottagesLevel(state);
	return Math.floor((5 + level * 10) * 1.5);
};
