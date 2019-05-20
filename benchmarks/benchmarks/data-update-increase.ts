import produce, { createDraft, finishDraft, setAutoFreeze } from 'immer';

import { BenchmarkSuite } from 'benchmark/benchmark-suite';

setAutoFreeze(false);

const options = {
	async: true,
	initCount: 100,
	maxTime: 60 / 1000,
	// maxTime: 1,
	// minSamples: 200,
	// minTime: 0.16666,
};

const junkSize = 1000000;


interface IModel {
	a: number;
	b: number;
	junk: number[];
}

interface IAction {
	type: string;
	value: number;
}

const actions: IAction[] = [
	{ type: 'incA', value: 2 },
	{ type: 'incA', value: -1 },
	{ type: 'incB', value: 1 },
	{ type: 'incB', value: -2 },
];

// immer
const recipe = (action: IAction) => (state: IModel) => {
	switch (action.type) {
		case 'incA':
			state.a += action.value;
			return;
		case 'incB':
			state.b += action.value;
			return;
	}
};

const curriedRecipe = (state: IModel) => (action: IAction) => {
	switch (action.type) {
		case 'incA':
			state.a += action.value;
			return;
		case 'incB':
			state.b += action.value;
			return;
	}
};

// redux
const reducer = (state: IModel = { a: 0, b: 0, junk: [] }, action: IAction = { type: '', value: 0 }) => {
	switch (action.type) {
		case 'incA':
			return {
				...state,
				a: state.a + action.value,
			};
		case 'incB':
			return {
				...state,
				b: state.b + action.value,
			};
	}

	return state;
};

const reducerWithoutDefault = (state: IModel, action: IAction) => {
	switch (action.type) {
		case 'incA':
			return {
				...state,
				a: state.a + action.value,
			};
		case 'incB':
			return {
				...state,
				b: state.b + action.value,
			};
	}

	return state;
};

const suite: BenchmarkSuite = new BenchmarkSuite(`Data update increase`, {
	async: true,
}, `interface IModel {
	a: number;
	b: number;
	junk: number[];
}

interface IAction {
	type: string;
	value: number;
}

const junkSize = ${junkSize};

const actions: IAction[] = [
	{ type: 'incA', value: 2 },
	{ type: 'incA', value: -1 },
	{ type: 'incB', value: 1 },
	{ type: 'incB', value: -2 },
];

// immer
const recipe = (action: IAction) => (state: IModel) => {
	switch (action.type) {
		case 'incA':
			state.a += action.value;
			return;
		case 'incB':
			state.b += action.value;
			return;
	}
};

const curriedRecipe = (state: IModel) => (action: IAction) => {
	switch (action.type) {
		case 'incA':
			state.a += action.value;
			return;
		case 'incB':
			state.b += action.value;
			return;
	}
};

// redux
const reducer = (state: IModel = { a: 0, b: 0, junk: [] }, action: IAction = { type: '', value: 0 }) => {
	switch (action.type) {
		case 'incA':
			return {
				...state,
				a: state.a + action.value,
			};
		case 'incB':
			return {
				...state,
				b: state.b + action.value,
			};
	}

	return state;
};

const reducerWithoutDefault = (state: IModel, action: IAction) => {
	switch (action.type) {
		case 'incA':
			return {
				...state,
				a: state.a + action.value,
			};
		case 'incB':
			return {
				...state,
				b: state.b + action.value,
			};
	}

	return state;
};

// prepare
let data: IModel = { a: 0, b: 0, junk: (new Array(junkSize)).fill(0) };
let draft = createDraft(data);
let step = 0;`);

// prepare
let data: IModel = { a: 0, b: 0, junk: (new Array(junkSize)).fill(0) };
let draft = createDraft(data);
let step = 0;

suite
.on('cycle', ({ target }) => {
	console.log('cycle', target.name, data);
	// cleanup
	draft = createDraft(data);
	data = { a: 0, b: 0, junk: (new Array(junkSize)).fill(0) };
	step = 0;
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	data.a += doAction.value;
}, {
	...options,
	id: 'mutable',
	name: 'mutable',
	code: `const doAction = actions[step++ % actions.length];
data.a += doAction.value;`,
})
.add(() => {
	const doAction = actions[step++ % actions.length];
	switch (doAction.type) {
		case 'incA':
			data = {
				...data,
				a: data.a + doAction.value,
			};
			return;
		case 'incB':
			data = {
				...data,
				b: data.b + doAction.value,
			};
			return;
	}
}, {
	...options,
	id: 'plain implementation',
	name: 'plain implementation',
	code: `const doAction = actions[step++ % actions.length];
switch (doAction.type) {
	case 'incA':
		data = {
			...data,
			a: data.a + doAction.value,
		};
		return;
	case 'incB':
		data = {
			...data,
			b: data.b + doAction.value,
		};
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
	data = produce(data, (state) => {
		switch (doAction.type) {
			case 'incA':
				state.a += doAction.value;
				return;
			case 'incB':
				state.b += doAction.value;
				return;
		}
	});
}, {
	...options,
	id: 'immer inlined',
	name: 'immer inlined',
	code: `const doAction = actions[step++ % actions.length];
data = produce(data, (state) => {
	switch (doAction.type) {
		case 'incA':
			state.a += doAction.value;
			return;
		case 'incB':
			state.b += doAction.value;
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
	draft = curriedRecipe(draft)(doAction);
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
	draft = curriedRecipe(draft)(doAction);
}`,
});

export default suite;
