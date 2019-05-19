import { BenchmarkSuite } from 'benchmark/benchmark-suite';

interface IModel {
	a: number;
}

const predefined = (model: IModel) => {
	model.a ++;
};

const suite: BenchmarkSuite = new BenchmarkSuite(`Functions creation simple`, {
	async: true,
}, `interface IModel {
	a: number;
}

const predefined = (model: IModel) => {
	model.a ++;
};

// prepare
let data: IModel = { a: 0 };
let test: (model: IModel, cb: (model: IModel) => void) => void
	= (model: IModel, cb: (model: IModel) => void) => cb(model);`);

// prepare
let data: IModel = { a: 0 };
let test: (model: IModel, cb: (model: IModel) => void) => void
	= (model: IModel, cb: (model: IModel) => void) => cb(model);

suite
.on('cycle', () => {
	data = { a: 0 };
	test = (model: IModel, cb: (model: IModel) => void) => cb(model);
})
.add(() => {
	test(data, (model: IModel) => {
		model.a ++;
	});
}, {
	id: 'in place instantiation',
	name: 'in place instantiation',
	code: `test(data, (model: IModel) => {
	model.a ++;
});`,
})
.add(() => {
	test(data, predefined);
}, {
	id: 'predefined',
	name: 'predefined',
	code: `test(data, predefined);`,
});

export default suite;
