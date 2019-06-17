import { IGameState } from 'game';

// === WALLS_LEVEL

export const getWallsLevel = (state: IGameState) => state.walls.level;
export const setWallsLevel = (value: number) => (state: IGameState) => { state.walls.level = value; return state; };
export const changeWallsLevel = (amount: number) => (state: IGameState) => { state.walls.level += amount; };

// === WALLS_REDUCTION

export const getWallsReduction = (state: IGameState) => getWallsLevel(state) * getWallsPerLevelReduction(state);

// === WALLS_COST_MULTIPLIER

export const getWallsCostMultiplier = (state: IGameState) => state.walls.costMultiplier || 1;

// === WALLS_PER_LEVEL_REDUCTION

export const getWallsPerLevelReduction = (state: IGameState) => state.walls.perLevelReduction;

// === WALLS_BUILD_COST

export const getWallsBuildCost = (state: IGameState) => (amount: number) => {
	const from = getWallsLevel(state);
	const to = from + amount;
	const costMultiplier = getWallsCostMultiplier(state);
	const perLevelReduction = getWallsPerLevelReduction(state);
	return Math.floor(0.5 * ((from + to - 1) * perLevelReduction + 10) * amount * costMultiplier);
};

export const applyWallReductionToAttackPower = (state: IGameState, power: number) => {
	const reduction = getWallsReduction(state);
	return Math.max(0, power - reduction);
};
