import Benchmark from 'benchmark';

export class BenchmarkSuite extends Benchmark.Suite {
	constructor(
		name: string,
		options: Benchmark.Options,
		public code: string,
	) {
		super(name, options);
	}
}
