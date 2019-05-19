import { BenchmarkSuite } from 'benchmark/benchmark-suite';

import { get } from './../../game/src/game/data';

interface IModel {
	a: {
		b: number;
		c: string;
		d: {
			e: string[];
		},
	};
}

// configure few ways of selecting data from same paths
const config: [string, any, (model: IModel) => any][] = [
	['a', {}, (model: IModel) => model.a || {}],
	['a.b', 0, (model: IModel) => model.a.b || 0],
	['a.c', 'hi', (model: IModel) => model.a.c || 'hi'],
	['a.d', null, (model: IModel) => model.a.d || null],
	['a.d.e', [], (model: IModel) => model.a.d.e || []],
	['a.d.e[1]', null, (model: IModel) => model.a.d.e[1] || null],
];

const selectors = config.map(([path, defaultValue]) => get(path, defaultValue));

const suite: BenchmarkSuite = new BenchmarkSuite('data selectors', {
	async: true,
}, `interface IModel {
	a: {
		b: number;
		c: string;
		d: {
			e: string[];
		},
	};
}

// configure few ways of selecting data from same paths
const config: [string, any, (model: IModel) => any][] = [
	['a', {}, (model: IModel) => model.a || {}],
	['a.b', 0, (model: IModel) => model.a.b || 0],
	['a.c', 'hi', (model: IModel) => model.a.c || 'hi'],
	['a.d', null, (model: IModel) => model.a.d || null],
	['a.d.e', [], (model: IModel) => model.a.d.e || []],
	['a.d.e[1]', null, (model: IModel) => model.a.d.e[1] || null],
];

const selectors = config.map(([path, defaultValue]) => get(path, defaultValue));

// prepare
let data: IModel = {
	a: {
		b: 123,
		c: 'dsa',
		d: {
			e: [
				'a',
				'b',
				'c',
			],
		},
	},
};
let step: number = 0;`);

// prepare
let data: IModel = {
	a: {
		b: 123,
		c: 'dsa',
		d: {
			e: [
				'a',
				'b',
				'c',
			],
		},
	},
};
let step: number = 0;

suite
.on('cycle', () => {
	data = {
		a: {
			b: 123,
			c: 'dsa',
			d: {
				e: [
					'a',
					'b',
					'c',
				],
			},
		},
	};
	step = 0;
})
.add(() => {
	config[step++ % config.length][2](data);
}, {
	id: 'hand made',
	name: 'hand made',
	code: `config[step++ % config.length][2](data);`,
})
.add(() => {
	selectors[step++ % selectors.length](data as any);
}, {
	id: 'generated via lodash get',
	name: 'generated via lodash get',
	code: `selectors[step++ % selectors.length](data as any);`,
});

export default suite;
