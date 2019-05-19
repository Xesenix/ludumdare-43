import { BenchmarkSuite } from 'benchmark/benchmark-suite';

interface IModel {
	a: number;
}

const predefined = (model: IModel) => {
	return (param: number) => {
		model.a += param;
	};
};

const suit: BenchmarkSuite = new BenchmarkSuite(`Functions creation complex`, {
	async: true,
}, `interface IModel {
	a: number;
}

const predefined = (model: IModel) => {
	return (param: number) => {
		model.a += param;
	};
};

// prepare
let data: IModel = { a: 0 };
let test: (model: IModel, param: number, cb: (model: IModel) => void) => (param: number) => void
	= (model: IModel, param: number, cb: (model: IModel) => (param: number) => void) => cb(model)(param);`,
);

// prepare
let data: IModel = { a: 0 };
let test: (model: IModel, param: number, cb: (model: IModel) => void) => (param: number) => void
	= (model: IModel, param: number, cb: (model: IModel) => (param: number) => void) => cb(model)(param);

suit.on('cycle', () => {
	data = { a: 0 };
	test = (model: IModel, param: number, cb: (model: IModel) => (param: number) => void) => cb(model)(param);
})
.add(() => {
	test(data, 1, (model: IModel) => {
		return (param: number) => model.a += param;
	});
}, {
	id: 'in place instantiation',
	name: 'in place instantiation',
	code: `test(data, 1, (model: IModel) => {
	return (param: number) => model.a += param;
});`,
})
.add(() => {
	test(data, 1, predefined);
}, {
	id: 'predefined',
	name: 'predefined',
	code: `test(data, 1, predefined);`,
});

export default suit;
