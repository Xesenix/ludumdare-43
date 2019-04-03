import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { IGameState } from 'game/store';

// === WEAKNESS_LEVEL

export const getWeaknessLevel = get<number>('weakness.level', 0);
export const setWeaknessLevel = set<number>('weakness.level');
export const changeAmountOfWeaknessLevel = changeAmountOf('weakness.level');

// === WEAKNESS_PER_LEVEL_REDUCTION

export const getWeaknessPerLevelReduction = get<number>('weakness.perLevelReduction', 0);
export const setWeaknessPerLevelReduction = set<number>('weakness.perLevelReduction');
export const changeAmountOfWeaknessPerLevelReduction = changeAmountOf('weakness.perLevelReduction');

// === WEAKNESS_DAMAGE_REDUCTION

export const getWeaknessDamageReduction = (state: IGameState) => 1 - Math.pow(1 - getWeaknessPerLevelReduction(state), getWeaknessLevel(state));

export const applyWeaknessToAttackPower = (state: IGameState) => {
	const reduction = getWeaknessDamageReduction(state);

	return (power: number) => {
		return power * (1 - reduction);
	};
};
