import pipeline from 'pipeline-operator';

import {
	// prettier-ignore
	killChildren,
	killGuards,
	killIdles,
	killWorkers,
} from 'game/actions/kill';
import { stealResources } from 'game/actions/steal';
import { getFreeResourcesAmount } from 'game/features/resources/resources';
import { getAttackPower } from 'game/features/skills/attack';
import { getCurrentChildren } from 'game/features/units/children';
import { getCurrentGuards } from 'game/features/units/guards';
import { getCurrentIdles } from 'game/features/units/idles';
import { getCurrentWorkers } from 'game/features/units/workers';
import { IGameState } from 'game/store';

export const reduceHandleEvent = (state: IGameState) => {
	if (!state.immunity) {
		switch (state.event) {
			case 'orcs':
				return reduceHandleOrcAttack(state);
		}
	}

	return state;
};

export const reduceHandleOrcAttack = (state: IGameState) => {
	const attackPower = getAttackPower(state);
	let power = Math.floor(attackPower);
	const guards = getCurrentGuards(state);
	const guardsKilled = Math.min(guards, Math.floor(power / 16));
	power = Math.max(0, power - guards * 16);
	const children = getCurrentChildren(state);
	const childrenKilled = Math.ceil(Math.min(children, power * 2));
	power = Math.max(0, power - childrenKilled / 2);
	const resourcesAmount = getFreeResourcesAmount(state);
	const resourcesStolen = Math.ceil(Math.min(resourcesAmount, power * 2));
	power = Math.max(0, power - resourcesStolen / 2);
	const idles = getCurrentIdles(state);
	const idlesKilled = Math.ceil(Math.min(idles, power));
	power = Math.max(0, power - idlesKilled);
	const workers = getCurrentWorkers(state);
	const workersKilled = Math.ceil(Math.min(workers, power));
	power = Math.max(0, power - workersKilled);

	return pipeline(
		state,
		killGuards(guardsKilled),
		killChildren(childrenKilled),
		stealResources(resourcesStolen),
		killIdles(idlesKilled),
		killWorkers(workersKilled),
	);
};
