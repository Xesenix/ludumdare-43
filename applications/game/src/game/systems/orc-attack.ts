import { IGameState } from 'game';
import { getFreeResourcesAmount } from 'game/models/resources/resources';
import { getAttackPower } from 'game/models/skills/attack';
import { getCurrentChildren } from 'game/models/units/children';
import { getCurrentGuards } from 'game/models/units/guards';
import { getCurrentIdles } from 'game/models/units/idles';
import { getCurrentWorkers } from 'game/models/units/workers';
import {
	// prettier-ignore
	killChildren,
	killGuards,
	killIdles,
	killWorkers,
} from 'game/systems/kill';
import { stealResources } from 'game/systems/steal';

export const handleOrcAttack = (state: IGameState): IGameState => {
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

	killGuards(guardsKilled)(state);
	killChildren(childrenKilled)(state);
	stealResources(resourcesStolen)(state);
	killIdles(idlesKilled)(state);
	killWorkers(workersKilled)(state);

	return state;
};
