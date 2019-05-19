import produce, { createDraft, finishDraft } from 'immer';

import { BenchmarkSuite } from 'benchmark/benchmark-suite';

const options = {
	async: true,
	initCount: 100,
	maxTime: 60 / 1000,
	// minSamples: 200,
	// minTime: 0.16666,
};

interface IModel {
	a: string[];
}

const doAction: { type: string } = { type: 'push' };

// immer
const recipe = (action: { type: string }) => (state: IModel) => {
	switch (action.type) {
		case 'push':
			state.a.push('x');
			return;
	}
};

const curriedRecipe = (state: IModel, action: { type: string }) => {
	switch (action.type) {
		case 'inc':
			state.a.push('x');
			return;
	}
};

const curriedProducer = produce(curriedRecipe);

// redux
const reducer = (state: IModel = { a: [] }, action: { type: string } = { type: '' }) => {
	switch (action.type) {
		case 'push':
			return {
				...state,
				a: [...state.a, 'x'],
			};
	}

	return state;
};

const reducerWithoutDefault = (state: IModel, action: { type: string }) => {
	switch (action.type) {
		case 'push':
			return {
				...state,
				a: [...state.a, 'x'],
			};
	}

	return state;
};

const suit: BenchmarkSuite = new BenchmarkSuite(`Data update push immutable`, {
	async: true,
}, `interface IModel {
	a: string[];
}

const doAction: { type: string } = { type: 'push' };

// immer
const recipe = (action: { type: string }) => (state: IModel) => {
	switch (action.type) {
		case 'push':
			state.a.push('x');
			return;
	}
};

const curriedRecipe = (state: IModel, action: { type: string }) => {
	switch (action.type) {
		case 'inc':
			state.a.push('x');
			return;
	}
};

const curriedProducer = produce(curriedRecipe);

// redux
const reducer = (state: IModel = { a: [] }, action: { type: string } = { type: '' }) => {
	switch (action.type) {
		case 'push':
			return {
				...state,
				a: [...state.a, 'x'],
			};
	}

	return state;
};

const reducerWithoutDefault = (state: IModel, action: { type: string }) => {
	switch (action.type) {
		case 'push':
			return {
				...state,
				a: [...state.a, 'x'],
			};
	}

	return state;
};

// prepare
let data: IModel = { a: [] };
let draft = createDraft(data);
let step = 0;`);

// prepare
let data: IModel = { a: [] };
let draft = createDraft(data);
let step = 0;

suit
.on('cycle', () => {
	console.log('cycle', data);
	// cleanup
	draft = createDraft(data);
	data = { a: [] };
	step = 0;
})
// .add(() => {
// 	switch (doAction.type) {
// 		case 'push':
// 			data.a.push('x');
// 			return;
// 	}
// }, {
// 	...options,
// 	id: 'mutable',
// 	name: 'mutable',
// 	code: `switch (doAction.type) {
// 	case 'push':
// 		data.a.push('x');
// 		return;
// }`,
// })
.add(() => {
	switch (doAction.type) {
		case 'push':
			data.a = [...data.a, 'x'];
			return;
	}
}, {
	...options,
	id: 'plain implementation',
	name: 'plain implementation',
	code: `switch (doAction.type) {
	case 'push':
		data.a = [...data.a, 'x'];
		return;
}`,
})
.add(() => {
	data = reducer(data, doAction);
}, {
	...options,
	id: 'reducer with defaults',
	name: 'reducer with defaults',
	code: `data = reducer(data, doAction);`,
})
.add(() => {
	data = reducerWithoutDefault(data, doAction);
}, {
	...options,
	id: 'reducer without defaults',
	name: 'reducer without defaults',
	code: `data = reducerWithoutDefault(data, doAction);`,
})
.add(() => {
	data = produce(data, (state: IModel) => {
		switch (doAction.type) {
			case 'push':
				state.a.push('x');
				return;
		}
	});
}, {
	...options,
	id: 'immer inline',
	name: 'immer inline',
	code: `data = produce(data, (state: IModel) => {
	switch (doAction.type) {
		case 'push':
			state.a.push('x');
			return;
	}
});`,
})
.add(() => {
	data = produce(data, recipe(doAction));
}, {
	...options,
	id: 'immer predefined',
	name: 'immer predefined',
	code: `data = produce(data, recipe(doAction));`,
})
.add(() => {
	data = curriedProducer(data, doAction);
}, {
	...options,
	id: 'immer curriedProducer predefined',
	name: 'immer curriedProducer predefined',
	code: `data = curriedProducer(data, doAction);`,
})
.add(() => {
	draft = createDraft(data);
	curriedRecipe(draft, doAction);
	data = finishDraft(draft);
}, {
	...options,
	id: 'immer batched(1)',
	name: 'immer batched(1)',
	code: `draft = createDraft(data);
curriedRecipe(draft, doAction);
data = finishDraft(draft);`,
})
.add(() => {
	if (step % 20 === 0) {
		data = finishDraft(draft);
		draft = createDraft(data);
	} else {
		curriedRecipe(draft, doAction);
	}
	step++;
}, {
	...options,
	id: 'immer batched(20)',
	name: 'immer batched(20)',
	code: `if (step % 20 === 0) {
	data = finishDraft(draft);
	draft = createDraft(data);
} else {
	draft = curriedRecipe(draft, doAction);
}
step++;`,
})
.add(() => {
	if (step % 100 === 0) {
		data = finishDraft(draft);
		draft = createDraft(data);
	} else {
		curriedRecipe(draft, doAction);
	}
	step++;
}, {
	...options,
	id: 'immer batched(100)',
	name: 'immer batched(100)',
	code: `if (step % 100 === 0) {
	data = finishDraft(draft);
	draft = createDraft(data);
} else {
	draft = curriedRecipe(draft, doAction);
}
step++;`,
});

export default suit;
