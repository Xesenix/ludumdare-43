export const reduceHandleEvent = (state) => {
	if (!state.immunity) {
		switch (state.event) {
			case 'orcs':
				return reduceHandleOrcAttack(state);
		}
	}

	return state;
};

export const reduceHandleOrcAttack = (state) => {
	const { babies, workers, guards, idle, attackPower, resources } = state;
	let power = Math.floor(attackPower);
	const guardsKilled = Math.min(guards, Math.floor(power / 16));
	power = Math.max(0, power - guards * 16);
	const babiesKilled = Math.ceil(Math.min(babies, power * 2));
	power = Math.max(0, power - babiesKilled / 2);
	const resourcesStolen = Math.ceil(Math.min(resources, power * 2));
	power = Math.max(0, power - resourcesStolen / 2);
	const idleKilled = Math.ceil(Math.min(idle, power));
	power = Math.max(0, power - idleKilled);
	const workersKilled = Math.ceil(Math.min(workers, power));
	power = Math.max(0, power - workersKilled);

	const totallKilled = babiesKilled + workersKilled + idleKilled + guardsKilled;

	return {
		...state,
		idle: idle - idleKilled,
		resources: resources - resourcesStolen,
		workers: workers - workersKilled,
		guards: guards - guardsKilled,
		babies: babies - babiesKilled,
		idleKilled,
		workersKilled,
		babiesKilled,
		guardsKilled,
		resourcesStolen,
		totallKilled,
	};
};

export const reduceMakeNewPeople = (state) => {
	const newChildren = Math.floor(state.idle / 2);
	const newAdults = state.babies;

	return {
		...state,
		idle: state.idle + newAdults,
		babies: newChildren,
		newChildren,
		newAdults,
	};
};

export const reducePayGuards = (state) => {
	const guardsPaid = Math.min(state.guards, state.resources);

	return {
		...state,
		guards: guardsPaid,
		idle: state.idle + state.guards - guardsPaid,
		resources: state.resources - guardsPaid,
		guardsPaid,
	};
};

export const reduceGatherResources = (state) => {
	const resourceGathered = state.workers;

	return {
		...state,
		resources: state.resources + resourceGathered,
		resourceGathered,
	};
};

export const reduceTrainUnits = (state) => {
	const { idle, workers, trainedWorkers, guards, trainedGuards } = state;

	return {
		...state,
		idle: idle - trainedWorkers - trainedGuards,
		workers: workers + trainedWorkers,
		guards: guards + trainedGuards,
	};
};

export const reduceWallModifier = (state) => {
	const { attackPower, wallPower } = state;

	return {
		...state,
		attackPower: Math.max(0, attackPower - wallPower),
	};
};

export const reduceHomes = (state) => {
	const { maxPopulation, homesCount } = state;

	return {
		...state,
		maxPopulation: maxPopulation + homesCount * 20,
	};
};

export const reducePopulationLimit = (state) => {
	const { maxPopulation, workers, guards, idle, babies } = state;
	const maxIdle = Math.min(maxPopulation - workers - guards - babies, idle);

	return {
		...state,
		idle: maxIdle,
		babies: Math.min(maxPopulation - workers - guards - maxIdle, babies),
	};
};

export const reduceWeakness = (state) => {
	const { attackPower, weakness, weaknessReduction } = state;

	return {
		...state,
		attackPower: attackPower * Math.pow(1 - weaknessReduction, weakness),
	};
};
