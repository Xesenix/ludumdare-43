import produce, { createDraft, finishDraft, setAutoFreeze } from 'immer';

import { BenchmarkSuite } from 'benchmark/benchmark-suite';

setAutoFreeze(false);
const junkSize = 1000000;

const options = {
	async: true,
	initCount: 1000,
	maxTime: 1 / 60,
	// minSamples: 200,
	// minTime: 0.16666,
};

interface IModel {
	a: string[];
	b: string[];
	junk: number[];
}

interface IAction {
	type: string;
	value: string;
}

const actions: IAction[] = [
	{ type: 'pushA', value: 'x' },
	{ type: 'pushA', value: 'y' },
	{ type: 'pushB', value: 'z' },
	{ type: 'pushB', value: 't' },
];

// immer
const recipe = (action: IAction) => (state: IModel) => {
	switch (action.type) {
		case 'pushA':
			state.a.push(action.value);
			return;
		case 'pushA':
			state.b.push(action.value);
			return;
	}
};

const curriedRecipe = (state: IModel) => (action: IAction) => {
	switch (action.type) {
		case 'pushA':
			state.a.push(action.value);
			return;
		case 'pushB':
			state.b.push(action.value);
			return;
	}
};

// redux
const reducer = (state: IModel = { a: [], b: [] }, action: IAction = { type: '', value: '' }) => {
	switch (action.type) {
		case 'pushA':
			return {
				...state,
				a: [...state.a, action.value],
			};
		case 'pushB':
			return {
				...state,
				b: [...state.b, action.value],
			};
	}

	return state;
};

const reducerWithoutDefault = (state: IModel, action: IAction) => {
	switch (action.type) {
		case 'pushA':
			return {
				...state,
				a: [...state.a, action.value],
			};
		case 'pushB':
			return {
				...state,
				b: [...state.b, action.value],
			};
	}

	return state;
};

const suite: BenchmarkSuite = new BenchmarkSuite(`Data update push immutable`, {
	async: true,
}, `interface IModel {
	a: string[];
	b: string[];
	junk: number[];
}

interface IAction {
	type: string;
	value: string;
}

const junkSize = ${junkSize};
const actions: IAction[] = [
	{ type: 'pushA', value: 'x' },
	{ type: 'pushA', value: 'y' },
	{ type: 'pushB', value: 'z' },
	{ type: 'pushB', value: 't' },
];

// immer
const recipe = (action: IAction) => (state: IModel) => {
	switch (action.type) {
		case 'pushA':
			state.a.push(action.value);
			return;
		case 'pushA':
			state.b.push(action.value);
			return;
	}
};

const curriedRecipe = (state: IModel) => (action: IAction) => {
	switch (action.type) {
		case 'pushA':
			state.a.push(action.value);
			return;
		case 'pushB':
			state.b.push(action.value);
			return;
	}
};

// redux
const reducer = (state: IModel = { a: [] }, action: IAction = { type: '' }) => {
	switch (action.type) {
		case 'pushA':
			return {
				...state,
				a: [...state.a, action.value],
			};
		case 'pushB':
			return {
				...state,
				b: [...state.b, action.value],
			};
	}

	return state;
};

const reducerWithoutDefault = (state: IModel, action: IAction) => {
	switch (action.type) {
		case 'pushA':
			return {
				...state,
				a: [...state.a, action.value],
			};
		case 'pushB':
			return {
				...state,
				b: [...state.b, action.value],
			};
	}

	return state;
};

// prepare
let data: IModel = { a: [], b: [], junk: (new Array(junkSize)).fill(0) };
let draft = createDraft(data);
let step = 0;`);

// prepare
let data: IModel = { a: [], b: [], junk: (new Array(junkSize)).fill(0)  };
let draft = createDraft(data);
let step = 0;

suite
.on('cycle', ({ target }) => {
	console.log('cycle', target.name, target.count, target.stats, data);
	// cleanup
	draft = createDraft(data);
	data = { a: [], b: [], junk: (new Array(junkSize)).fill(0) };
	step = 0;
})
// .add(() => {
// 	switch (doAction.type) {
// 		case 'pushA':
// 			data.a.push(action.value);
// 			return;
// 	}
// }, {
// 	...options,
// 	id: 'mutable',
// 	name: 'mutable',
// 	code: `switch (doAction.type) {
// 	case 'pushA':
// 		data.a.push(action.value);
// 		return;
// }`,
// })
.add(() => {
	const doAction = actions[step++ % actions.length];
	switch (doAction.type) {
		case 'pushA':
			data.a = [...data.a, doAction.value];
			return;
		case 'pushB':
			data.b = [...data.b, doAction.value];
			return;
	}
}, {
	...options,
	id: 'plain implementation',
	name: 'plain implementation',
	code: `const doAction = actions[step++ % actions.length];
switch (doAction.type) {
	case 'pushA':
		data.a = [...data.a, doAction.value];
		return;
	case 'pushB':
		data.b = [...data.b, doAction.value];
		return;
}`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	data = reducer(data, doAction);
}, {
	...options,
	id: 'reducer with defaults',
	name: 'reducer with defaults',
	code: `const doAction = actions[step++ % actions.length];
data = reducer(data, doAction);`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	data = reducerWithoutDefault(data, doAction);
}, {
	...options,
	id: 'reducer without defaults',
	name: 'reducer without defaults',
	code: `const doAction = actions[step++ % actions.length];
data = reducerWithoutDefault(data, doAction);`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	data = produce(data, (state: IModel) => {
		switch (doAction.type) {
			case 'pushA':
				state.a.push(doAction.value);
				return;
			case 'pushB':
				state.b.push(doAction.value);
				return;
		}
	});
}, {
	...options,
	id: 'immer inline',
	name: 'immer inline',
	code: `const doAction = actions[step++ % actions.length];
data = produce(data, (state: IModel) => {
	switch (doAction.type) {
		case 'pushA':
			state.a.push(doAction.value);
			return;
		case 'pushB':
			state.b.push(doAction.value);
			return;
	}
});`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	data = produce(data, recipe(doAction));
}, {
	...options,
	id: 'immer predefined',
	name: 'immer predefined',
	code: `const doAction = actions[step++ % actions.length];
data = produce(data, recipe(doAction));`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	draft = createDraft(data);
	curriedRecipe(draft)(doAction);
	data = finishDraft(draft);
}, {
	...options,
	id: 'immer batched(1)',
	name: 'immer batched(1)',
	code: `const doAction = actions[step++ % actions.length];
draft = createDraft(data);
curriedRecipe(draft)(doAction);
data = finishDraft(draft);`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	if (step % 20 === 0) {
		data = finishDraft(draft);
		draft = createDraft(data);
	} else {
		curriedRecipe(draft)(doAction);
	}
}, {
	...options,
	id: 'immer batched(20)',
	name: 'immer batched(20)',
	code: `const doAction = actions[step++ % actions.length];
if (step % 20 === 0) {
	data = finishDraft(draft);
	draft = createDraft(data);
} else {
	curriedRecipe(draft)(doAction);
}`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	if (step % 100 === 0) {
		data = finishDraft(draft);
		draft = createDraft(data);
	} else {
		curriedRecipe(draft)(doAction);
	}
}, {
	...options,
	id: 'immer batched(100)',
	name: 'immer batched(100)',
	code: `const doAction = actions[step++ % actions.length];
if (step % 100 === 0) {
	data = finishDraft(draft);
	draft = createDraft(data);
} else {
	curriedRecipe(draft)(doAction);
}`,
});

export default suite;
