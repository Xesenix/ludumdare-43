import pipeline from 'pipeline-operator';

import { IGameState } from 'game/store';

import { applyWallReductionToAttackPower } from '../buildings/walls';
import { applyWeaknessToAttackPower } from './weakness';

// === ATTACK_POWER

export const getBaseAttackPower = (state: IGameState): number => {
	const { turn } = state;
	const power = (2 + 2 * turn * Math.ceil(turn / 2) + Math.floor(turn / 5) * 20) * Math.pow(1.5, Math.floor(turn / 50));

	return power;
};

export const getAttackPower = (state: IGameState): number =>
	pipeline(
		// prettier-ignore
		getBaseAttackPower(state),
		applyWeaknessToAttackPower(state),
		applyWallReductionToAttackPower(state),
	);
