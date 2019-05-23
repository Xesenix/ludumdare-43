import produce, { createDraft, finishDraft, setAutoFreeze } from 'immer';
import {
	cloneDeep,
	get as lodashGet,
	set as lodashSet,
} from 'lodash';
import pipeline from 'pipeline-operator';

import { BenchmarkSuite } from 'src/benchmark/benchmark-suite';

import { IGameState } from './interface';
import rulesFactory from './rules-factory';

const get = <T = any>(
	// prettier-ignore
	path: string,
	defaultValue: T,
) => (state: IGameState): T => lodashGet(state, path, defaultValue);

const changeAmountOf = (
	// prettier-ignore
	path: string,
	cloneState: boolean = false,
) => (value: number) => (state: IGameState): IGameState =>
	lodashSet<IGameState>(
		// prettier-ignore
		cloneState ? cloneDeep(state) : state,
		path,
		(lodashGet(state, path, 0) as number) + value,
	);

setAutoFreeze(false);

// increases time of cloneDeep
const junkSize = 10000;

const options = {
	async: true,
	initCount: 2000,
	// maxTime: 60 / 1000,
	// maxTime: 1,
	// minSamples: 200,
	// minTime: 0.16666,
};

const {
	incomeRule: incomeRuleV1,
	populationIncRule: populationIncRuleV1,
	warRule: warRuleV1,
	turnEndRule: turnEndRuleV1,
} = rulesFactory({
	currentUnitsSelector: (state: IGameState) => state.units.current,
	currentUnitsKilledSelector: (state: IGameState) => state.units.killed.current,
	currentResourcesSelector: (state: IGameState) => state.resources.current,
	currentResourcesStolenSelector: (state: IGameState) => state.resources.stolen.current,
	currentUnitsChange: (amount: number) => (state: IGameState) => {
		state.units.current += amount;
		return state;
	},
	currentUnitsKilledChange: (amount: number) => (state: IGameState) => {
		state.units.killed.current += amount;
		return state;
	},
	totalUnitsKilledChange: (amount: number) => (state: IGameState) => {
		state.units.killed.total += amount;
		return state;
	},
	currentResourcesChange: (amount: number) => (state: IGameState) => {
		state.resources.current += amount;
		return state;
	},
	currentResourcesStolenChange: (amount: number) => (state: IGameState) => {
		state.resources.stolen.current += amount;
		return state;
	},
	totalResourcesStolenChange: (amount: number) => (state: IGameState) => {
		state.resources.stolen.total += amount;
		return state;
	},
	turnInc: (state: IGameState) => {
		state.turn ++;
		return state;
	},
});

const progressNextTurnMutableV1 = (state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV1,
		populationIncRuleV1,
		warRuleV1,
		turnEndRuleV1,
	);
};

const progressNextTurnImmutableV1 = (state: IGameState) => {
	return pipeline(
		cloneDeep(state),
		incomeRuleV1,
		populationIncRuleV1,
		warRuleV1,
		turnEndRuleV1,
	);
};

const progressNextTurnProducerV1 = produce((state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV1,
		populationIncRuleV1,
		warRuleV1,
		turnEndRuleV1,
	);
});

const {
	incomeRule: incomeRuleV2,
	populationIncRule: populationIncRuleV2,
	warRule: warRuleV2,
	turnEndRule: turnEndRuleV2,
} = rulesFactory({
	currentUnitsSelector: get('units.current', 0),
	currentUnitsKilledSelector: get('units.killed.current', 0),
	currentResourcesSelector: get('resources.current', 0),
	currentResourcesStolenSelector: get('resources.stolen.current', 0),
	currentUnitsChange: changeAmountOf('units.current'),
	currentUnitsKilledChange: changeAmountOf('units.killed.current'),
	totalUnitsKilledChange: changeAmountOf('units.killed.total'),
	currentResourcesChange: changeAmountOf('resources.current'),
	currentResourcesStolenChange: changeAmountOf('resources.stolen.current'),
	totalResourcesStolenChange: changeAmountOf('resources.stolen.total'),
	turnInc: changeAmountOf('turn')(1),
});

const progressNextTurnMutableV2 = (state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV2,
		populationIncRuleV2,
		warRuleV2,
		turnEndRuleV2,
	);
};

const progressNextTurnImmutableV2 = (state: IGameState) => {
	return pipeline(
		cloneDeep(state),
		incomeRuleV2,
		populationIncRuleV2,
		warRuleV2,
		turnEndRuleV2,
	);
};

