import { BenchmarkSuite } from 'benchmark/benchmark-suite';
import { createDraft, finishDraft, setAutoFreeze } from 'immer';
import cloneDeep from 'lodash-es/cloneDeep';

setAutoFreeze(false);

const options = {
	async: true,
	initCount: 1000,
	maxTime: 1 / 60,
	// minSamples: 200,
	// minTime: 0.16666,
};

interface IModel {
	junk: {
		a: number;
		b: string;
		c: number[];
		d: string[];
		e: {
			a: number;
			b: string;
			c: number[];
			d: string[];
		};
	}[];
}

const junk: IModel = {
	a: 0,
	b: 'yoyo',
	c: (new Array(20)).fill(13),
	d: (new Array(20)).fill('x'),
	e: {
		a: 42,
		b: 'xoxo',
		c: (new Array(20)).fill(13),
		d: (new Array(20)).fill('x'),
	},
};

const jsonClone = (data: any) => JSON.parse(JSON.stringify(data));

const test = (data: IModel) => {
	data.junk[0].a ++;
	for (let i = 0; i < data.junk[0].c.length; i++) {
		data.junk[0].c[i]++;
	}
};

const suite: BenchmarkSuite = new BenchmarkSuite(`deep copy`, {
	async: true,
}, `interface IModel {
	junk: {
		a: number;
		b: string;
		c: number[];
		d: string[];
		e: {
			a: number;
			b: string;
			c: number[];
			d: string[];
		};
	}[];
}

const junk: IModel = {
	a: 0,
	b: 'yoyo',
	c: (new Array(20)).fill(13),
	d: (new Array(20)).fill('x'),
	e: {
		a: 42,
		b: 'xoxo',
		c: (new Array(20)).fill(13),
		d: (new Array(20)).fill('x'),
	},
};

const jsonClone = (data: any) => JSON.parse(JSON.stringify(data));

const test = (data: IModel) => {
	data.junk[0].a ++;
	for (let i = 0; i < data.junk[0].c.length; i++) {
		data.junk[0].c[i]++;
	}
}

// prepare
let data1: IModel = { junk: (new Array(1)).fill(junk).map(cloneDeep) };
let data100: IModel = { junk: (new Array(100)).fill(junk).map(cloneDeep) };
let data1000: IModel = { junk: (new Array(1000)).fill(junk).map(cloneDeep) };`);

// prepare
let data1: IModel = { junk: (new Array(1)).fill(junk).map(cloneDeep) };
let data100: IModel = { junk: (new Array(100)).fill(junk).map(cloneDeep) };
let data1000: IModel = { junk: (new Array(1000)).fill(junk).map(cloneDeep) };

suite
.on('cycle', ({ target }) => {
	console.log(
		'cycle',
		target.name,
		data1.junk[0].a,
		data100.junk[0].a,
		data100.junk[1].a,
		data1000.junk[0].a,
		data1000.junk[1].a,
	);
	data1 = { junk: (new Array(1)).fill(junk).map(cloneDeep) };
	data100 = { junk: (new Array(100)).fill(junk).map(cloneDeep) };
	data1000 = { junk: (new Array(1000)).fill(junk).map(cloneDeep) };
})
// ======== cloneDeep ===============
.add(() => {
	data1 = cloneDeep(data1);
	test(data1);
}, {
	...options,
	id: 'cloneDeep(1)',
	name: 'cloneDeep(1)',
	code: `data1 = cloneDeep(data1);
test(data1);`,
})
.add(() => {
	data100 = cloneDeep(data100);
	data100.junk[0].a ++;
	test(data100);
}, {
	...options,
	id: 'cloneDeep(100)',
	name: 'cloneDeep(100)',
	code: `data100 = cloneDeep(data100);
test(data100);`,
})
.add(() => {
	data1000 = cloneDeep(data1000);
	test(data1000);
}, {
	...options,
	id: 'cloneDeep(1000)',
	name: 'cloneDeep(1000)',
	code: `data1000 = cloneDeep(data1000);
test(data1000);`,
})
// ======== jsonClone ===============
.add(() => {
	data1 = jsonClone(data1);
	test(data1);
}, {
	...options,
	id: 'jsonClone(1)',
	name: 'jsonClone(1)',
	code: `data1 = jsonClone(data1);
test(data1);`,
})
.add(() => {
	data100 = jsonClone(data100);
	data100.junk[0].a ++;
	test(data100);
}, {
	...options,
	id: 'jsonClone(100)',
	name: 'jsonClone(100)',
	code: `data100 = jsonClone(data100);
test(data100);`,
})
.add(() => {
	data1000 = jsonClone(data1000);
	test(data1000);
}, {
	...options,
	id: 'jsonClone(1000)',
	name: 'jsonClone(1000)',
	code: `data1000 = jsonClone(data1000);
test(data1000);`,
})
// ========= immer create draft ==============
.add(() => {
	const draft = createDraft(data1);
	test(draft);
	data1 = finishDraft(draft);
}, {
	...options,
	id: 'immer create draft (1)',
	name: 'immer create draft (1)',
	code: `const draft = createDraft(data1);
test(draft);
data1 = finishDraft(draft);`,
})
.add(() => {
	const draft = createDraft(data100);
	test(draft);
	data100 = finishDraft(draft);
}, {
	...options,
	id: 'immer create draft (100)',
	name: 'immer create draft (100)',
	code: `const draft = createDraft(data100);
test(draft);
data100 = finishDraft(draft);`,
})
.add(() => {
	const draft = createDraft(data1000);
	test(draft);
	data1000 = finishDraft(draft);
}, {
	...options,
	id: 'immer create draft (1000)',
	name: 'immer create draft (1000)',
	code: `const draft = createDraft(data1000);
test(draft);
data1000 = finishDraft(draft);`,
});

export default suite;
