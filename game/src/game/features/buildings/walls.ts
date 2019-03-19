import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { IGameState } from 'game/store';

// === WALLS_LEVEL

export const getWallsLevel = get<number>('walls.level', 0);
export const setWallsLevel = set<number>('walls.level');
export const changeWallsLevel = changeAmountOf('walls.level');

// === WALLS_REDUCTION

export const getWallsReduction = (state: IGameState) => getWallsLevel(state) * getWallsPerLevelReduction(state);

// === WALLS_COST_MULTIPLIER

export const getWallsCostMultiplier = get<number>('walls.costMultiplier', 1);

// === WALLS_PER_LEVEL_REDUCTION

export const getWallsPerLevelReduction = get<number>('walls.perLevelReduction', 0);

// === WALLS_BUILD_COST

export const getWallsBuildCost = (state: IGameState) => (amount: number) => {
	const from = getWallsLevel(state);
	const to = from + amount;
	const costMultiplier = getWallsCostMultiplier(state);
	const perLevelReduction = getWallsPerLevelReduction(state);
	return Math.floor(0.5 * ((from + to - 1) * perLevelReduction + 10) * amount * costMultiplier);
};

export const applyWallReductionToAttackPower = (state: IGameState) => {
	const reduction = getWallsReduction(state);
	return (power: number) => {
		console.log('applyWallReductionToAttackPower', power, reduction);
		return Math.max(0, power - reduction);
	};
};