const progressNextTurnProducerV2 = produce((state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV2,
		populationIncRuleV2,
		warRuleV2,
		turnEndRuleV2,
	);
});

const suite: BenchmarkSuite = new BenchmarkSuite(`game rules`, {
	async: true,
}, `const junkSize = ${junkSize};

const progressNextTurnMutableV1 = (state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV1,
		populationIncRuleV1,
		warRuleV1,
		turnEndRuleV1,
	);
};

const progressNextTurnImmutableV1 = (state: IGameState) => {
	return pipeline(
		cloneDeep(state),
		incomeRuleV1,
		populationIncRuleV1,
		warRuleV1,
		turnEndRuleV1,
	);
};

const progressNextTurnProducerV1 = produce((state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV1,
		populationIncRuleV1,
		warRuleV1,
		turnEndRuleV1,
	);
});

const progressNextTurnMutableV2 = (state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV2,
		populationIncRuleV2,
		warRuleV2,
		turnEndRuleV2,
	);
};

const progressNextTurnImmutableV2 = (state: IGameState) => {
	return pipeline(
		cloneDeep(state),
		incomeRuleV2,
		populationIncRuleV2,
		warRuleV2,
		turnEndRuleV2,
	);
};

const progressNextTurnProducerV2 = produce((state: IGameState) => {
	return pipeline(
		state,
		incomeRuleV2,
		populationIncRuleV2,
		warRuleV2,
		turnEndRuleV2,
	);
});

let gameState: IGameState = {
	turn: 0,
	units: {
		current: 10,
		killed: { current: 0, total: 0 },
	},
	resources: {
		current: 10,
		stolen: { current: 0, total: 0 },
	},
	junk: (new Array(junkSize)).fill(0),
}`);

// prepare
let gameState: IGameState = {
	turn: 0,
	units: {
		current: 10,
		killed: { current: 0, total: 0 },
	},
	resources: {
		current: 10,
		stolen: { current: 0, total: 0 },
	},
	junk: (new Array(junkSize)).fill(0),
};

suite
.on('cycle', ({ target }) => {
	console.log('cycle', target.name, gameState);
	gameState = {
		turn: 0,
		units: {
			current: 10,
			killed: { current: 0, total: 0 },
		},
		resources: {
			current: 10,
			stolen: { current: 0, total: 0 },
		},
		junk: (new Array(junkSize)).fill(0),
	};
})
.add(() => {
	gameState = progressNextTurnMutableV1(gameState);
}, {
	...options,
	id: 'mutable v1',
	name: 'mutable v1',
	code: `gameState = progressNextTurnMutableV1(gameState);`,
})
.add(() => {
	gameState = progressNextTurnMutableV2(gameState);
}, {
	...options,
	id: 'mutable v2',
	name: 'mutable v2',
	code: `gameState = progressNextTurnMutableV2(gameState);`,
})
.add(() => {
	gameState = progressNextTurnImmutableV1(gameState);
}, {
	...options,
	id: 'immutable cloneDeep v1 (depends on state size)',
	name: 'immutable cloneDeep v1 (depends on state size)',
	code: `gameState = progressNextTurnImmutableV1(gameState);`,
})
.add(() => {
	gameState = progressNextTurnImmutableV2(gameState);
}, {
	...options,
	id: 'immutable cloneDeep v2 (depends on state size)',
	name: 'immutable cloneDeep v2 (depends on state size)',
	code: `gameState = progressNextTurnImmutableV2(gameState);`,
})
.add(() => {
	gameState = progressNextTurnProducerV1(gameState);
}, {
	...options,
	id: 'immutable immer producer v1',
	name: 'immutable immer producer v1',
	code: `gameState = progressNextTurnProducerV1(gameState);`,
})
.add(() => {
	gameState = progressNextTurnProducerV2(gameState);
}, {
	...options,
	id: 'immutable immer producer v2',
	name: 'immutable immer producer v2',
	code: `gameState = progressNextTurnProducerV2(gameState);`,
})
.add(() => {
	const draft = createDraft(gameState);
	progressNextTurnProducerV2(draft);
	gameState = finishDraft(draft);
}, {
	...options,
	id: 'immutable immer create batched(1) producer v2',
	name: 'immutable immer create batched(1) producer v2',
	code: `let draft = createDraft(gameState);
progressNextTurnProducerV2(draft);
gameState = finishDraft(draft)`,
});

export default suite;
