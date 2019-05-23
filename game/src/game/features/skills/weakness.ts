import { IGameState } from 'game/store';

// === WEAKNESS_LEVEL

export const getWeaknessLevel = (state: IGameState) => state.weakness.level;
export const setWeaknessLevel = (value: number) => (state: IGameState) => { state.weakness.level = value; return state; };
export const changeAmountOfWeaknessLevel = (amount: number) => (state: IGameState) => { state.weakness.level += amount; return state; };

// === WEAKNESS_PER_LEVEL_REDUCTION

export const getWeaknessPerLevelReduction = (state: IGameState) => state.weakness.perLevelReduction;
export const setWeaknessPerLevelReduction = (value: number) => (state: IGameState) => { state.weakness.perLevelReduction = value; return state; };
export const changeAmountOfWeaknessPerLevelReduction = (amount: number) => (state: IGameState) => { state.weakness.perLevelReduction += amount; return state; };

// === WEAKNESS_DAMAGE_REDUCTION

export const getWeaknessDamageReduction = (state: IGameState) => 1 - Math.pow(1 - getWeaknessPerLevelReduction(state), getWeaknessLevel(state));

export const applyWeaknessToAttackPower = (state: IGameState, power: number) => {
	const reduction = getWeaknessDamageReduction(state);
	return power * (1 - reduction);
};
