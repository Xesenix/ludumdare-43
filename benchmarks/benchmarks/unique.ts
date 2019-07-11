import { BenchmarkSuite } from 'benchmark/benchmark-suite';

const suite: BenchmarkSuite = new BenchmarkSuite(`unique array items`, {
	async: true,
}, ``);

// prepare
let data = new Array(1000).fill(0).map(() => Math.floor(Math.random() * 100));

suite
.on('cycle', () => {
	data = new Array(1000).fill(0).map(() => Math.floor(Math.random() * 100));
})
.add(() => {
	Array.from(new Set(data));
}, {
	id: 'unique by set',
	name: 'unique by set',
	code: `Array.from(new Set(data));`,
});

export default suite;
